package com.healthrecord.controller;

import com.healthrecord.dto.ApiResponse;
import com.healthrecord.dto.LoginRequest;
import com.healthrecord.dto.SignupRequest;
import com.healthrecord.model.User;
import com.healthrecord.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UserService userService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = userService.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Simple password check (in production, use proper password hashing)
            if (user.getPassword().equals(loginRequest.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("token", "dummy-jwt-token-" + user.getId());
                response.put("type", "Bearer");
                response.put("id", user.getId());
                response.put("firstName", user.getFirstName());
                response.put("lastName", user.getLastName());
                response.put("email", user.getEmail());
                
                return ResponseEntity.ok(response);
            }
        }
        
        return ResponseEntity.badRequest()
                .body(new ApiResponse(false, "Invalid email or password!"));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userService.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error: Email is already taken!"));
        }

        User user = userService.createUser(signUpRequest);

        return ResponseEntity.ok(new ApiResponse(true, "User registered successfully!"));
    }
}