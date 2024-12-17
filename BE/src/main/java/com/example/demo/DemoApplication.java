package com.example.demo;

import com.example.demo.auth.AuthService;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import com.example.demo.jwt.JwtService;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@SpringBootApplication
@RequiredArgsConstructor
public class DemoApplication {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
//    	@Bean
//    CommandLineRunner commandLineRunner (AuthService authService) {
//		return args -> {
//			User user = User.builder()
//					.firstName("nguyen")
//					.lastName("user")
//					.email("user@gmail.com")
//					.password(passwordEncoder.encode("Tuan@1111"))
//					.role(Role.USER)
//					.build();
//			System.out.println(jwtService.generateToken(user));
//			User admin = User.builder()
//					.firstName("nguyen")
//					.lastName("admin")
//					.email("admin@gmail.com")
//					.password(passwordEncoder.encode("Tuan@1111"))
//					.role(Role.ADMIN)
//					.build();
//			System.out.println(jwtService.generateToken(admin));
//
//			User instructor = User.builder()
//					.firstName("nguyen")
//					.lastName("manager")
//					.email("manager@gmail.com")
//					.password(passwordEncoder.encode("Tuan@1111"))
//					.role(Role.INSTRUCTOR)
//					.build();
//			System.out.println(jwtService.generateToken(instructor));
//
//			userRepository.saveAll(List.of(user, admin, instructor));
//		};
//	}

}
