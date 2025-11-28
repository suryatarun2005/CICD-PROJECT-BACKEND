package com.healthrecord.controller;

import com.healthrecord.model.MedicalCondition;
import com.healthrecord.model.User;
import com.healthrecord.service.MedicalConditionService;
import com.healthrecord.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medical-conditions")
public class MedicalConditionController {
    
    @Autowired
    private MedicalConditionService medicalConditionService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MedicalCondition>> getMedicalConditionsByUserId(@PathVariable Long userId) {
        List<MedicalCondition> conditions = medicalConditionService.findByUserId(userId);
        return ResponseEntity.ok(conditions);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createMedicalCondition(@PathVariable Long userId, @RequestBody MedicalCondition medicalCondition) {
        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isPresent()) {
            medicalCondition.setUser(userOptional.get());
            MedicalCondition savedCondition = medicalConditionService.save(medicalCondition);
            return ResponseEntity.ok(savedCondition);
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedicalCondition(@PathVariable Long id, @RequestBody MedicalCondition medicalConditionUpdate) {
        Optional<MedicalCondition> conditionOptional = medicalConditionService.findById(id);
        
        if (conditionOptional.isPresent()) {
            MedicalCondition condition = conditionOptional.get();
            condition.setName(medicalConditionUpdate.getName());
            condition.setStatus(medicalConditionUpdate.getStatus());
            condition.setDiagnosedDate(medicalConditionUpdate.getDiagnosedDate());
            condition.setSeverity(medicalConditionUpdate.getSeverity());
            condition.setNotes(medicalConditionUpdate.getNotes());
            
            MedicalCondition updatedCondition = medicalConditionService.save(condition);
            return ResponseEntity.ok(updatedCondition);
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedicalCondition(@PathVariable Long id) {
        if (medicalConditionService.findById(id).isPresent()) {
            medicalConditionService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        
        return ResponseEntity.notFound().build();
    }
}