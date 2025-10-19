package com.docuflow.service;

import com.docuflow.model.DocumentAudit;
import com.docuflow.model.Notification;
import com.docuflow.repository.DocumentAuditRepository;
import com.docuflow.repository.NotificationRepository;
import org.apache.pulsar.client.api.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import java.time.Instant;

@Service
public class AuditService {

	private final DocumentAuditRepository repo;
	private final NotificationRepository notificationRepo;
	private PulsarClient client;
	private Producer<byte[]> producer;

	@Value("${app.pulsar.serviceUrl:pulsar://localhost:6650}")
	private String pulsarUrl;

	public AuditService(DocumentAuditRepository repo, NotificationRepository notificationRepo) { this.repo = repo; this.notificationRepo = notificationRepo; }

	@PostConstruct
	public void init() {
		try {
			client = PulsarClient.builder().serviceUrl(pulsarUrl).build();
			producer = client.newProducer().topic("persistent://public/default/doc-events").create();
		} catch (Exception e) {
			client = null;
			producer = null;
		}
	}

	public void record(String documentId, String actor, String action, String details) {
		DocumentAudit a = new DocumentAudit();
		a.setDocumentId(documentId);
		a.setActor(actor);
		a.setAction(action);
		a.setAt(Instant.now());
		a.setDetails(details);
		repo.save(a);

		// create notification for approval
		if ("APPROVED".equalsIgnoreCase(action)) {
			try {
				// look up document author is not available here; the caller can pass details like from=oldstate;author=username
				String author = null;
				if (details != null && details.contains("author=")) {
					String[] parts = details.split("author=");
					if (parts.length>1) author = parts[1].split(";")[0];
				}
				if (author != null) {
					Notification n = new Notification();
					n.setUsername(author);
					n.setMessage("Your document has been approved successfully");
					n.setCreatedAt(Instant.now());
					n.setRead(false);
					notificationRepo.save(n);
				}
			} catch (Exception ignored) {}
		}

		if (producer != null) {
			try {
				String payload = String.format("{\"documentId\":\"%s\",\"actor\":\"%s\",\"action\":\"%s\",\"details\":\"%s\"}", documentId, actor, action, details == null ? "" : details.replaceAll("\"", "\\\""));
				producer.send(payload.getBytes());
			} catch (Exception ex) {
				// ignore
			}
		}
	}

	@PreDestroy
	public void shutdown() {
		try { if (producer != null) producer.close(); } catch (Exception ignored) {}
		try { if (client != null) client.close(); } catch (Exception ignored) {}
	}
}
