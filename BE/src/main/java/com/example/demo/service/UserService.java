package com.example.demo.service;

import com.example.demo.dto.ResponseObject;
import com.example.demo.dto.UsersAndRoles;
import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public ResponseObject getAllUser() {
        var users = userRepository.findAll();
        return ResponseObject.builder().status(HttpStatus.OK).mess("Get data successfully").status(HttpStatus.OK).content(users).build();
    }
    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public ResponseObject getAllRole() {
        return ResponseObject.builder().status(HttpStatus.OK).content(Role.values()).build();
    }
    public ResponseObject getAllUserAndRole(boolean isDeleted){
        var roles = Role.values();
        var users = userRepository.findAllByIsDeleted(isDeleted, PageRequest.of(0, 5));
        UsersAndRoles usersAndRoles = UsersAndRoles.builder().roles(roles).users(users).build();
        return ResponseObject.builder().status(HttpStatus.OK).content(usersAndRoles).build();
    }



    public ResponseObject getUserByRole(String role, int page, int size) {
        if (Objects.equals(role, "All"))
            return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findAll(PageRequest.of(page, size))).build();
        return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findByRole(role, PageRequest.of(page, size))).build();
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
    public ResponseObject getUserByName(String name, boolean isDelete, int page, int size) {
        if (Objects.equals(name, ""))
            return ResponseObject.builder().status(HttpStatus.OK).content(userRepository.findAllByIsDeleted(isDelete, PageRequest.of(page, size))).build();
        return ResponseObject.builder().status(HttpStatus.OK)
                .content(userRepository.findByFirstNameContainingOrLastNameContainingAndAndDeleted(name, name,isDelete, PageRequest.of(page, size)))
                .build();
    }

    public ResponseObject getAllByPage(int page, int size) {
        var result = userRepository.findAllByIsDeleted(false, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }
    public Page<User> getAllActiveUsers(Pageable pageable) {
        return userRepository.findByIsDeletedFalse(pageable);
    }

    public ResponseObject getAllDeletedByPage(int page, int size) {
        var result = userRepository.findAllByIsDeleted(true, PageRequest.of(page, size));
        return ResponseObject.builder().status(HttpStatus.OK).content(result).build();
    }

    public ResponseObject softDelete(int id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course is not exist!").build();
        }
        if (Objects.equals(user.getRole(), Role.ADMIN) || user.getRole() == Role.MANAGER)
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Cannot delete this user").build();
        user.setDeleted(true);
        userRepository.save(user);
        return ResponseObject.builder().mess("Delete course successfully!").status(HttpStatus.OK).build();
    }

    public ResponseObject hardDelete(int id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseObject.builder().status(HttpStatus.BAD_REQUEST).mess("Course is not exist!").build();
        }
        userRepository.delete(user);
        return ResponseObject.builder().mess("Delete course successfully!").status(HttpStatus.OK).build();
    }

    public ResponseObject restoreUserById(int id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null)
            return ResponseObject.builder().mess("Course does not exist").status(HttpStatus.BAD_REQUEST).build();
        user.setDeleted(false);
        userRepository.save(user);
        return ResponseObject.builder().mess("Restore successfully").status(HttpStatus.OK).build();
    }
}
