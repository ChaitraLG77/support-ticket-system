package com.example.Ticketing.System.controller;

import com.example.Ticketing.System.dto.CreateTicketRequest;
import com.example.Ticketing.System.entity.Ticket;
import com.example.Ticketing.System.entity.TicketStatus;
import com.example.Ticketing.System.entity.User;
import com.example.Ticketing.System.repository.TicketRepository;
import com.example.Ticketing.System.repository.UserRepository;
import com.example.Ticketing.System.dto.AddCommentRequest;
import com.example.Ticketing.System.entity.TicketComment;
import com.example.Ticketing.System.repository.TicketCommentRepository;
import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketCommentRepository ticketCommentRepository;


    public TicketController(TicketRepository ticketRepository,
                            UserRepository userRepository,
                            TicketCommentRepository ticketCommentRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.ticketCommentRepository = ticketCommentRepository;
    }


    @PostMapping
    public String createTicket(@RequestBody CreateTicketRequest request) {

        // TEMP: fetching first user (will be replaced by auth context later)
        User owner = userRepository.findAll().get(0);

        Ticket ticket = new Ticket();
        ticket.setSubject(request.getSubject());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setOwner(owner);

        ticketRepository.save(ticket);
        return "Ticket created successfully";
    }
    @GetMapping
    public Object getMyTickets() {

        // TEMP: fetching first user (will be replaced by auth context later)
        User owner = userRepository.findAll().get(0);

        return ticketRepository.findByOwner(owner);
    }
    @GetMapping("/admin/all")
    public Object getAllTickets() {
        return ticketRepository.findAll();
    }

    @PutMapping("/admin/{ticketId}/status")
    public String adminUpdateStatus(@PathVariable Long ticketId,
                                    @RequestParam TicketStatus status) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        ticket.setStatus(status);
        ticketRepository.save(ticket);

        return "Ticket status updated by admin";
    }

    @PutMapping("/{ticketId}/status")
    public String updateStatus(@PathVariable Long ticketId,
                               @RequestParam TicketStatus status) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // TEMP: simulate logged-in user
        User currentUser = userRepository.findAll().get(0);

        if (!ticket.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not allowed to update this ticket");
        }

        ticket.setStatus(status);
        ticketRepository.save(ticket);

        return "Ticket status updated";
    }

    @PostMapping("/{ticketId}/comments")
    public String addComment(@PathVariable Long ticketId,
                             @RequestBody AddCommentRequest request) {

        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // TEMP: simulate logged-in user
        User currentUser = userRepository.findAll().get(0);

        if (!ticket.getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not allowed to comment on this ticket");
        }

        TicketComment comment = new TicketComment();
        comment.setComment(request.getComment());
        comment.setTicket(ticket);
        comment.setUser(currentUser);
        comment.setCreatedAt(java.time.LocalDateTime.now());

        ticketCommentRepository.save(comment);

        return "Comment added successfully";
    }




}
