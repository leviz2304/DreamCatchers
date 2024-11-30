package com.example.demo.controller.PrivateController;

import com.example.demo.entity.data.FlashcardSet;
import com.example.demo.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FlashcardSet>> getFlashcardSetsByUser(@PathVariable Integer userId){
        return ResponseEntity.ok(flashcardService.getFlashcardSetsByUserId(userId));
    }

    @PostMapping("/create")
    public ResponseEntity<FlashcardSet> createFlashcardSet(@RequestParam Integer userId,
                                                           @RequestParam String title,
                                                           @RequestParam String description,
                                                           @RequestBody List<Integer> vocabularyIds){
        return ResponseEntity.ok(flashcardService.createFlashcardSet(userId, title, description, vocabularyIds));
    }

    // Thêm các endpoint khác như update, delete nếu cần
}