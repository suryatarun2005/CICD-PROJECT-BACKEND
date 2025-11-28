package com.healthrecord.repository;

import com.healthrecord.model.MedicalCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalConditionRepository extends JpaRepository<MedicalCondition, Long> {
    List<MedicalCondition> findByUserId(Long userId);
    List<MedicalCondition> findByUserIdAndStatus(Long userId, MedicalCondition.Status status);
}