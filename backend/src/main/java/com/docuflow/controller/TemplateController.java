package com.docuflow.controller;

import com.docuflow.model.Template;
import com.docuflow.repository.TemplateRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class TemplateController {

    private final TemplateRepository repo;

    public TemplateController(TemplateRepository repo) { this.repo = repo; }

    @GetMapping
    public ResponseEntity<List<Template>> list() {
        return ResponseEntity.ok(repo.findAll());
    }

    @PostMapping
    public ResponseEntity<Template> create(@RequestBody Template t) {
        t.setCreatedAt(Instant.now());
        return ResponseEntity.ok(repo.save(t));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
