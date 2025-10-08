package com.docuflow.controller;

import com.docuflow.model.DocumentMetadata;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @GetMapping
    public ResponseEntity<List<DocumentMetadata>> listDocuments() {
        return ResponseEntity.ok(List.of()); // TODO: implement repo
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> uploadDocument() {
        return ResponseEntity.accepted().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentMetadata> getDocument(@PathVariable String id) {
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<byte[]> getDocumentFile(@PathVariable String id) {
        return ResponseEntity.notFound().build();
    }
}


