package com.example.Ticketing.System.repository;

import com.example.Ticketing.System.entity.Ticket;
import com.example.Ticketing.System.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByOwner(User owner);
}
