package com.example.demo.service;

import com.example.demo.entity.data.Vocabulary;
import com.example.demo.entity.data.VocabularySet;
import com.example.demo.repository.data.VocabularyRepository;
import com.example.demo.repository.data.VocabularySetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class VocabularySetService {

    @Autowired
    private VocabularySetRepository vocabularySetRepository;

    @Autowired
    private VocabularyRepository vocabularyRepository;

    @Transactional
    public VocabularySet createVocabularySet(VocabularySet vocabularySet, List<Vocabulary> vocabularies) {
        vocabularySet.setVocabularies(vocabularies);
        vocabularies.forEach(vocab -> vocab.setVocabularySet(vocabularySet));
        return vocabularySetRepository.save(vocabularySet);
    }

    public List<VocabularySet> getVocabularySetsByUser(Integer userId) {
        return vocabularySetRepository.findByUserId(userId);
    }

    public Optional<VocabularySet> getVocabularySetById(Integer setId) {
        return vocabularySetRepository.findById(setId);
    }

    public void deleteVocabularySet(Integer setId) {
        vocabularySetRepository.deleteById(setId);
    }

    // Các phương thức khác nếu cần
}
