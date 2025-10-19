package com.docuflow.controller;

import com.docuflow.model.DocumentMetadata;
import com.docuflow.repository.DocumentRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository repo;

    public DocumentController(DocumentRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<List<DocumentMetadata>> listDocuments() {
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentMetadata> uploadDocument(@RequestParam String title, @RequestParam String author, @RequestParam(required = false) List<String> tags) {
        DocumentMetadata m = new DocumentMetadata();
        m.setTitle(title);
        m.setAuthor(author);
        m.setWorkflowState("Draft");
        m.setCreatedAt(java.time.Instant.now());
        m.setUpdatedAt(java.time.Instant.now());
        m.setTags(tags);
        DocumentMetadata saved = repo.save(m);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentMetadata> getDocument(@PathVariable String id) {
        return repo.findById(id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> getDocumentFile(@PathVariable String id) {
        // file storage not implemented yet
        return ResponseEntity.notFound().build();
    }
}


