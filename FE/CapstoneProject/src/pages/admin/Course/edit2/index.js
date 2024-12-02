// EditCourse.jsx
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  IconButton,
  Typography,

  FormHelperText,
} from "@mui/material";
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import * as DataApi from "../../../../api/apiService/dataService";
import validateForm from "../../../../component/validation";

const animatedComponents = makeAnimated();

const initFormData = {
  id: "",
  title: "",
  description: "",
  price: "",
  thumbnail: "",
  video: "",
  date: "",
  sections: [],
  categories: [],
};

function EditCourse() {
  const [formData, setFormData] = useState(initFormData);
  const [options, setOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  let timerId;

  //! NOTE: ============================ HANDLE FUNCTIONS ===================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e, lessonIndex, sectionIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    toast.promise(DataApi.uploadImg(file), {
      loading: "Uploading file...",
      success: (result) => {
        setIsLoading(false);
        if (file.type === "video/mp4") {
          const updatedSections = [...formData.sections];
          const updatedLessons = [...updatedSections[sectionIndex].lessons];
          updatedLessons[lessonIndex] = {
            ...updatedLessons[lessonIndex],
            video: result.content,
          };
          updatedSections[sectionIndex].lessons = updatedLessons;
          setFormData({
            ...formData,
            sections: updatedSections,
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
        console.error(error);
        setIsLoading(false);
        return "File upload failed.";
      },
    });
    e.target.value = "";
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleUpdateVideoCourse = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    toast.promise(DataApi.uploadImg(file), {
      loading: "Uploading video...",
      success: (result) => {
        setIsLoading(false);
        setFormData((prev) => ({
          ...prev,
          video: result.content,
        }));
        return "Video uploaded successfully!";
      },
      error: (error) => {
        console.error(error);
        setIsLoading(false);
        return "Video upload failed.";
      },
    });
    e.target.value = "";
  };

  const handleSelectChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      categories: selectedOptions,
      isEditedCategories: 1,
    }));
    setErrors((prev) => ({ ...prev, categories: "" }));
  };

  const handleRemoveItemPreview = (type, lessonIndex, sectionIndex) => {
    if (type === "video") {
      const updatedSections = [...formData.sections];
      const updatedLessons = [...updatedSections[sectionIndex].lessons];
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        video: "",
      };
      updatedSections[sectionIndex].lessons = updatedLessons;
      setFormData({
        ...formData,
        sections: updatedSections,
      });
    } else if (type === "thumbnail") {
      setFormData((prev) => ({
        ...prev,
        thumbnail: "",
      }));
    }
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

  const handleInputLessonChange = (e, lessonIndex, sectionIndex) => {
    const { name, value } = e.target;
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons[lessonIndex] = {
      ...updatedSections[sectionIndex].lessons[lessonIndex],
      [name]: value,
      isEdited: 1,
    };
    setFormData({
      ...formData,
      sections: updatedSections,
    });
    setErrors((prev) => ({
      ...prev,
      [`lesson-${sectionIndex}-${lessonIndex}-${name}`]: "",
    }));
  };

  const handleCreateSection = () => {
    const newSection = {
      title: "",
      lessons: [],
    };
    setFormData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const handleInputSectionChange = (e, sectionIndex) => {
    const { value } = e.target;
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].title = value;
    updatedSections[sectionIndex].isEdited = 1;
    setFormData({
      ...formData,
      sections: updatedSections,
    });
    setErrors((prev) => ({ ...prev, [`section-${sectionIndex}`]: "" }));
  };

  const handleRemoveSection = (sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections.splice(sectionIndex, 1);
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const handleRemoveLesson = (lessonIndex, sectionIndex) => {
    const updatedSections = [...formData.sections];
    updatedSections[sectionIndex].lessons.splice(lessonIndex, 1);
    setFormData({
      ...formData,
      sections: updatedSections,
    });
  };

  const handleRemoveVideoCourse = () => {
    setFormData((prev) => ({
      ...prev,
      video: "",
    }));
  };

  //! NOTE: ======================== SUBMIT FUNCTION ========================

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) {
      toast.error("Please wait for the file to finish uploading.");
      return;
    }
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const fetchApi = async () => {
      try {
        const newCategories = formData.categories.map((cate) => cate.id);
        const updatedCourse = {
          ...formData,
          categories: newCategories,
        };
        await toast.promise(DataApi.updateCourse(id, updatedCourse), {
          loading: "Updating course...",
          success: "Course updated successfully!",
          error: "Failed to update course.",
        });
      } catch (error) {
        console.error("Error updating course:", error);
        toast.error("Failed to update course. Please try again.");
      }
    };

    const debounceApi = debounce(fetchApi, 600);
    debounceApi();
  };

  const debounce = (func, delay = 600) => {
    return () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func();
      }, delay);
    };
  };

  //! NOTE: =========================== FETCH DATA ====================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResult = await DataApi.getAllCategories();
        setOptions(categoriesResult.content.content);
        const courseResult = await DataApi.getCourseById(id);
        setFormData(courseResult.content);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch course data.");
      }
    };
    fetchData();
  }, [id]);

  //! NOTE: =========================== RENDER COMPONENT =============================

  return (
    <div className="flex justify-center w-full p-4">
      <div className="w-full max-w-5xl">
        <h3 className="text-2xl font-semibold mb-6 text-center">Edit Course</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Course Title */}
            <div>
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
            </div>

            {/* Description */}
            <div>
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
            </div>

            {/* Categories and Price */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              {/* Categories */}
              <div className="flex-1">
                <label className="block mb-2 font-medium text-gray-700">
                  Categories
                </label>
                <Select
                  isMulti
                  components={animatedComponents}
                  value={formData.categories}
                  onChange={handleSelectChange}
                  options={options}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.id}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select Categories"
                />
                {errors.categories && (
                  <FormHelperText error>{errors.categories}</FormHelperText>
                )}
              </div>

              {/* Price */}
              <div className="flex-1">
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
              </div>
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              {/* Upload Thumbnail */}
              <div className="flex-1">
                <label className="block mb-2 font-medium text-gray-700">
                  Thumbnail
                </label>
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
                  <FormHelperText error>{errors.thumbnail}</FormHelperText>
                )}
              </div>

              {/* Thumbnail Preview */}
              {formData.thumbnail && (
                <div className="flex-1 flex items-center justify-center w-full h-ful">
                  <div className="relative w-full h-full">
                  <IconButton
                      size="small"
                      className="absolute top-0 right-0 bg-white bg-opacity-75 hover:bg-opacity-100"
                      onClick={() => handleRemoveItemPreview("thumbnail")}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <img
                      src={formData.thumbnail}
                      alt="Thumbnail Preview"
                      className="object-cover w-full h-full rounded"
                    />
                   
                  </div>
                </div>
              )}
            </div>

            {/* Video */}
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
              {/* Upload Video */}
              <div className="flex-1">
                <label className="block mb-2 font-medium text-gray-700">
                  Video
                </label>
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
              </div>

              {/* Video Preview */}
              {formData.video && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-full h-full">
                  <IconButton
                      size="small"
                      className="absolute top-0 right-0 bg-white bg-opacity-75 hover:bg-opacity-100"
                      onClick={handleRemoveVideoCourse}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                    <video
                      src={formData.video}
                      controls
                      className="object-cover w-full h-full rounded"
                    />
                   
                  </div>
                </div>
              )}
            </div>

            {/* Curriculum */}
            <div className="space-y-6 mt-5">
              <div>
                <Typography variant="h5" className="text-center mb-4">
                  Curriculum
                </Typography>
                {formData.sections.map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className="p-4 border rounded-lg shadow-md space-y-4"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between">
                      <Typography variant="h6">
                        Section {sectionIndex + 1}
                      </Typography>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleRemoveSection(sectionIndex)}
                      >
                        Remove Section
                      </Button>
                    </div>

                    {/* Section Name */}
                    <div>
                      <TextField
                        fullWidth
                        label="Section Name"
                        name="title"
                        value={section.title}
                        onChange={(e) =>
                          handleInputSectionChange(e, sectionIndex)
                        }
                        error={!!errors[`section-${sectionIndex}`]}
                        helperText={errors[`section-${sectionIndex}`]}
                        required
                      />
                    </div>

                    {/* Lessons */}
                    <div className="space-y-4">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lessonIndex}
                          className="p-4 border rounded-lg shadow-sm space-y-4"
                        >
                          {/* Lesson Header */}
                          <div className="flex items-center justify-between">
                            <Typography variant="subtitle1">
                              Lesson {lessonIndex + 1}
                            </Typography>
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() =>
                                handleRemoveLesson(lessonIndex, sectionIndex)
                              }
                            >
                              Remove Lesson
                            </Button>
                          </div>

                          {/* Lesson Name */}
                          <div>
                            <TextField
                              fullWidth
                              label="Lesson Name"
                              name="title"
                              value={lesson.title}
                              onChange={(e) =>
                                handleInputLessonChange(
                                  e,
                                  lessonIndex,
                                  sectionIndex
                                )
                              }
                              error={
                                !!errors[
                                  `lesson-title-${sectionIndex}-${lessonIndex}`
                                ]
                              }
                              helperText={
                                errors[
                                  `lesson-title-${sectionIndex}-${lessonIndex}`
                                ]
                              }
                              required
                            />
                          </div>

                          {/* Lesson Description */}
                          <div>
                            <TextField
                              fullWidth
                              label="Description"
                              name="description"
                              value={lesson.description}
                              onChange={(e) =>
                                handleInputLessonChange(
                                  e,
                                  lessonIndex,
                                  sectionIndex
                                )
                              }
                              error={
                                !!errors[
                                  `lesson-description-${sectionIndex}-${lessonIndex}`
                                ]
                              }
                              helperText={
                                errors[
                                  `lesson-description-${sectionIndex}-${lessonIndex}`
                                ]
                              }
                              required
                              multiline
                              rows={3}
                            />
                          </div>

                          {/* Lesson Video */}
                          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                            {/* Upload Lesson Video */}
                            <div className="flex-1">
                              <label className="block mb-2 font-medium text-gray-700">
                                Video
                              </label>
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
                                  onChange={(e) =>
                                    handleFileChange(e, lessonIndex, sectionIndex)
                                  }
                                  name="video"
                                />
                              </Button>
                            </div>

                            {/* Lesson Video Preview */}
                            {lesson.video && (
                              <div className="flex-1 flex items-center justify-center">
                                <div className="relative w-full h-full">
                                <IconButton
                                    size="small"
                                    className="absolute top-0 right-0 bg-white bg-opacity-75 hover:bg-opacity-100"
                                    onClick={() =>
                                      handleRemoveItemPreview(
                                        "video",
                                        lessonIndex,
                                        sectionIndex
                                      )
                                    }
                                  >
                                    <CloseIcon fontSize="small" />
                                  </IconButton>
                                  <video
                                    src={lesson.video}
                                    controls
                                    className="object-cover w-full h-full rounded"
                                  />
                                 
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Link Video */}
                        
                        </div>
                      ))}
                    </div>

                    {/* Add Lesson Button */}
                    <div>
                      <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => handleAddLesson(sectionIndex)}
                      >
                        Add Lesson
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Section Button */}
                <div className="mt-2">
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={handleCreateSection}
                  >
                    Add Section
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                disabled={isLoading}
                className="w-1/3"
              >
                Update Course
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCourse;
