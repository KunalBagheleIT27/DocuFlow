package com.docuflow.controller;

import com.docuflow.repository.DocumentRepository;
import com.docuflow.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/workflow")
public class WorkflowController {

    private final DocumentRepository repo;
    private final AuditService auditService;

    private static final Map<String, String[]> transitions = Map.of(
            "Draft", new String[]{"Submitted"},
            "Submitted", new String[]{"Under Review"},
            "Under Review", new String[]{"Approved","Rejected"},
            "Approved", new String[]{},
            "Rejected", new String[]{}
    );

    public WorkflowController(DocumentRepository repo, AuditService auditService) { this.repo = repo; this.auditService = auditService; }

    @PostMapping("/{id}/state")
    public ResponseEntity<?> setState(@PathVariable String id, @RequestParam String state, @RequestParam(required = false) String actor, @RequestHeader(value = "X-USER", required = false) String xuser, @RequestHeader(value = "X-ROLE", required = false) String xrole) {
        return repo.findById(id).map(d -> {
            String cur = d.getWorkflowState();
            String[] allowed = transitions.getOrDefault(cur, new String[]{});
            boolean ok = false;
            for (String a : allowed) if (a.equals(state)) { ok = true; break; }
            if (!ok) return ResponseEntity.badRequest().build();
            // role checks: Submitter -> Submitted; Reviewer -> Under Review; Approver -> Approved/Rejected
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            String role = "Submitter";
            if (auth != null && auth.getAuthorities() != null && !auth.getAuthorities().isEmpty()) {
                String a = auth.getAuthorities().iterator().next().getAuthority();
                if (a.startsWith("ROLE_")) role = a.substring(5);
            } else if (xrole != null && !xrole.isEmpty()) {
                role = xrole;
            }
            if ("Submitted".equals(state) && !"Submitter".equals(role)) return ResponseEntity.status(403).build();
            if ("Under Review".equals(state) && !("Reviewer".equals(role) || "Approver".equals(role))) return ResponseEntity.status(403).build();
            if (("Approved".equals(state) || "Rejected".equals(state)) && !"Approver".equals(role)) return ResponseEntity.status(403).build();

            // Prevent author from performing verification steps
            String actingUser = actor == null ? (xuser == null ? "system" : xuser) : actor;
            if (("Under Review".equals(state) || "Approved".equals(state) || "Rejected".equals(state)) && actingUser != null && actingUser.equals(d.getAuthor())) {
                return ResponseEntity.status(403).build();
            }

            d.setWorkflowState(state);
            d.setUpdatedAt(java.time.Instant.now());
            repo.save(d);
            String details = "from=" + cur + ";author=" + (d.getAuthor() == null ? "" : d.getAuthor());
            auditService.record(id, actor == null ? (xuser == null ? "system" : xuser) : actor, state.toUpperCase(), details);
            return ResponseEntity.accepted().build();
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}


