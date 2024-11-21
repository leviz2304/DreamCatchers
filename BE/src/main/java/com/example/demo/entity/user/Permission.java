package com.example.demo.entity.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

public enum Permission {
    INSTRUCTOR_CREATE_COURSE("instructor:create_course"),
    INSTRUCTOR_UPDATE_COURSE("instructor:update_course"),
    INSTRUCTOR_DELETE_COURSE("instructor:delete_course"),
    INSTRUCTOR_READ_COURSE("instructor:read_course"),
    INSTRUCTOR_COMMUNICATE("instructor:communicate"),
    // Existing permissions
    ADMIN_CREATE("admin:create"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_DELETE("admin:delete"),
    ADMIN_READ("admin:read"),
    MANAGER_CREATE("manager:create"),
    MANAGER_UPDATE("manager:update"),
    MANAGER_DELETE("manager:delete"),
    MANAGER_READ("manager:read");

    @Getter
    private final String permission;

    Permission(String permission) {
        this.permission = permission;
    }
}

