package com.example.demo.dto;

import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private int id;

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String avatar;
    private String phoneNumber;
    private String token;
    private Role role;

    public UserDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.avatar = user.getAvatar();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole();
    }

    public void setAvatar(String avatar) {
    }
}
