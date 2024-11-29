package com.example.demo.service;

import com.example.demo.entity.data.*;
import com.example.demo.repository.data.*;
import com.example.demo.dto.*;
import com.example.demo.entity.user.User;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;

@Service
@RequiredArgsConstructor
public class TestService {

    private final TestRepository testRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final UserResponseRepository userResponseRepository;
    private final TestProgressRepository testProgressRepository;
    private final UserRepository userRepository;
    private final PassageRepository passageRepository;
    private final ListeningSectionRepository listeningSectionRepository;

    public Test getTestById(int id) {
        return testRepository.findById(id).orElse(null);
    }

    public List<Test> getAllTests() {
        return testRepository.findAll();
    }
    public List<Passage> getPassagesByTestId(int testId) {
        return passageRepository.findByTest_Id(testId);
    }

    public List<ListeningSection> getListeningSectionsByTestId(int testId) {
        return listeningSectionRepository.findByTest_Id(testId);
    }
    private final ModelMapper modelMapper;

    public TestDTO getTestDTOById(int id) {
        Test test = getTestById(id);
        if (test == null) return null;

        TestDTO testDTO = modelMapper.map(test, TestDTO.class);

        if ("READING".equalsIgnoreCase(test.getType())) {
            List<PassageDTO> passageDTOs = test.getPassages().stream()
                    .map(this::convertToPassageDTO)
                    .collect(Collectors.toList());
            testDTO.setPassages(passageDTOs);
        } else if ("LISTENING".equalsIgnoreCase(test.getType())) {
            List<ListeningSectionDTO> sectionDTOs = test.getListeningSections().stream()
                    .map(this::convertToListeningSectionDTO)
                    .collect(Collectors.toList());
            testDTO.setListeningSections(sectionDTOs);
        }

        return testDTO;
    }
    public List<Question> getQuestionsByTestId(int testId) {
        Test test = testRepository.findById(testId).orElse(null);
        if (test == null) {
            return Collections.emptyList();
        }

        List<Question> questions = new ArrayList<>();

        if ("READING".equalsIgnoreCase(test.getType())) {
            for (Passage passage : test.getPassages()) {
                questions.addAll(passage.getQuestions());
            }
        } else if ("LISTENING".equalsIgnoreCase(test.getType())) {
            for (ListeningSection section : test.getListeningSections()) {
                questions.addAll(section.getQuestions());
            }
        }

        return questions;
    }

    private PassageDTO convertToPassageDTO(Passage passage) {
        PassageDTO passageDTO = modelMapper.map(passage, PassageDTO.class);
        List<QuestionDTO> questionDTOs = passage.getQuestions().stream()
                .map(this::convertToQuestionDTO)
                .collect(Collectors.toList());
        passageDTO.setQuestions(questionDTOs);
        return passageDTO;
    }

    private ListeningSectionDTO convertToListeningSectionDTO(ListeningSection section) {
        ListeningSectionDTO sectionDTO = modelMapper.map(section, ListeningSectionDTO.class);
        List<QuestionDTO> questionDTOs = section.getQuestions().stream()
                .map(this::convertToQuestionDTO)
                .collect(Collectors.toList());
        sectionDTO.setQuestions(questionDTOs);
        return sectionDTO;
    }

    private QuestionDTO convertToQuestionDTO(Question question) {
        QuestionDTO questionDTO = modelMapper.map(question, QuestionDTO.class);
        if (question.getOptions() != null) {
            List<QuestionOptionDTO> questionOptionDTOS = question.getOptions().stream()
                    .map(option -> modelMapper.map(option, QuestionOptionDTO.class))
                    .collect(Collectors.toList());
            questionDTO.setOptions(questionOptionDTOS);
        }
        return questionDTO;
    }
    @Transactional
    public TestProgress startTest(int testId, int userId) {
        Test test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int totalQuestions = 0;

        if ("READING".equalsIgnoreCase(test.getType())) {
            Hibernate.initialize(test.getPassages());
            for (Passage passage : test.getPassages()) {
                Hibernate.initialize(passage.getQuestions());
                totalQuestions += passage.getQuestions().size();
            }
        } else if ("LISTENING".equalsIgnoreCase(test.getType())) {
            Hibernate.initialize(test.getListeningSections());
            for (ListeningSection section : test.getListeningSections()) {
                Hibernate.initialize(section.getQuestions());
                totalQuestions += section.getQuestions().size();
            }
        }

        TestProgress testProgress = TestProgress.builder()
                .test(test)
                .user(user)
                .startTime(LocalDateTime.now())
                .totalQuestions(totalQuestions)
                .isCompleted(false)
                .build();

        return testProgressRepository.save(testProgress);
    }



    private int calculateTotalQuestions(Test test) {
        int totalQuestions = 0;

        if ("READING".equalsIgnoreCase(test.getType())) {
            // Ensure passages are loaded
            List<Passage> passages = test.getPassages();
            if (passages != null) {
                for (Passage passage : passages) {
                    List<Question> questions = passage.getQuestions();
                    if (questions != null) {
                        totalQuestions += questions.size();
                    }
                }
            }
        } else if ("LISTENING".equalsIgnoreCase(test.getType())) {
            // Ensure listening sections are loaded
            List<ListeningSection> sections = test.getListeningSections();
            if (sections != null) {
                for (ListeningSection section : sections) {
                    List<Question> questions = section.getQuestions();
                    if (questions != null) {
                        totalQuestions += questions.size();
                    }
                }
            }
        }

        return totalQuestions;
    }


    @Transactional
    public void submitUserResponses(int testProgressId, List<UserResponseDTO> userResponsesDTO) {
        TestProgress testProgress = testProgressRepository.findById(testProgressId).orElseThrow();

        int correctAnswers = 0;

        for (UserResponseDTO dto : userResponsesDTO) {
            Question question = questionRepository.findById(dto.getQuestionId()).orElseThrow();
            boolean isCorrect = dto.getUserAnswer().trim().equalsIgnoreCase(question.getCorrectAnswer().trim());

            UserResponse userResponse = UserResponse.builder()
                    .testProgress(testProgress)
                    .question(question)
                    .userAnswer(dto.getUserAnswer())
                    .isCorrect(isCorrect)
                    .responseTime(LocalDateTime.now())
                    .build();

            userResponseRepository.save(userResponse);

            if (isCorrect) {
                correctAnswers++;
            }
        }

        // Update test progress
        testProgress.setCorrectAnswers(correctAnswers);
        testProgress.setEndTime(LocalDateTime.now());
        testProgress.setCompleted(true);

        testProgressRepository.save(testProgress);
    }

    @Transactional
    public void completeTest(int testProgressId) {
        TestProgress testProgress = testProgressRepository.findById(testProgressId).orElseThrow();
        testProgress.setEndTime(LocalDateTime.now());
        testProgress.setCompleted(true);

        testProgressRepository.save(testProgress);
    }

    // Additional methods as needed
}
