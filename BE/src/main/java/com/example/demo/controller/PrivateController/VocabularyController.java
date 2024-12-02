package com.example.demo.controller.PrivateController;

import com.example.demo.dto.VocabularySetDTO;
import com.example.demo.entity.data.Vocabulary;
import com.example.demo.entity.data.VocabularySet;
import com.example.demo.entity.user.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.UserService;
import com.example.demo.service.VocabularyService;
import com.example.demo.service.VocabularySetService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/vocabulary")
public class VocabularyController {

    @Autowired
    private VocabularyService vocabularyService;
    @Autowired
    private UserService userService;
    @Autowired
    private VocabularySetService vocabularySetService;
    @Autowired
    private ModelMapper modelMapper;
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
    @PutMapping("/sets/{setId}")
    public ResponseEntity<VocabularySetDTO> updateVocabularySet(
            @PathVariable Integer setId,
            @RequestBody VocabularySetDTO setDTO,
            Authentication authentication) {

        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);

        VocabularySet set = vocabularySetService.getVocabularySetById(setId)
                .orElseThrow(() -> new ResourceNotFoundException("VocabularySet", "id", setId));

        if (set.getUser().getId() != (user.getId())) {
            throw new AccessDeniedException("You do not have permission to update this VocabularySet");
        }

        // Cập nhật các trường cần thiết
        set.setTitle(setDTO.getTitle());
        set.setTopic(setDTO.getTopic());
        set.setLevel(setDTO.getLevel());
        set.setQuantity(setDTO.getQuantity());

        // Cập nhật từ vựng nếu có
        if (setDTO.getVocabularies() != null) {
            set.getVocabularies().clear();
            setDTO.getVocabularies().forEach(vocabDTO -> {
                Vocabulary vocab = Vocabulary.builder()
                        .word(vocabDTO.getWord())
                        .definition(vocabDTO.getDefinition())
                        .example(vocabDTO.getExample())
                        .build();
                vocab.setVocabularySet(set);
                set.getVocabularies().add(vocab);
            });
        }

        VocabularySet updatedSet = vocabularySetService.createVocabularySet(set, set.getVocabularies());
        VocabularySetDTO updatedSetDTO = modelMapper.map(updatedSet, VocabularySetDTO.class);
        return ResponseEntity.ok(updatedSetDTO);
    }

    @DeleteMapping("/sets/{setId}")
    public ResponseEntity<Void> deleteVocabularySet(@PathVariable Integer setId, Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);

        VocabularySet set = vocabularySetService.getVocabularySetById(setId)
                .orElseThrow(() -> new ResourceNotFoundException("VocabularySet", "id", setId));

        if (set.getUser().getId()!= (user.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this VocabularySet");
        }

        vocabularySetService.deleteVocabularySet(setId);
        return ResponseEntity.noContent().build();
    }

}