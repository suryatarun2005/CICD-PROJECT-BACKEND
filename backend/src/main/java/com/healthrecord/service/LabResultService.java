package com.healthrecord.service;

import com.healthrecord.model.LabResult;
import com.healthrecord.repository.LabResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabResultService {
    
    @Autowired
    private LabResultRepository labResultRepository;

    public List<LabResult> findByUserId(Long userId) {
        return labResultRepository.findByUserIdOrderByDateDesc(userId);
    }

    public LabResult save(LabResult labResult) {
        return labResultRepository.save(labResult);
    }

    public Optional<LabResult> findById(Long id) {
        return labResultRepository.findById(id);
    }

    public void deleteById(Long id) {
        labResultRepository.deleteById(id);
    }
}