package com.healthrecord.controller;

import com.healthrecord.model.Medication;
import com.healthrecord.model.User;
import com.healthrecord.service.MedicationService;
import com.healthrecord.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/medications")
public class MedicationController {
    
    @Autowired
    private MedicationService medicationService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Medication>> getMedicationsByUserId(@PathVariable Long userId) {
        List<Medication> medications = medicationService.findByUserId(userId);
        return ResponseEntity.ok(medications);
    }

    @GetMapping("/user/{userId}/current")
    public ResponseEntity<List<Medication>> getCurrentMedicationsByUserId(@PathVariable Long userId) {
        List<Medication> medications = medicationService.findCurrentByUserId(userId);
        return ResponseEntity.ok(medications);
    }

    @GetMapping("/user/{userId}/as-needed")
    public ResponseEntity<List<Medication>> getAsNeededMedicationsByUserId(@PathVariable Long userId) {
        List<Medication> medications = medicationService.findAsNeededByUserId(userId);
        return ResponseEntity.ok(medications);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createMedication(@PathVariable Long userId, @RequestBody Medication medication) {
        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isPresent()) {
            medication.setUser(userOptional.get());
            Medication savedMedication = medicationService.save(medication);
            return ResponseEntity.ok(savedMedication);
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMedication(@PathVariable Long id, @RequestBody Medication medicationUpdate) {
        Optional<Medication> medicationOptional = medicationService.findById(id);
        
        if (medicationOptional.isPresent()) {
            Medication medication = medicationOptional.get();
            medication.setName(medicationUpdate.getName());
            medication.setDosage(medicationUpdate.getDosage());
            medication.setFrequency(medicationUpdate.getFrequency());
            medication.setTime(medicationUpdate.getTime());
            medication.setPrescribedBy(medicationUpdate.getPrescribedBy());
            medication.setIndication(medicationUpdate.getIndication());
            medication.setNextRefill(medicationUpdate.getNextRefill());
            medication.setRefillsRemaining(medicationUpdate.getRefillsRemaining());
            medication.setInstructions(medicationUpdate.getInstructions());
            medication.setType(medicationUpdate.getType());
            
            Medication updatedMedication = medicationService.save(medication);
            return ResponseEntity.ok(updatedMedication);
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMedication(@PathVariable Long id) {
        if (medicationService.findById(id).isPresent()) {
            medicationService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        
        return ResponseEntity.notFound().build();
    }
}