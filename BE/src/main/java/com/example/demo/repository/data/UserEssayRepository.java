package com.example.demo.repository.data;

import com.example.demo.dto.UserEssayDTO;
import com.example.demo.entity.data.UserEssay;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEssayRepository extends JpaRepository<UserEssay,Integer> {
    @Query("SELECT COUNT(e) FROM UserEssay e WHERE e.user.id = :userId")
    long countUserEssaysByUserId(@Param("userId") int userId);

    @Query("SELECT AVG(e.score) FROM UserEssay e WHERE e.user.id = :userId")
    Double findAverageEssayScoreByUserId(@Param("userId") int userId);
    @Query("SELECT e FROM UserEssay e WHERE e.user.id = :userId ORDER BY e.submissionTime DESC")
    List<UserEssay> findTop5ByUserIdOrderBySubmissionTimeDesc(@Param("userId") Integer userId);
    @Query("SELECT e FROM UserEssay e WHERE e.user.id = :userId ORDER BY e.submissionTime DESC")
    List<UserEssay> findUserEssaysByUserId(@Param("userId") int userId);
    @Query("SELECT COUNT(e) FROM UserEssay e")
    long countAllEssays();
    Page<UserEssay> findAllByUserId(Integer userId, Pageable pageable);
    List<UserEssay> findAllByUserId(Integer userId);

    @Query("SELECT AVG(e.score) FROM UserEssay e")
    Double findAverageEssayScore();

    @Query("SELECT e FROM UserEssay e ORDER BY e.submissionTime DESC")
    List<UserEssay> findAllEssaysOrderedBySubmissionTime();
    @Query("SELECT new com.example.demo.dto.UserEssayDTO(e.id, e.content, e.submissionTime, e.score, u.email) " +
            "FROM UserEssay e JOIN e.user u ORDER BY e.submissionTime DESC")
    List<UserEssayDTO> findAllEssaysWithUserNames();

}
