package com.healthrecord.service;

import com.healthrecord.model.Appointment;
import com.healthrecord.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> findByUserId(Long userId) {
        return appointmentRepository.findByUserId(userId);
    }

    public List<Appointment> findUpcomingByUserId(Long userId) {
        return appointmentRepository.findUpcomingAppointmentsByUserId(userId, LocalDate.now());
    }

    public List<Appointment> findPastByUserId(Long userId) {
        return appointmentRepository.findPastAppointmentsByUserId(userId, LocalDate.now());
    }

    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Optional<Appointment> findById(Long id) {
        return appointmentRepository.findById(id);
    }

    public void deleteById(Long id) {
        appointmentRepository.deleteById(id);
    }
}