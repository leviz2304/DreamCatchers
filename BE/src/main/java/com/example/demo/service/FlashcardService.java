package com.example.demo.service;

import com.example.demo.entity.data.Flashcard;
import com.example.demo.entity.data.FlashcardSet;
import com.example.demo.entity.data.Vocabulary;
import com.example.demo.repository.data.FlashcardRepository;
import com.example.demo.repository.data.FlashcardSetRepository;
import com.example.demo.repository.data.VocabularyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlashcardService {

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private VocabularyRepository vocabularyRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    public List<FlashcardSet> getFlashcardSetsByUserId(Integer userId){
        return flashcardSetRepository.findByUserId(userId);
    }

    public FlashcardSet createFlashcardSet(Integer userId, String title, String description, List<Integer> vocabularyIds){
        FlashcardSet set = new FlashcardSet();
        set.setTitle(title);
        set.setDescription(description);
        // Assume you have a method to get user by id
        // set.setUser(userService.getUserById(userId));

        FlashcardSet savedSet = flashcardSetRepository.save(set);

        for(Integer vocabId : vocabularyIds){
            Vocabulary vocab = vocabularyRepository.findById(vocabId)
                    .orElseThrow(() -> new RuntimeException("Vocabulary not found with id " + vocabId));
            Flashcard flashcard = new Flashcard();
            flashcard.setSet(savedSet);
            flashcard.setVocabulary(vocab);
            flashcardRepository.save(flashcard);
        }

        return savedSet;
    }

    // Thêm các phương thức khác như update, delete nếu cần
}