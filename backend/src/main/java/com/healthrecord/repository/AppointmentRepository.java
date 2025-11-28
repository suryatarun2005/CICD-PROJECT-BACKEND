package com.healthrecord.repository;

import com.healthrecord.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(Long userId);
    
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.date >= :currentDate ORDER BY a.date ASC, a.time ASC")
    List<Appointment> findUpcomingAppointmentsByUserId(@Param("userId") Long userId, @Param("currentDate") LocalDate currentDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.date < :currentDate ORDER BY a.date DESC, a.time DESC")
    List<Appointment> findPastAppointmentsByUserId(@Param("userId") Long userId, @Param("currentDate") LocalDate currentDate);
}