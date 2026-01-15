package com.example.Ticketing.System.controller;

import com.example.Ticketing.System.dto.UpdateUserRoleRequest;
import com.example.Ticketing.System.entity.User;
import com.example.Ticketing.System.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/users/{userId}/role")
    public String updateUserRole(@PathVariable Long userId,
                                 @RequestBody UpdateUserRoleRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(request.getRole());
        userRepository.save(user);

        return "User role updated successfully";
    }
}
