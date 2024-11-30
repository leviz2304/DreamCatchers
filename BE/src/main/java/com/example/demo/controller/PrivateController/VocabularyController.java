package com.example.demo.controller.PrivateController;

import com.example.demo.entity.data.Vocabulary;
import com.example.demo.service.VocabularyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/vocabulary")
public class VocabularyController {

    @Autowired
    private VocabularyService vocabularyService;

    @GetMapping
    public ResponseEntity<List<Vocabulary>> getAllVocabulary(){
        return ResponseEntity.ok(vocabularyService.getAllVocabulary());
    }

    @PostMapping
    public ResponseEntity<Vocabulary> addVocabulary(@RequestBody Vocabulary vocabulary){
        return ResponseEntity.ok(vocabularyService.addVocabulary(vocabulary));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vocabulary> updateVocabulary(@PathVariable Integer id, @RequestBody Vocabulary vocabulary){
        return ResponseEntity.ok(vocabularyService.updateVocabulary(id, vocabulary));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVocabulary(@PathVariable Integer id){
        vocabularyService.deleteVocabulary(id);
        return ResponseEntity.noContent().build();
    }
}