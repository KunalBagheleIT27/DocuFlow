package com.docuflow.controller;

import com.docuflow.model.DocumentMetadata;
import com.docuflow.repository.DocumentRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository repo;

    public DocumentController(DocumentRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<List<DocumentMetadata>> listDocuments(@RequestHeader(value = "X-USER", required = false) String user,
                                                               @RequestHeader(value = "X-ROLE", required = false) String role) {
        // Approver can see all documents; others see only their own by author
        if (role != null && role.equalsIgnoreCase("Approver")) {
            return ResponseEntity.ok(repo.findAll());
        }
        if (user != null && !user.isBlank()) {
            return ResponseEntity.ok(repo.findByAuthor(user));
        }
        // default to none if unauthenticated
        return ResponseEntity.ok(List.of());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentMetadata> uploadDocument(@RequestParam String title,
                                                           @RequestParam String author,
                                                           @RequestParam(required = false) List<String> tags,
                                                           @RequestParam(required = false, name = "file") MultipartFile file,
                                                           @RequestParam(required = false, name = "content") String textContent) {
        DocumentMetadata m = new DocumentMetadata();
        m.setTitle(title);
        m.setAuthor(author);
        m.setWorkflowState("Draft");
        m.setCreatedAt(java.time.Instant.now());
        m.setUpdatedAt(java.time.Instant.now());
        m.setTags(tags);
        // For demo: store a simple content marker for file or inline text
        try {
            if (file != null && !file.isEmpty()) {
                // store only a small pointer including name and base64 of first bytes for preview
                byte[] bytes = file.getBytes();
                int len = Math.min(bytes.length, 16 * 1024); // cap preview size
                String head = Base64.getEncoder().encodeToString(java.util.Arrays.copyOf(bytes, len));
                String pointer = "file:" + file.getOriginalFilename() + ";type:" + file.getContentType() + ";data:" + head;
                m.setContent(pointer);
            } else if (textContent != null && !textContent.isBlank()) {
                m.setContent(textContent);
            }
        } catch (Exception ignored) {}
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


