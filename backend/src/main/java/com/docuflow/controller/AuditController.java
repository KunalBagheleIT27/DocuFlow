package com.docuflow.controller;

import com.docuflow.model.DocumentAudit;
import com.docuflow.repository.DocumentAuditRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audits")
public class AuditController {

    private final DocumentAuditRepository repo;

    public AuditController(DocumentAuditRepository repo) { this.repo = repo; }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<List<DocumentAudit>> listForDocument(@PathVariable String documentId) {
        List<DocumentAudit> all = repo.findAll();
        List<DocumentAudit> filtered = all.stream().filter(a -> documentId.equals(a.getDocumentId())).toList();
        return ResponseEntity.ok(filtered);
    }
}
