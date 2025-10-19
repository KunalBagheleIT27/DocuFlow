package com.docuflow.controller;

import com.docuflow.model.Notification;
import com.docuflow.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository repo;

    public NotificationController(NotificationRepository repo) { this.repo = repo; }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Notification>> listForUser(@PathVariable String username) {
        return ResponseEntity.ok(repo.findByUsernameOrderByCreatedAtDesc(username));
    }

    @PostMapping
    public ResponseEntity<Notification> create(@RequestBody Notification n) {
        n.setCreatedAt(Instant.now());
        n.setRead(false);
        return ResponseEntity.ok(repo.save(n));
    }
}
