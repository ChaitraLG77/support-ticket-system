package com.example.Ticketing.System.repository;

import com.example.Ticketing.System.entity.Ticket;
import com.example.Ticketing.System.entity.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {

    List<TicketComment> findByTicket(Ticket ticket);
}
