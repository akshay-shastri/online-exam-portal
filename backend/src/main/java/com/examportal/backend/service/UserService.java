package com.examportal.backend.service;

import com.examportal.backend.entity.User;
import com.examportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {

        return userRepository.save(user);
    }

    public Map<String, Object> loginUser(
            String email,
            String password
    ) {

        Map<String, Object> response = new HashMap<>();

        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {

            if (user.get().getPassword().equals(password)) {

                response.put("message", "Login Successful");
                response.put("role", user.get().getRole());
                response.put("name", user.get().getName());

            } else {

                response.put("message", "Invalid Password");
            }

        } else {

            response.put("message", "User Not Found");
        }

        return response;
    }

    public String changePassword(
            String email,
            String currentPassword,
            String newPassword
    ) {

        Optional<User> optionalUser =
                userRepository.findByEmail(email);

        if (optionalUser.isPresent()) {

            User user = optionalUser.get();

            if (user.getPassword().equals(currentPassword)) {

                user.setPassword(newPassword);

                userRepository.save(user);

                return "Password Changed Successfully";
            }
        }

        return "Current Password Incorrect";
    }
}