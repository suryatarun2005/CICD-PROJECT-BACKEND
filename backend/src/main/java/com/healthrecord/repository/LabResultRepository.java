package com.healthrecord.repository;

import com.healthrecord.model.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LabResultRepository extends JpaRepository<LabResult, Long> {
    List<LabResult> findByUserId(Long userId);
    List<LabResult> findByUserIdOrderByDateDesc(Long userId);
}