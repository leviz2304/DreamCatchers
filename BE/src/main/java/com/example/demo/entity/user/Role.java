package com.example.demo.entity.user;

import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.*;
import java.util.stream.Collectors;
@Getter

public enum Role {

    USER(Collections.emptySet()),
    INSTRUCTOR(
            Set.of(
                    Permission.INSTRUCTOR_CREATE_COURSE,
                    Permission.INSTRUCTOR_UPDATE_COURSE,
                    Permission.INSTRUCTOR_DELETE_COURSE,
                    Permission.INSTRUCTOR_READ_COURSE,
                    Permission.INSTRUCTOR_COMMUNICATE // Allows messaging with users
            )
    ),
    ADMIN(
            Set.of(
                    Permission.ADMIN_CREATE,
                    Permission.ADMIN_UPDATE,
                    Permission.ADMIN_DELETE,
                    Permission.ADMIN_READ,
                    Permission.MANAGER_READ,
                    Permission.MANAGER_CREATE,
                    Permission.MANAGER_UPDATE,
                    Permission.MANAGER_DELETE
            )
    ),
    MANAGER(
            Set.of(
                    Permission.MANAGER_CREATE,
                    Permission.MANAGER_UPDATE,
                    Permission.MANAGER_READ,
                    Permission.MANAGER_DELETE
            )
    );

    @Getter
    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }


    public List<SimpleGrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
