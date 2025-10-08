package com.docuflow.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("document_audits")
public class DocumentAudit {
    @Id
    private String id;
    private String documentId;
    private String actor;
    private String action; // SUBMIT, REVIEW, APPROVE, REJECT, UPDATE
    private Instant at;
    private String details;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }
    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Instant getAt() { return at; }
    public void setAt(Instant at) { this.at = at; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}


