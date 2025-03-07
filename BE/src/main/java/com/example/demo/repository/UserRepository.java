package com.example.demo.repository;

import com.example.demo.entity.user.Role;
import com.example.demo.entity.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    int countByRole(@Param("role") Role role);

    Page<User> findByIsDeletedFalse(Pageable pageable);

    Optional<User> findByPhoneNumber(String phoneNumber);

    @Query(value = "select * from user where role = :role", nativeQuery = true)
    Page<User> findByRole(String role, Pageable pageable);

    @Query(value = "select u from User u where (u.firstName like %?1% or u.lastName like %?2%) and u.isDeleted = ?3")
    Page<User> findByFirstNameContainingOrLastNameContainingAndAndDeleted(String firstName, String lastName, boolean isDelete, Pageable pageable);

    Page<User> findAllByIsDeleted(boolean isDeleted, Pageable pageable);

    @Query("SELECT COUNT(u) FROM User u WHERE MONTH(u.createdAt) = :month AND YEAR(u.createdAt) = :year")
    int countUsersRegisteredInMonth(@Param("month") int month, @Param("year") int year);

}
