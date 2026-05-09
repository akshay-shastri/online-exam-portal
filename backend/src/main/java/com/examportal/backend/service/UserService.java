package com.examportal.backend.service;

import com.examportal.backend.entity.User;
import com.examportal.backend.jwt.JwtUtil;
import com.examportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {



    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

   public User registerUser(User user) {

    String otp =
            String.valueOf(
                    (int)((Math.random() * 900000) + 100000)
            );

    user.setPassword(
            passwordEncoder.encode(user.getPassword())
    );

    user.setVerified(false);

    user.setOtp(otp);

    user.setOtpGeneratedTime(
            System.currentTimeMillis()
    );

    User savedUser =
            userRepository.save(user);

    try {

        emailService.sendOtpEmail(
                user.getEmail(),
                otp
        );

    } catch (Exception e) {

        e.printStackTrace();
    }

    return savedUser;
}

    public Map<String, Object> loginUser(
            String email,
            String password
    ) {

        Map<String, Object> response =
                new HashMap<>();

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {

            response.put("message", "User Not Found");

            return response;
        }

        User user = optionalUser.get();

        if (!user.isVerified()) {

    response.put(
            "message",
            "Please verify your email first"
    );

    return response;
}

        if (
                !passwordEncoder.matches(
                        password,
                        user.getPassword()
                )
        ) {

            response.put("message", "Invalid Password");

            return response;
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        response.put("message", "Login Successful");
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("name", user.getName());
        response.put("email", user.getEmail());

        return response;
    }

    public String changePassword(
            String email,
            String currentPassword,
            String newPassword
    ) {

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {

            return "User Not Found";
        }

        User user = optionalUser.get();

        if (
                !passwordEncoder.matches(
                        currentPassword,
                        user.getPassword()
                )
        ) {

            return "Current Password Incorrect";
        }

        user.setPassword(
                passwordEncoder.encode(newPassword)
        );

        userRepository.save(user);

        return "Password Changed Successfully";
    }

    public String verifyOtp(
        String email,
        String otp
) {

    Optional<User> optionalUser =
            userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {

        return "User Not Found";
    }

    User user = optionalUser.get();

    long currentTime =
            System.currentTimeMillis();

    long otpTime =
            user.getOtpGeneratedTime();

    if ((currentTime - otpTime)
            > 5 * 60 * 1000) {

        return "OTP Expired";
    }

    if (!user.getOtp().equals(otp)) {

        return "Invalid OTP";
    }

    user.setVerified(true);

    user.setOtp(null);

    user.setOtpGeneratedTime(null);

    userRepository.save(user);

    return "Email Verified Successfully";
}

public String resendOtp(String email) {

    Optional<User> optionalUser =
            userRepository.findByEmail(email);

    if (optionalUser.isEmpty()) {

        return "User Not Found";
    }

    User user = optionalUser.get();

    if (user.isVerified()) {

        return "Email already verified";
    }

    String otp =
            String.valueOf(
                    (int)((Math.random() * 900000) + 100000)
            );

    user.setOtp(otp);

    user.setOtpGeneratedTime(
            System.currentTimeMillis()
    );

    userRepository.save(user);

    emailService.sendOtpEmail(
            user.getEmail(),
            otp
    );

    return "OTP Resent Successfully";
}


}