package com.docuflow.repository;

import com.docuflow.model.DocumentMetadata;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends MongoRepository<DocumentMetadata, String> {
    List<DocumentMetadata> findByWorkflowStateIn(List<String> states);
    List<DocumentMetadata> findByAuthor(String author);
}
