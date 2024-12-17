package com.example.demo.auth;

import com.example.demo.cloudinary.CloudService;
import com.example.demo.config.ConfigVNPAY;
import com.example.demo.dto.*;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import com.example.demo.jwt.JwtService;
import com.example.demo.jwt.Token;
import com.example.demo.mail.MailRequest;
import com.example.demo.repository.UserRepository;
//import com.example.demo.service.CommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;


    private final JwtService jwtService;
    private final CloudService cloudService;
    private final PasswordEncoder passwordEncoder;

//    private  final CommentService commentService;
//
//
//
//    public ResponseObject deleteCommentById(String email, int id) {
//        var comment = commentService.getById(id);
//        if(comment == null) {
//            return ResponseObject.builder().status(HttpStatus.OK).mess("Delete successfully").build();
//        }
//        var user = userRepository.findByEmail(email).orElse(null);
//        if (user == null) {
//            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("User not found").build();
//        }
//        user.getComments().remove(comment);
//        commentService.deleteById(id);
//        userRepository.save(user);
//        return ResponseObject.builder().status(HttpStatus.OK).mess("Delete successfully").build();
//    }

    public boolean register(RegisterRequest request) {
        if(isUsedEmail(request.getEmail())) return  false;
        saveUser(request);
        return true;
    }

    public ResponseObject authenticate(AuthenticationRequest auth) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(auth.getEmail(), auth.getPassword())
            );
            var user = userRepository.findByEmail(auth.getEmail()).orElse(null);
            if (user == null) {
                return ResponseObject.builder()
                        .status(HttpStatus.BAD_REQUEST)
                        .content("User does not exist.")
                        .build();
            }
            Token token = new Token(jwtService.generateToken(user));
            user.setToken(token);
            var userDTO = getUserDTOFromUser(user);
            userDTO.setToken(token.getToken());
            return ResponseObject.builder()
                    .status(HttpStatus.OK)
                    .content(userDTO)
                    .build();
        } catch (AuthenticationException ex) {
            System.out.println(ex.getMessage() + " Authentication failed!");
            return ResponseObject.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .mess("Error while authenticating user: " + ex.getMessage())
                    .build();
        }
    }


    public UserDTO getUserDTOFromUser(User user) {
        return UserDTO.builder()
                .id(user.getId()) // Add this line
                .avatar(user.getAvatar())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                // .progresses(user.getProgresses())
                .build();
    }


    public ResponseObject getAllByPage(int page, int size) {
        var result = userRepository.findAll(PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject getAllUser() {
        var users = userRepository.findAll();
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get data successfully").status(HttpStatus.OK).content(users).build();
    }

    public ResponseObject getAllRole() {
        return ResponseObject.builder().status(HttpStatus.OK).content(Role.values()).build();
    }

    public ResponseObject getUserByRole(String role, int page, int size) {
        if(Objects.equals(role, "All"))
            return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findAll(PageRequest.of(page, size))).build();
        return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findByRole(role, PageRequest.of(page, size))).build();
    }

    public ResponseObject getUserByEmail(String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Username not found").build();
        }
        var userDTO = getUserDTOFromUser(user);
        return ResponseObject.builder().status(HttpStatus.OK).content(userDTO).mess("Successfully").build();
    }

    private void saveUser(RegisterRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.USER)
                .build();
        userRepository.save(user);
    }


    public boolean isUsedEmail(String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        return user != null;
    }

    public boolean isValidPhoneNumber(String phoneNumber) {
        var user = userRepository.findByPhoneNumber(phoneNumber).orElse(null);
        if(user == null) return false;
        return true;
    }
    public String getVerifyCode() {
        SecureRandom random = new SecureRandom();
        StringBuilder code = new StringBuilder();
        String characters = "1234567890";
        for(int i = 0; i < 6; i++) {
            code.append(characters.charAt(random.nextInt(characters.length())));
        }
        return code.toString();
    }

    public boolean isValidCode(MailRequest request) {
        User user = findUserByEmail(request.getEmail());
        if(user == null || user.getCode().isEmpty()) return false;
            return user.getCode().get(request.getCode()).isAfter(LocalDateTime.now());
    }

    public ResponseObject resetPassword(ResetPasswordRequest request) {
        var user = findUserByEmail(request.getEmail());
        if(user == null) return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Reset password failed").build();
        ;
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Reset password successfully").content(user).build();
    }

    public ResponseObject adminUpdatePasswordForUser(PasswordDTO passwordDTO, String email) {
        var user = userRepository.findByEmail(email).orElse(null);
        if(user == null) {
            return ResponseObject.builder().mess("User not found").status(HttpStatus.BAD_REQUEST).build();
        }
        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        user = userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Update password for user successfully").content(user).build();
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public boolean saveCode(MailRequest request, String code) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if(user == null) return false;
        Map<String, LocalDateTime> token = new HashMap<String, LocalDateTime>();
        token.put(code, LocalDateTime.now().plus(48, ChronoUnit.HOURS));
        user.setCode(token);
        userRepository.save(user);
        return true;
    }
    public boolean saveCode(OtpVerifyRequest request, String code) {
        User user = userRepository.findByPhoneNumber(request.getPhoneNumber()).orElse(null);
        if(user == null) return false;
        Map<String, LocalDateTime> token = new HashMap<String, LocalDateTime>();
        token.put(code, LocalDateTime.now().plus(48, ChronoUnit.HOURS));
        user.setCode(token);
        userRepository.save(user);
        return true;
    }

    public ResponseObject getUserByToken(String token) {
        String userName;
        try {
            userName = jwtService.extractUserName(token);
        }
        catch (Exception e) {
            System.out.println("getUserByToken: " + e.getMessage());
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Username not found").build();
        }
        var user = userRepository.findByEmail(userName).orElse(null);
        if(user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Username not found").build();
        }
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get user data successfully").build();
    }

    public ResponseObject updateProfile(UserDTO userDTO, MultipartFile avatar) {
        var user = userRepository.findByEmail(userDTO.getEmail()).orElse(null);
        if (user == null) {
            return ResponseObject.builder()
                    .status(HttpStatus.BAD_REQUEST)
                    .mess("User not found")
                    .build();
        }

        // Update user fields
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());

        if (avatar != null && !avatar.isEmpty()) {
            try {
                // Upload avatar to Cloudinary
                String avatarUrl = cloudService.uploadImage(avatar.getBytes());
                if (avatarUrl != null) {
                    user.setAvatar(avatarUrl);
                } else {
                    return ResponseObject.builder()
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .mess("Failed to upload avatar")
                            .build();
                }
            } catch (IOException e) {
                System.out.println("Error uploading avatar: " + e.getMessage());
                return ResponseObject.builder()
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .mess("Error occurred when updating profile")
                        .build();
            }
        }

        userRepository.save(user);
        return ResponseObject.builder()
                .status(HttpStatus.OK)
                .mess("Update successfully")
                .content(user)
                .build();
    }


    public ResponseObject updatePassword(PasswordDTO passwordDTO) {
        var user = userRepository.findByEmail(passwordDTO.getEmail()).orElse(null);
        if(user == null) {
            return ResponseObject.builder().mess("User not found").status(HttpStatus.BAD_REQUEST).build();
        }
        if(!passwordEncoder.matches( passwordDTO.getOldPassword(), user.getPassword())) {
            return ResponseObject.builder().mess("Old password not correct").status(HttpStatus.BAD_REQUEST).build();
        }
        user.setPassword(passwordEncoder.encode(passwordDTO.getNewPassword()));
        userRepository.save(user);
        return ResponseObject.builder().status(HttpStatus.OK).mess("Update password successfully").build();
    }




}

