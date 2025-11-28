package com.healthrecord.service;

import com.healthrecord.model.MedicalCondition;
import com.healthrecord.repository.MedicalConditionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicalConditionService {
    
    @Autowired
    private MedicalConditionRepository medicalConditionRepository;

    public List<MedicalCondition> findByUserId(Long userId) {
        return medicalConditionRepository.findByUserId(userId);
    }

    public MedicalCondition save(MedicalCondition medicalCondition) {
        return medicalConditionRepository.save(medicalCondition);
    }

    public Optional<MedicalCondition> findById(Long id) {
        return medicalConditionRepository.findById(id);
    }

    public void deleteById(Long id) {
        medicalConditionRepository.deleteById(id);
    }
}