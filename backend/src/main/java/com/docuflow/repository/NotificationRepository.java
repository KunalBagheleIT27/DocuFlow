package com.docuflow.repository;

import com.docuflow.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUsernameOrderByCreatedAtDesc(String username);
}
