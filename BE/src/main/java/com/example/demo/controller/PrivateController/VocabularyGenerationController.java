package com.example.demo.controller.PrivateController;

import com.example.demo.dto.VocabularySetDTO;
import com.example.demo.entity.data.Vocabulary;
import com.example.demo.entity.data.VocabularySet;
import com.example.demo.entity.user.User;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.service.GPTService;
import com.example.demo.service.VocabularySetService;
import com.example.demo.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/private/vocabulary-generation")
public class VocabularyGenerationController {

    @Autowired
    private GPTService gptService;

    @Autowired
    private VocabularySetService vocabularySetService;

    @Autowired
    private UserService userService;
    @Autowired
    private ModelMapper modelMapper;
    @PostMapping("/generate")
    public ResponseEntity<VocabularySet> generateVocabularySet(
            @RequestParam String topic,
            @RequestParam int quantity,
            @RequestParam String level,
            Authentication authentication) {

        String userEmail = authentication.getName();
        Integer userId = userService.findByEmail(userEmail).getId();

        List<Vocabulary> vocabularies = gptService.generateVocabulary(topic, quantity, level);

        // Tạo VocabularySet
        VocabularySet vocabularySet = VocabularySet.builder()
                .title(String.format("Vocabulary Set: %s (%s)", topic, level))
                .topic(topic)
                .level(level)
                .quantity(quantity)
                .user(userService.findByEmail(userEmail))
                .build();

        // Lưu vào cơ sở dữ liệu
        VocabularySet savedSet = vocabularySetService.createVocabularySet(vocabularySet, vocabularies);

        return ResponseEntity.ok(savedSet);
    }

    @GetMapping("/sets")
    public ResponseEntity<List<VocabularySet>> getVocabularySets(Authentication authentication) {
        String userEmail = authentication.getName();
        Integer userId = userService.findByEmail(userEmail).getId();

        List<VocabularySet> sets = vocabularySetService.getVocabularySetsByUser(userId);
        return ResponseEntity.ok(sets);
    }
    @GetMapping("/sets/{setId}")
    public ResponseEntity<VocabularySetDTO> getVocabularySetById(@PathVariable Integer setId, Authentication authentication) {
        String userEmail = authentication.getName();
        User user = userService.findByEmail(userEmail);

        VocabularySet set = vocabularySetService.getVocabularySetById(setId)
                .orElseThrow(() -> new ResourceNotFoundException("VocabularySet", "id", setId));

        if (set.getUser().getId()!=(user.getId())) {
            throw new AccessDeniedException("You do not have permission to access this VocabularySet");
        }

        // Chuyển đổi VocabularySet sang VocabularySetDTO
        VocabularySetDTO setDTO = modelMapper.map(set, VocabularySetDTO.class);
        return ResponseEntity.ok(setDTO);
    }


    // Các endpoint khác như xóa, cập nhật nếu cần
}
