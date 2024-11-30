package com.example.demo.service;



import com.example.demo.entity.data.Vocabulary;
import com.example.demo.repository.data.VocabularyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VocabularyService {

    @Autowired
    private VocabularyRepository vocabularyRepository;

    public List<Vocabulary> getAllVocabulary(){
        return vocabularyRepository.findAll();
    }

    public Vocabulary addVocabulary(Vocabulary vocabulary){
        return vocabularyRepository.save(vocabulary);
    }

    public Vocabulary updateVocabulary(Integer id, Vocabulary updatedVocabulary){
        return vocabularyRepository.findById(id)
                .map(v -> {
                    v.setWord(updatedVocabulary.getWord());
                    v.setDefinition(updatedVocabulary.getDefinition());
                    v.setExample(updatedVocabulary.getExample());
                    return vocabularyRepository.save(v);
                })
                .orElseThrow(() -> new RuntimeException("Vocabulary not found with id " + id));
    }

    public void deleteVocabulary(Integer id){
        vocabularyRepository.deleteById(id);
    }
}
