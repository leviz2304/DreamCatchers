//package com.example.demo.controller.PrivateController;
//
//import com.example.demo.dto.ResponseObject;
//import com.example.demo.dto.SectionDTO;
//import com.example.demo.service.SectionService;
//import jakarta.validation.Valid;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/v1/private/sections")
//public class SectionController {
//
//    @Autowired
//    private SectionService sectionService;
//
//    // Tạo mới Section
//    @PostMapping
//    public ResponseEntity<ResponseObject> createSection(@Valid @RequestBody SectionDTO sectionDTO) {
//        try {
//            // Giả sử bạn có một service để liên kết Section với Course
//            // Nếu không, bạn cần điều chỉnh để liên kết trước khi lưu
//            // Ví dụ: SectionService sẽ xử lý liên kết này
//
//            // Tạo Section mới
//            // Bạn cần thêm phương thức saveSection trong SectionService để liên kết với Course
//            // Ví dụ:
//            // SectionDTO savedSection = sectionService.saveSection(sectionDTO);
//            // return ResponseEntity...
//
//            // Tạm thời, giả sử SectionService đã xử lý liên kết
//            SectionDTO savedSection = sectionService.saveSection(sectionDTO);
//            return ResponseEntity.status(HttpStatus.CREATED)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.CREATED)
//                            .mess("Section created successfully")
//                            .content(savedSection)
//                            .build());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.BAD_REQUEST)
//                            .mess("Error creating section: " + e.getMessage())
//                            .content(null)
//                            .build());
//        }
//    }
//
//    // Lấy tất cả các Section
//    @GetMapping
//    public ResponseEntity<ResponseObject> getAllSections() {
//        List<SectionDTO> sections = sectionService.getAllSections();
//        return ResponseEntity.status(HttpStatus.OK)
//                .body(ResponseObject.builder()
//                        .status(HttpStatus.OK)
//                        .mess("Fetched all sections successfully")
//                        .content(sections)
//                        .build());
//    }
//
//    // Lấy Section theo ID
//    @GetMapping("/{id}")
//    public ResponseEntity<ResponseObject> getSectionById(@PathVariable Integer id) {
//        Optional<SectionDTO> sectionOpt = sectionService.getSectionById(id);
//        if (sectionOpt.isPresent()) {
//            return ResponseEntity.status(HttpStatus.OK)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.OK)
//                            .mess("Fetched section successfully")
//                            .content(sectionOpt.get())
//                            .build());
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.NOT_FOUND)
//                            .mess("Section not found with id: " + id)
//                            .content(null)
//                            .build());
//        }
//    }
//
//    // Cập nhật Section
//    @PutMapping("/{id}")
//    public ResponseEntity<ResponseObject> updateSection(@PathVariable Integer id, @Valid @RequestBody SectionDTO sectionDTO) {
//        try {
//            SectionDTO updatedSection = sectionService.updateSection(id, sectionDTO);
//            return ResponseEntity.status(HttpStatus.OK)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.OK)
//                            .mess("Section updated successfully")
//                            .content(updatedSection)
//                            .build());
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.NOT_FOUND)
//                            .mess(e.getMessage())
//                            .content(null)
//                            .build());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.BAD_REQUEST)
//                            .mess("Error updating section: " + e.getMessage())
//                            .content(null)
//                            .build());
//        }
//    }
//
//    // Xóa Section
//    @DeleteMapping("/{id}")
//    public ResponseEntity<ResponseObject> deleteSection(@PathVariable Integer id) {
//        try {
//            sectionService.deleteSection(id);
//            return ResponseEntity.status(HttpStatus.NO_CONTENT)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.NO_CONTENT)
//                            .mess("Section deleted successfully")
//                            .content(null)
//                            .build());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(ResponseObject.builder()
//                            .status(HttpStatus.BAD_REQUEST)
//                            .mess("Error deleting section: " + e.getMessage())
//                            .content(null)
//                            .build());
//        }
//    }
//}
