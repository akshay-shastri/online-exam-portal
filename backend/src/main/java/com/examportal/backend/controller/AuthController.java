package com.examportal.backend.controller;

import com.examportal.backend.entity.User;
import com.examportal.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {

        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public Map<String, Object> loginUser(
            @RequestBody Map<String, String> loginData
    ) {

        String email = loginData.get("email").trim().toLowerCase();
        String password = loginData.get("password");

        return userService.loginUser(email, password);
    }

    @PostMapping("/change-password")
    public String changePassword(
            @RequestBody Map<String, String> request
    ) {

        String email = request.get("email").trim().toLowerCase();;
        String currentPassword =
                request.get("currentPassword");
        String newPassword =
                request.get("newPassword");

        return userService.changePassword(
                email,
                currentPassword,
                newPassword
        );
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(
        @RequestBody Map<String, String> request
) {

    return userService.verifyOtp(
            request.get("email").trim().toLowerCase(),
            request.get("otp")
    );
}


@PostMapping("/resend-otp")
public String resendOtp(
        @RequestBody Map<String, String> request
) {

    return userService.resendOtp(
            request.get("email").trim().toLowerCase());
}


}