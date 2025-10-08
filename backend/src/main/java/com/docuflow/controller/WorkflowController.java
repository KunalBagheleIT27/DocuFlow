package com.docuflow.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/workflow")
public class WorkflowController {

    @PostMapping("/{id}/state")
    public ResponseEntity<Void> setState(@PathVariable String id, @RequestParam String state) {
        return ResponseEntity.accepted().build();
    }
}


