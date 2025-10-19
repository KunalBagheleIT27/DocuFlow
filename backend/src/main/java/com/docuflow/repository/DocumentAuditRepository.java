package com.docuflow.repository;

import com.docuflow.model.DocumentAudit;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentAuditRepository extends MongoRepository<DocumentAudit, String> {
}
