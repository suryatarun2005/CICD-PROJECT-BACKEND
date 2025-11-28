package com.healthrecord.controller;

import com.healthrecord.model.LabResult;
import com.healthrecord.model.User;
import com.healthrecord.service.LabResultService;
import com.healthrecord.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/lab-results")
public class LabResultController {
    
    @Autowired
    private LabResultService labResultService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LabResult>> getLabResultsByUserId(@PathVariable Long userId) {
        List<LabResult> labResults = labResultService.findByUserId(userId);
        return ResponseEntity.ok(labResults);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createLabResult(@PathVariable Long userId, @RequestBody LabResult labResult) {
        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isPresent()) {
            labResult.setUser(userOptional.get());
            LabResult savedLabResult = labResultService.save(labResult);
            return ResponseEntity.ok(savedLabResult);
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLabResult(@PathVariable Long id, @RequestBody LabResult labResultUpdate) {
        Optional<LabResult> labResultOptional = labResultService.findById(id);
        
        if (labResultOptional.isPresent()) {
            LabResult labResult = labResultOptional.get();
            labResult.setTestName(labResultUpdate.getTestName());
            labResult.setDate(labResultUpdate.getDate());
            labResult.setOrderedBy(labResultUpdate.getOrderedBy());
            labResult.setStatus(labResultUpdate.getStatus());
            labResult.setTestResults(labResultUpdate.getTestResults());
            
            LabResult updatedLabResult = labResultService.save(labResult);
            return ResponseEntity.ok(updatedLabResult);
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLabResult(@PathVariable Long id) {
        if (labResultService.findById(id).isPresent()) {
            labResultService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        
        return ResponseEntity.notFound().build();
    }
}