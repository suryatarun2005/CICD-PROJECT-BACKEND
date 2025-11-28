package com.healthrecord.service;

import com.healthrecord.model.Medication;
import com.healthrecord.repository.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicationService {
    
    @Autowired
    private MedicationRepository medicationRepository;

    public List<Medication> findByUserId(Long userId) {
        return medicationRepository.findByUserId(userId);
    }

    public List<Medication> findCurrentByUserId(Long userId) {
        return medicationRepository.findByUserIdAndType(userId, Medication.Type.CURRENT);
    }

    public List<Medication> findAsNeededByUserId(Long userId) {
        return medicationRepository.findByUserIdAndType(userId, Medication.Type.AS_NEEDED);
    }

    public Medication save(Medication medication) {
        return medicationRepository.save(medication);
    }

    public Optional<Medication> findById(Long id) {
        return medicationRepository.findById(id);
    }

    public void deleteById(Long id) {
        medicationRepository.deleteById(id);
    }
}