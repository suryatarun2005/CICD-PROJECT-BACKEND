package com.healthrecord.service;

import com.healthrecord.model.Allergy;
import com.healthrecord.repository.AllergyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AllergyService {
    
    @Autowired
    private AllergyRepository allergyRepository;

    public List<Allergy> findByUserId(Long userId) {
        return allergyRepository.findByUserId(userId);
    }

    public Allergy save(Allergy allergy) {
        return allergyRepository.save(allergy);
    }

    public Optional<Allergy> findById(Long id) {
        return allergyRepository.findById(id);
    }

    public void deleteById(Long id) {
        allergyRepository.deleteById(id);
    }
}