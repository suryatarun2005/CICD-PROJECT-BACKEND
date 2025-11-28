package com.healthrecord.controller;

import com.healthrecord.model.Allergy;
import com.healthrecord.model.User;
import com.healthrecord.service.AllergyService;
import com.healthrecord.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/allergies")
public class AllergyController {
    
    @Autowired
    private AllergyService allergyService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Allergy>> getAllergiesByUserId(@PathVariable Long userId) {
        List<Allergy> allergies = allergyService.findByUserId(userId);
        return ResponseEntity.ok(allergies);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createAllergy(@PathVariable Long userId, @RequestBody Allergy allergy) {
        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isPresent()) {
            allergy.setUser(userOptional.get());
            Allergy savedAllergy = allergyService.save(allergy);
            return ResponseEntity.ok(savedAllergy);
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAllergy(@PathVariable Long id, @RequestBody Allergy allergyUpdate) {
        Optional<Allergy> allergyOptional = allergyService.findById(id);
        
        if (allergyOptional.isPresent()) {
            Allergy allergy = allergyOptional.get();
            allergy.setAllergen(allergyUpdate.getAllergen());
            allergy.setReaction(allergyUpdate.getReaction());
            allergy.setSeverity(allergyUpdate.getSeverity());
            allergy.setFirstOccurrence(allergyUpdate.getFirstOccurrence());
            
            Allergy updatedAllergy = allergyService.save(allergy);
            return ResponseEntity.ok(updatedAllergy);
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAllergy(@PathVariable Long id) {
        if (allergyService.findById(id).isPresent()) {
            allergyService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        
        return ResponseEntity.notFound().build();
    }
}