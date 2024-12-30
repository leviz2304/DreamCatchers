package com.example.demo.controller.PrivateController;

import com.example.demo.dto.UserEssayDTO;
import com.example.demo.entity.data.Comment;
import com.example.demo.entity.data.UserEssay;
//import com.example.demo.service.CommentService;
import com.example.demo.service.CommentService;
import com.example.demo.service.DashboardService;
import com.example.demo.service.WritingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/private/dashboard")
public class DashboardController {
//    private final CommentService commentService;
    private final DashboardService dashboardService;
    private final WritingService writingService;
    private final CommentService commentService;
    public DashboardController( DashboardService dashboardService, WritingService writingService,CommentService commentService) {
        this.commentService = commentService;
        this.dashboardService = dashboardService;
        this.writingService = writingService;
    }

    @GetMapping("/essays/statistics")
    public ResponseEntity<Map<String, Object>> getEssayStatistics() {
        long totalEssayCount = writingService.getTotalEssayCount();
        Double averageScore = writingService.getAverageEssayScore();

        Map<String, Object> response = new HashMap<>();
        response.put("totalEssayCount", totalEssayCount);
        response.put("averageScore", averageScore);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/essays")
    public ResponseEntity<List<UserEssayDTO>> getAllEssays() {
        List<UserEssayDTO> essays = writingService.getAllEssaysWithUserNames();
        return ResponseEntity.ok(essays);
    }

    @GetMapping("/comments")
    public ResponseEntity<?> getRecentComments(@RequestParam(defaultValue = "10") int limit) {
        List<Comment> recentComments = commentService.getRecentComments(limit);
        List<Map<String, Object>> response = recentComments.stream().map(comment -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", comment.getId());
            map.put("content", comment.getContent());
            map.put("userEmail", comment.getUser().getEmail());
            map.put("userName", comment.getUser().getFirstName() + " " + comment.getUser().getLastName());
            map.put("avatar", comment.getUser().getAvatar());
            map.put("createdAt", comment.getCreatedAt());
            map.put("courseId", comment.getCourse() != null ? comment.getCourse().getId() : null);
            map.put("replyToUser", comment.getParentComment() != null ? comment.getParentComment().getUser().getEmail() : null);
            map.put("replyToUserName", comment.getParentComment() != null ? comment.getParentComment().getUser().getFirstName() + " " + comment.getParentComment().getUser().getLastName() : null);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Integer> stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

}
