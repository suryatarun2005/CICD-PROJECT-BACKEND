package com.healthrecord.controller;

import com.healthrecord.model.User;
import com.healthrecord.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/profile/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestBody User userUpdate) {
        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // Update user fields
            user.setFirstName(userUpdate.getFirstName());
            user.setLastName(userUpdate.getLastName());
            user.setPhone(userUpdate.getPhone());
            user.setDateOfBirth(userUpdate.getDateOfBirth());
            user.setAddress(userUpdate.getAddress());
            user.setCity(userUpdate.getCity());
            user.setState(userUpdate.getState());
            user.setZipCode(userUpdate.getZipCode());
            user.setEmergencyContactName(userUpdate.getEmergencyContactName());
            user.setEmergencyContactPhone(userUpdate.getEmergencyContactPhone());
            user.setEmergencyContactRelation(userUpdate.getEmergencyContactRelation());
            user.setInsuranceProvider(userUpdate.getInsuranceProvider());
            user.setInsurancePlanName(userUpdate.getInsurancePlanName());
            user.setInsuranceMemberId(userUpdate.getInsuranceMemberId());
            user.setInsuranceGroupNumber(userUpdate.getInsuranceGroupNumber());
            
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(updatedUser);
        }
        
        return ResponseEntity.notFound().build();
    }
}