// CreateCourse.jsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Typography,
  Grid,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import { Close as CloseIcon, Upload as UploadIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { toast } from "sonner";
import * as DataApi from "../../../../api/apiService/dataService";

const initFormData = {
  id: "",
  title: "",
  description: "",
  price: "",
  discount: "",
  thumbnail: "",
  video: "",
  categories: [],
  sections: [],
  date: "",
  instructor: "",
};

function CreateCourse() {
  const [formData, setFormData] = useState(initFormData);
  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Set instructor email on component mount
    const instructorEmail = fetchInstructorEmail();
    if (instructorEmail) {
      setFormData((prev) => ({ ...prev, instructor: instructorEmail }));
    } else {
      toast.error("Failed to fetch instructor email from sessionStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await DataApi.getAllCategories(0, 99999999);
        setOptions(result.content.content);
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to fetch categories.");
      }
    };
    fetchApi();
  }, []);

  const fetchInstructorEmail = () => {
    const user = sessionStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.email || ""; // Default to an empty string if email is not found
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData({
      ...formData,
      categories: typeof value === "string" ? value.split(",") : value,
      isEditedCategories: true, // For BE validation
    });
    setErrors((prev) => ({ ...prev, categories: "" }));
  };

  const handleFileChange = (e, index, sectionIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    toast.promise(DataApi.uploadImg(file), {
      loading: "Uploading file...",
      success: (result) => {
        setIsUploading(false);
        if (file.type === "video/mp4") {
          const updateSection = { ...formData.sections[sectionIndex] };
          updateSection.lessons[index] = {
            ...updateSection.lessons[index],
            video: result.content,
          };
          const updateSections = [...formData.sections];
          updateSections[sectionIndex] = updateSection;

          setFormData({
            ...formData,
            sections: [...updateSections],
          });
        } else {
          setFormData({
            ...formData,
            thumbnail: result.content,
          });
        }
        return "File uploaded successfully!";
      },
      error: (error) => {
        console.log(error);
        setIsUploading(false);
        return "File upload failed.";
      },
    });
    e.target.value = "";
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleUpdateVideoCourse = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    toast.promise(DataApi.uploadImg(file), {
      loading: "Uploading video...",
      success: (result) => {
        setIsUploading(false);
        setFormData((prev) => ({
          ...prev,
          video: result.content,
        }));
        return "Video uploaded successfully!";
      },
      error: (error) => {
        console.log(error);
        setIsUploading(false);
        return "Video upload failed.";
      },
    });
    e.target.value = "";
  };

  const handleRemoveItemPreview = (type, index, sectionIndex) => {
    if (type === "video") {
      const updateSection = { ...formData.sections[sectionIndex] };
      updateSection.lessons[index] = {
        ...updateSection.lessons[index],
        video: null,
        actionVideo: "NONE",
      };
      const updateSections = [...formData.sections];
      updateSections[sectionIndex] = { ...updateSection };
      setFormData({ ...formData, sections: [...updateSections] });
    } else if (type === "thumbnail") {
      setFormData({ ...formData, thumbnail: "" });
    }
  };

  const handleInputLessonChange = (e, index, sectionIndex) => {
    const { name, value } = e.target;
    const updateSections = [...formData.sections];
    updateSections[sectionIndex].lessons[index] = {
      ...updateSections[sectionIndex].lessons[index],
      [name]: value,
    };
    setFormData({
      ...formData,
      sections: updateSections,
    });
    setErrors((prev) => ({ ...prev, [`lesson-${sectionIndex}-${index}-${name}`]: "" }));
  };

  const handleRemoveLesson = (index, sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons.splice(index, 1);
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const handleAddLesson = (sectionIndex) => {
    const newLesson = {
      title: "",
      description: "",
      video: "",
      linkVideo: "",
    };
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons.push(newLesson);
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const handleInputSectionChange = (e, sectionIndex) => {
    const { value } = e.target;
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].title = value;
    updatedSections[sectionIndex].isEdited = true; // Ensure BE knows this is updated
    setFormData({
      ...formData,
      sections: updatedSections,
    });
    setErrors((prev) => ({ ...prev, [`section-${sectionIndex}`]: "" }));
  };

  const handleRemoveSection = (index) => {
    const updatedSections = [...formData.sections];
    updatedSections.splice(index, 1);
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const handleAddSection = () => {
    const newSection = {
      title: "",
      lessons: [],
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
    });
  };

  const handleRemoveVideoCourse = () => {
    setFormData({ ...formData, video: "" });
  };

  const validateForm = (data) => {
    const validationErrors = {};
    if (!data.title.trim()) validationErrors.title = "Course Name is required.";
    if (!data.description.trim()) validationErrors.description = "Description is required.";
    if (!data.price || isNaN(data.price)) validationErrors.price = "Valid price is required.";
    if (!data.thumbnail) validationErrors.thumbnail = "Thumbnail is required.";
    if (data.categories.length === 0) validationErrors.categories = "At least one category is required.";
    data.sections.forEach((section, sectionIndex) => {
      if (!section.title.trim()) validationErrors[`section-${sectionIndex}`] = `Section ${sectionIndex + 1} Name is required.`;
      section.lessons.forEach((lesson, lessonIndex) => {
        if (!lesson.title.trim()) validationErrors[`lesson-title-${sectionIndex}-${lessonIndex}`] = `Lesson ${lessonIndex + 1} Name is required in Section ${sectionIndex + 1}.`;
        if (!lesson.description.trim()) validationErrors[`lesson-description-${sectionIndex}-${lessonIndex}`] = `Lesson ${lessonIndex + 1} Description is required in Section ${sectionIndex + 1}.`;
      });
    });
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUploading) {
      toast.error("Please wait for the file to finish uploading.");
      return;
    }

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Prepare and sanitize the payload
    const preparePayload = () => ({
      title: formData.title,
      description: formData.description,
      price: Number(formData.price) || 0,
      discount: Number(formData.discount) || 0,
      thumbnail: formData.thumbnail,
      video: formData.video,
      categories: formData.categories.map((cate) => Number(cate.id)),
      instructor: formData.instructor,
      sections: formData.sections.map((section) => ({
        title: section.title,
        lessons: section.lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          video: lesson.video || "",
          linkVideo: lesson.linkVideo || "",
        })),
      })),
      date: formData.date || null,
    });

    const payload = preparePayload();
    console.log("Payload sent to API:", payload);

    try {
      await toast.promise(DataApi.createCourse(payload), {
        loading: "Creating course...",
        success: "Course created successfully!",
        error: "Failed to create course.",
      });
      setFormData(initFormData); // Reset form on success
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error("Failed to create course. Please check your input.");
    }
  };

  return (
    <Box className="container mx-auto p-4">
      <Paper elevation={3} className="p-6">
        <Typography variant="h4" className="mb-6 text-center">
          Create a New Course
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            {/* Course Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Name"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                required
                multiline
                rows={4}
              />
            </Grid>
            {/* Categories and Price */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.categories}>
                <InputLabel id="categories-label">Categories</InputLabel>
                <Select
                  labelId="categories-label"
                  multiple
                  value={formData.categories}
                  onChange={handleSelectChange}
                  label="Categories"
                  renderValue={(selected) => selected.map((s) => s.name).join(", ")}
                >
                  {options.map((option) => (
                    <MenuItem key={option.id} value={option}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categories && <FormHelperText>{errors.categories}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                error={!!errors.price}
                helperText={errors.price}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            {/* Thumbnail */}
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                className="h-16"
              >
                Upload Thumbnail
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  hidden
                  onChange={(e) => handleFileChange(e)}
                  name="thumbnail"
                />
              </Button>
              {errors.thumbnail && (
                <Typography variant="body2" color="error" className="mt-1">
                  {errors.thumbnail}
                </Typography>
              )}
            </Grid>
            {/* Thumbnail Preview */}
            {formData.thumbnail && (
              <Grid item xs={12} md={6} className="flex items-center">
                <Box className="relative w-full h-48">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail Preview"
                    className="object-cover w-full h-full rounded"
                  />
                  <IconButton
                    size="small"
                    className="absolute top-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100"
                    onClick={() => handleRemoveItemPreview("thumbnail")}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            )}
            {/* Video */}
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadIcon />}
                fullWidth
                className="h-16"
              >
                Upload Video
                <input
                  type="file"
                  accept=".mp4"
                  hidden
                  onChange={handleUpdateVideoCourse}
                  name="video"
                />
              </Button>
            </Grid>
            {/* Video Preview */}
            {formData.video && (
              <Grid item xs={12} md={6} className="flex items-center">
                <Box className="relative w-full h-48">
                  <video
                    src={formData.video}
                    controls
                    className="object-cover w-full h-full rounded"
                  />
                  <IconButton
                    size="small"
                    className="absolute top-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100"
                    onClick={handleRemoveVideoCourse}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            )}
            {/* Curriculum */}
            <Grid item xs={12}>
              <Typography variant="h5" className="mb-4 text-center">
                Curriculum
              </Typography>
              {formData.sections.map((section, sectionIndex) => (
                <Paper key={sectionIndex} elevation={2} className="p-4 mb-6">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label={`Section ${sectionIndex + 1} Name`}
                        name="sectionTitle"
                        value={section.title}
                        onChange={(e) => handleInputSectionChange(e, sectionIndex)}
                        error={!!errors[`section-${sectionIndex}`]}
                        helperText={errors[`section-${sectionIndex}`]}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6} className="flex justify-end">
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveSection(sectionIndex)}
                      >
                        Remove Section
                      </Button>
                    </Grid>
                  </Grid>
                  {/* Lessons */}
                  <Box className="mt-4">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <Paper key={lessonIndex} elevation={1} className="p-4 mb-4">
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label={`Lesson ${lessonIndex + 1} Name`}
                              name="title"
                              value={lesson.title}
                              onChange={(e) => handleInputLessonChange(e, lessonIndex, sectionIndex)}
                              error={!!errors[`lesson-title-${sectionIndex}-${lessonIndex}`]}
                              helperText={errors[`lesson-title-${sectionIndex}-${lessonIndex}`]}
                              required
                            />
                          </Grid>
                          <Grid item xs={12} md={6} className="flex justify-end">
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleRemoveLesson(lessonIndex, sectionIndex)}
                            >
                              Remove Lesson
                            </Button>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Description"
                              name="description"
                              value={lesson.description}
                              onChange={(e) => handleInputLessonChange(e, lessonIndex, sectionIndex)}
                              error={!!errors[`lesson-description-${sectionIndex}-${lessonIndex}`]}
                              helperText={errors[`lesson-description-${sectionIndex}-${lessonIndex}`]}
                              required
                              multiline
                              rows={3}
                            />
                          </Grid>
                          {/* Video Upload */}
                          <Grid item xs={12} md={6}>
                            <Button
                              variant="outlined"
                              component="label"
                              startIcon={<UploadIcon />}
                              fullWidth
                              className="h-16"
                            >
                              Upload Lesson Video
                              <input
                                type="file"
                                accept=".mp4"
                                hidden
                                onChange={(e) => handleFileChange(e, lessonIndex, sectionIndex)}
                                name="video"
                              />
                            </Button>
                          </Grid>
                          {/* Video Preview */}
                          {lesson.video && (
                            <Grid item xs={12} md={6} className="flex items-center">
                              <Box className="relative w-full h-48">
                                <video
                                  src={lesson.video}
                                  controls
                                  className="object-cover w-full h-full rounded"
                                />
                                <IconButton
                                  size="small"
                                  className="absolute top-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100"
                                  onClick={() => handleRemoveItemPreview("video", lessonIndex, sectionIndex)}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Grid>
                          )}
                          {/* Link Video */}
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Link Video"
                              name="linkVideo"
                              value={lesson.linkVideo}
                              onChange={(e) => handleInputLessonChange(e, lessonIndex, sectionIndex)}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                    <Button
                      variant="outlined"
                      onClick={() => handleAddLesson(sectionIndex)}
                      startIcon={<UploadIcon />}
                    >
                      Add Lesson
                    </Button>
                  </Box>
                </Paper>
              ))}
              <Button
                variant="contained"
                onClick={handleAddSection}
                startIcon={<UploadIcon />}
              >
                Add Section
              </Button>
            </Grid>
            {/* Submit Button */}
            <Grid item xs={12} className="flex justify-center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                disabled={isUploading}
                className="w-1/3"
              >
                Create Course
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default CreateCourse;
