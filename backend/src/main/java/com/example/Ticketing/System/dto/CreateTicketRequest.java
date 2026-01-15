package com.example.Ticketing.System.dto;

import com.example.Ticketing.System.entity.TicketPriority;

public class CreateTicketRequest {

    private String subject;
    private String description;
    private TicketPriority priority;

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }
}
