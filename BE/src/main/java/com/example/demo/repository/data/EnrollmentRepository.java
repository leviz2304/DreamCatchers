package com.example.demo.repository.data;

import com.example.demo.entity.data.Course;
import com.example.demo.entity.data.Enrollment;
import com.example.demo.entity.data.EnrollmentId;
import com.example.demo.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentId> {
    List<Enrollment> findByUserId(Integer userId);
    List<Enrollment> findByCourseId(Integer courseId);
    boolean existsByIdUserIdAndIdCourseId(Integer userId, Integer courseId);
    boolean existsByUserAndCourse(User user, Course course);

}
