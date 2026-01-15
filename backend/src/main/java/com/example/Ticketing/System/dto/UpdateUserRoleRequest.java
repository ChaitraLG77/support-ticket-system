package com.example.Ticketing.System.dto;

import com.example.Ticketing.System.entity.Role;

public class UpdateUserRoleRequest {

    private Role role;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
