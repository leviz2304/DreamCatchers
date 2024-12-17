import React, { useState, useEffect } from "react";
import UploadModal from "../../component/UploadModal/UploadModal";
import { useSelector } from "react-redux";
import { getCategories } from "../../api/apiService/dataService";

import {
  Button,
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  IconButton,
  Divider
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const CourseForm = ({ initialData = {}, onSubmit }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnailUrl || "");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(initialData.videoPreviewUrl || "");
  const [sections, setSections] = useState(initialData.sections || []);

  const [categoryIds, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(initialData.categories || []);

  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [showLessonUploadModal, setShowLessonUploadModal] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(null);
  const userInfo = useSelector((state) => state.login.user);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data.content || data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Vui lòng nhập tiêu đề khoá học.");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Vui lòng chọn ít nhất một category.");
      return;
    }

    if (!thumbnailUrl) {
      alert("Vui lòng tải lên Thumbnail.");
      return;
    }

    if (!videoPreviewUrl) {
      alert("Vui lòng tải lên Video Preview.");
      return;
    }

    if (!userInfo || !userInfo.id) {
      alert("Không thể xác định người dạy (tutor). Vui lòng đăng nhập lại.");
      return;
    }

    const courseDTO = {
      title,
      description,
      thumbnailUrl,
      videoPreviewUrl,
      categoryIds: selectedCategories,
      tutorId: parseInt(userInfo.id, 10),
      sections
    };
    onSubmit(courseDTO);
  };

  const addSection = () => {
    setSections([...sections, { name: "", lessons: [] }]);
  };

  const removeSection = (index) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const updateSection = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const addLesson = (sectionIndex) => {
    const newSections = [...sections];
    if (!newSections[sectionIndex].lessons) {
      newSections[sectionIndex].lessons = [];
    }
    newSections[sectionIndex].lessons.push({ name: "", videoUrl: "" });
    setSections(newSections);
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons.splice(lessonIndex, 1);
    setSections(newSections);
  };

  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    const newSections = [...sections];
    newSections[sectionIndex].lessons[lessonIndex][field] = value;
    setSections(newSections);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 bg-white rounded shadow-md">
      <Typography variant="h5" fontWeight="bold">
        Tạo/Chỉnh sửa Khóa học
      </Typography>
      
      <TextField
        label="Tiêu đề khoá học"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div>
        <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
          Mô tả
        </Typography>
        <TextareaAutosize
          minRows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full p-2 rounded"
          placeholder="Mô tả khóa học..."
        />
      </div>

      <div>
        <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
          Thumbnail URL
        </Typography>
        <div className="flex items-center space-x-2">
          <TextField
            variant="outlined"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={() => setShowThumbnailModal(true)}>
            Upload
          </Button>
        </div>
        {thumbnailUrl && (
          <img
            src={thumbnailUrl}
            alt="Thumbnail Preview"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
      </div>

      <div>
        <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
          Video Preview URL
        </Typography>
        <div className="flex items-center space-x-2">
          <TextField
            variant="outlined"
            value={videoPreviewUrl}
            onChange={(e) => setVideoPreviewUrl(e.target.value)}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={() => setShowVideoModal(true)}>
            Upload
          </Button>
        </div>
        {videoPreviewUrl && (
          <video controls className="mt-2 w-full h-auto rounded">
            <source src={videoPreviewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div>
        <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
          Chọn Category
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={selectedCategories}
            onChange={handleCategoryChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const cat = categoryIds.find((c) => c.id === value);
                  return <Chip key={value} label={cat ? cat.name : value} />;
                })}
              </Box>
            )}
          >
            {categoryIds.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="caption" color="textSecondary">
          Giữ Ctrl (Cmd trên Mac) để chọn nhiều categories
        </Typography>
      </div>

      <Divider className="my-4" />

      <div className="mb-4">
        <Typography variant="h6" fontWeight="bold" className="mb-2">
          Nội dung khoá học (Curriculum)
        </Typography>
        {sections.map((section, sIndex) => (
          <Box key={sIndex} className="border p-4 mb-4 bg-gray-50 rounded">
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="subtitle1" fontWeight="bold">
                Section {sIndex + 1}
              </Typography>
              <IconButton color="error" onClick={() => removeSection(sIndex)}>
                <DeleteIcon />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tên Section"
              value={section.name}
              onChange={(e) => updateSection(sIndex, "name", e.target.value)}
              className="mb-2"
            />

            <Box className="ml-4">
              <Typography variant="subtitle1" fontWeight="bold" className="mb-2">
                Lessons
              </Typography>
              {section.lessons &&
                section.lessons.map((lesson, lIndex) => (
                  <Box key={lIndex} className="border p-2 mb-2 bg-white rounded">
                    <Box className="flex justify-between items-center mb-2">
                      <Typography variant="body1">Lesson {lIndex + 1}</Typography>
                      <IconButton color="error" onClick={() => removeLesson(sIndex, lIndex)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Tên Lesson"
                      className="mb-2"
                      value={lesson.name}
                      onChange={(e) => updateLesson(sIndex, lIndex, "name", e.target.value)}
                    />
                    <Box className="flex space-x-2 items-center mb-2">
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Video URL"
                        value={lesson.videoUrl}
                        onChange={(e) => updateLesson(sIndex, lIndex, "videoUrl", e.target.value)}
                        InputProps={{ readOnly: true }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => {
                          setCurrentLessonIndex({ sectionIndex: sIndex, lessonIndex: lIndex });
                          setShowLessonUploadModal(true);
                        }}
                      >
                        Upload Video Lesson
                      </Button>
                    </Box>
                    {lesson.videoUrl && (
                      <video controls className="mt-2 w-full h-auto rounded">
                        <source src={lesson.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </Box>
                ))}

              <Button
                variant="outlined"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => addLesson(sIndex)}
              >
                Thêm Lesson
              </Button>
            </Box>
          </Box>
        ))}

        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={addSection}>
          Thêm Section
        </Button>
      </div>

      <Button type="submit" variant="contained" color="success" size="large">
        Lưu Khóa Học
      </Button>

      {/* Upload Modals */}
      {showThumbnailModal && (
        <UploadModal
          type="image"
          onClose={() => setShowThumbnailModal(false)}
          onUploadSuccess={(url) => setThumbnailUrl(url)}
        />
      )}

      {showVideoModal && (
        <UploadModal
          type="video"
          onClose={() => setShowVideoModal(false)}
          onUploadSuccess={(url) => setVideoPreviewUrl(url)}
        />
      )}

      {showLessonUploadModal && currentLessonIndex && (
        <UploadModal
          type="video"
          onClose={() => setShowLessonUploadModal(false)}
          onUploadSuccess={(url) => {
            const { sectionIndex, lessonIndex } = currentLessonIndex;
            updateLesson(sectionIndex, lessonIndex, "videoUrl", url);
          }}
        />
      )}
    </form>
  );
};

export default CourseForm;
