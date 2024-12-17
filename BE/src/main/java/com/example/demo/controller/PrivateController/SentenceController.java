//package com.example.demo.controller.PrivateController;
//
//import com.example.demo.dto.SentenceDTO;
//import com.example.demo.service.PronunciationService;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/v1/private/pronunciation/sentences")
//public class SentenceController {
//
//    private final PronunciationService pronunciationService;
//
//    public SentenceController(PronunciationService pronunciationService) {
//        this.pronunciationService = pronunciationService;
//    }
//
//    // Tạo mới Sentence
//    @PostMapping
//    public ResponseEntity<SentenceDTO> createSentence(@RequestBody SentenceDTO sentenceDTO) {
//        SentenceDTO createdSentence = pronunciationService.createSentence(sentenceDTO);
//        return ResponseEntity.status(HttpStatus.CREATED).body(createdSentence);
//    }
//
//    // Lấy tất cả Sentence theo Topic ID
//    @GetMapping("/by-topic/{topicId}")
//    public ResponseEntity<List<SentenceDTO>> getSentencesByTopic(@PathVariable Integer topicId) {
//        List<SentenceDTO> sentences = pronunciationService.getSentencesByTopic(topicId);
//        return ResponseEntity.ok(sentences);
//    }
//
//    // Lấy chi tiết một Sentence theo ID
//    @GetMapping("/{sentenceId}")
//    public ResponseEntity<SentenceDTO> getSentenceById(@PathVariable Integer sentenceId) {
//        SentenceDTO sentence = pronunciationService.getSentenceById(sentenceId);
//        return ResponseEntity.ok(sentence);
//    }
//
//    // Cập nhật một Sentence theo ID
//    @PutMapping("/{sentenceId}")
//    public ResponseEntity<SentenceDTO> updateSentence(@PathVariable Integer sentenceId, @RequestBody SentenceDTO sentenceDTO) {
//        SentenceDTO updatedSentence = pronunciationService.updateSentence(sentenceId, sentenceDTO);
//        return ResponseEntity.ok(updatedSentence);
//    }
//
//    // Xóa một Sentence theo ID
//    @DeleteMapping("/{sentenceId}")
//    public ResponseEntity<?> deleteSentence(@PathVariable Integer sentenceId) {
//        pronunciationService.deleteSentence(sentenceId);
//        return ResponseEntity.noContent().build();
//    }
//}