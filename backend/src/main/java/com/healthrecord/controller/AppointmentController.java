package com.healthrecord.controller;

import com.healthrecord.model.Appointment;
import com.healthrecord.model.User;
import com.healthrecord.service.AppointmentService;
import com.healthrecord.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByUserId(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.findByUserId(userId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/user/{userId}/upcoming")
    public ResponseEntity<List<Appointment>> getUpcomingAppointmentsByUserId(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.findUpcomingByUserId(userId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/user/{userId}/past")
    public ResponseEntity<List<Appointment>> getPastAppointmentsByUserId(@PathVariable Long userId) {
        List<Appointment> appointments = appointmentService.findPastByUserId(userId);
        return ResponseEntity.ok(appointments);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createAppointment(@PathVariable Long userId, @RequestBody Appointment appointment) {
        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isPresent()) {
            appointment.setUser(userOptional.get());
            Appointment savedAppointment = appointmentService.save(appointment);
            return ResponseEntity.ok(savedAppointment);
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentUpdate) {
        Optional<Appointment> appointmentOptional = appointmentService.findById(id);
        
        if (appointmentOptional.isPresent()) {
            Appointment appointment = appointmentOptional.get();
            appointment.setDoctor(appointmentUpdate.getDoctor());
            appointment.setSpecialty(appointmentUpdate.getSpecialty());
            appointment.setDate(appointmentUpdate.getDate());
            appointment.setTime(appointmentUpdate.getTime());
            appointment.setLocation(appointmentUpdate.getLocation());
            appointment.setType(appointmentUpdate.getType());
            appointment.setStatus(appointmentUpdate.getStatus());
            appointment.setReason(appointmentUpdate.getReason());
            
            Appointment updatedAppointment = appointmentService.save(appointment);
            return ResponseEntity.ok(updatedAppointment);
        }
        
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        if (appointmentService.findById(id).isPresent()) {
            appointmentService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        
        return ResponseEntity.notFound().build();
    }
}