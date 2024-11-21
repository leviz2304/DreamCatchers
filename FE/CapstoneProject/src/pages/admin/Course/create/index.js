import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./CreateCourse.module.scss";
import clsx from "clsx";
import fileSelect from "../../../../assets/images/fileSelect.svg";
import { useEffect, useState } from "react";
import Select from "react-select";
import * as DataApi from "../../../../api/apiService/dataService";
import { toast } from "sonner";
import btnClose from "../../../../assets/images/btnClose.svg";

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
    instructor: "", // Add this if BE requires it
};

function CreateCourse() {
    const [formData, setFormData] = useState(initFormData);
    const [options, setOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // Store current user info

    let timerId;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        errors[name] = "";
        setErrors(errors);
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const fetchInstructorEmail = () => {
        const user = sessionStorage.getItem("user");
        if (user) {
            const parsedUser = JSON.parse(user);
            return parsedUser.email || ""; // Default to an empty string if email is not found
        }
        return "";
    };

    useEffect(() => {
        // Set instructor email on component mount
        const instructorEmail = fetchInstructorEmail();
        if (instructorEmail) {
            setFormData((prev) => ({ ...prev, instructor: instructorEmail }));
        } else {
            toast.error("Failed to fetch instructor email from sessionStorage.");
        }
    }, []);

    const handleFileChange = (e, index, indexSection) => {
        const file = e.target.files[0];
        setIsUploading(true);
        toast.promise(DataApi.uploadImg(file), {
            loading: "Loading file...",
            success: (result) => {
                setIsUploading(false);
                if (file.type === "video/mp4") {
                    const updateSection = {
                        ...formData.sections[indexSection],
                    };
                    updateSection.lessons[index] = {
                        ...updateSection.lessons[index],
                        video: result.content,
                    };
                    const updateSections = [...formData.sections];
                    updateSections[indexSection] = updateSection;

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
                return "Uploading successfully...";
            },
            error: (error) => {
                console.log(error);
                return "Upload thumbnail failed";
            },
        });
        e.target.value = "";
        errors[e.target.name] = "";
        setErrors(errors);
    };

    const handleSelectChange = (e) => {
        setFormData({
            ...formData,
            categories: [...e], // Ensure it maps to BE-required format
            isEditedCategories: true, // For BE validation
        });
    };

    const handleUpdateVideoCourse = (e) => {
        setIsUploading((prev) => true);
        toast.promise(DataApi.uploadImg(e.target.files[0]), {
            loading: "Loading video...",
            success: (result) => {
                setIsUploading((prev) => false);
                setFormData((prev) => {
                    return { ...prev, video: result.content };
                });
                return "Upload video successfully";
            },
            error: (error) => {
                console.log(error);
                return "Upload video failed";
            },
        });
    };

    const handleRemoveItemPrevivew = (e, type, index, sectionIndex) => {
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
        } else setFormData({ ...formData, thumbnail: "" });
        e.target.value = "";
    };

    const handleInputLessonChange = (e, index, sectionIndex) => {
        const { name, value } = e.target;
        const updateSection = { ...formData.sections[sectionIndex] };
        const updateSections = [...formData.sections];
        updateSection.lessons[index] = {
            ...updateSection.lessons[index],
            [name]: value,
        };
        updateSections[sectionIndex] = { ...updateSection };

        errors[name] = "";
        setErrors(errors);

        setFormData({
            ...formData,
            sections: [...updateSections],
        });
    };

    const handleRemoveLesson = (index, sectionId) => {
        var newSection = { ...formData.sections[sectionId] };
        newSection.lessons.splice(index, 1);
        var newSections = [...formData.sections];

        newSections[sectionId] = newSections;
        setFormData({ ...formData, sections: newSections });
    };

    const handleAddLesson = (sectionIndex) => {
        let lesson = {
            title: "",
            description: "",
            video: "",
            linkVideo: "",
        };
        const updateSection = { ...formData.sections[sectionIndex] };
        updateSection.lessons.push(lesson);
        const updateSections = [...formData.sections];
        updateSections[sectionIndex] = updateSection;

        setFormData({
            ...formData,
            sections: [...updateSections],
        });
    };

    const handleInputSectionChange = (e, sectionIndex) => {
        const updatedSection = {
            ...formData.sections[sectionIndex],
            title: e.target.value,
            isEdited: true, // Ensure BE knows this is updated
        };
        const updatedSections = [...formData.sections];
        updatedSections[sectionIndex] = updatedSection;
    
        setFormData({ ...formData, sections: updatedSections });
    };

    const handleRemoveSection = (index) => {
        const updateSections = [...formData.sections];
        updateSections.splice(index, 1);
        setFormData({ ...formData, sections: [...updateSections] });
    };

    const debounce = (func, delay = 600) => {
        return () => {
            clearTimeout(timerId);

            timerId = setTimeout(() => {
                func();
            }, delay);
        };
    };

    const handleCreateSection = () => {
        const newSection = {
            title: "",
            lessons: [],
        };

        const newSections = [...formData.sections];
        newSections.push(newSection);
        setFormData({ ...formData, sections: [...newSections] });
    };

    const handleRemoveVideoCourse = (e) => {
        setFormData({ ...formData, video: null });
    };

    const validateForm = (formData) => {
        const errors = {};
        if (!formData.title) errors.title = "Course Name is required.";
        if (!formData.description)
            errors.description = "Description is required.";
        if (!formData.price) errors.price = "Price is required.";
        if (!formData.thumbnail) errors.thumbnail = "Thumbnail is required.";
        if (formData.categories.length === 0)
            errors.categories = "At least one category is required.";
        if (formData.section)
            formData.sections.forEach((section, sectionIndex) => {
                if (!section.title)
                    errors[`section-${sectionIndex}`] = `Section ${
                        sectionIndex + 1
                    } Name is required.`;
                section.lessons.forEach((lesson, lessonIndex) => {
                    if (!lesson.title)
                        errors[
                            `lesson-${sectionIndex}-${lessonIndex}`
                        ] = `Lesson ${
                            lessonIndex + 1
                        } Name is required in Section ${sectionIndex + 1}.`;
                    if (!lesson.description)
                        errors[
                            `lesson-desc-${sectionIndex}-${lessonIndex}`
                        ] = `Lesson ${
                            lessonIndex + 1
                        } Description is required in Section ${
                            sectionIndex + 1
                        }.`;
                });
            });

        return errors;
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
            toast.error("You need to fill in the empty fields.");
            return;
        }
    
        // Prepare and sanitize the payload
        const preparePayload = () => ({
            title: formData.title,
            description: formData.description,
            price: Number(formData.price) || 0, // Ensure price is a number
            discount: Number(formData.discount) || 0, // Ensure discount is a number
            thumbnail: formData.thumbnail,
            video: formData.video,
            categories: formData.categories.map((cate) => Number(cate.id)), // Ensure categories are numeric IDs
            instructor: formData.instructor, // Email of the instructor
            sections: formData.sections.map((section) => ({
                title: section.title,
                lessons: section.lessons.map((lesson) => ({
                    title: lesson.title,
                    description: lesson.description,
                    video: lesson.video || "", // Default to empty string
                    linkVideo: lesson.linkVideo || "", // Default to empty string
                })),
            })),
            date: formData.date || null, // Optional date field
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
    
    
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await DataApi.getAllCategories(0, 99999999);
                setOptions(result.content.content);
            } catch (error) {
                console.log(error.mess);
            }
        };
        fetchApi();
    }, []);

    console.log("render");
    return (
        <>
            <div className="container flex flex-col justify-center">
                <div className="wrapMainDash mr-auto">
                    <h3 className="titleMainDash">Create a new course</h3>
                    <div
                        className={clsx(
                            styles.formGroup,
                            "flex gap-6 flex-col rounded-lg"
                        )}
                    >
                        <div className={clsx(styles.formField)}>
                            <input
                                required
                                onChange={handleInputChange}
                                value={formData.title}
                                name="title"
                                data-validate
                                className={clsx(styles.formInput)}
                                type="text"
                            />
                            <label className={clsx(styles.formLabel)}>
                                Course Name
                            </label>
                            {errors.title && (
                                <div className="text-red-500 mt-1 text-sm ml-1">
                                    {errors.title}
                                </div>
                            )}
                        </div>
                        <div className={clsx(styles.formField)}>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={clsx(styles.formInput, "h-22")}
                                type="text"
                            />
                            <label
                                className={clsx(
                                    styles.formLabel,
                                    styles.descInput
                                )}
                            >
                                Description
                            </label>
                            {errors.description && (
                                <div className="text-red-500 mt-1 text-sm ml-1">
                                    {errors.description}
                                </div>
                            )}
                        </div>
                        <div className={clsx("flex")}>
                            <div
                                className={clsx(styles.formField, "w-1/2 mr-9")}
                            >
                                <Select
                                    isMulti
                                    onChange={handleSelectChange}
                                    value={formData.categories}
                                    getOptionLabel={(x) => x.name}
                                    getOptionValue={(x) => x.id}
                                    options={options}
                                    name="categories"
                                    styles={{
                                        control: (baseStyles, state) => ({
                                            ...baseStyles,
                                            borderColor: state.isFocused
                                                ? "black"
                                                : "#e9ecee",
                                        }),
                                    }}
                                />
                                <label className={clsx(styles.formLabel)}>
                                    Category
                                </label>
                                {errors.categories && (
                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                        {errors.categories}
                                    </div>
                                )}
                            </div>
                            <div className={clsx(styles.formField, "w-1/2")}>
                                <input
                                    name="price"
                                    onChange={handleInputChange}
                                    value={formData.price}
                                    min="0"
                                    className={clsx(styles.formInput)}
                                    type="number"
                                />
                                <label className={clsx(styles.formLabel)}>
                                    Price
                                </label>
                                {errors.price && (
                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                        {errors.price}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex overflow-hidden">
                            <div
                                className={clsx(
                                    styles.formField,
                                    "w-1/2 overflow-hidden"
                                )}
                            >
                                <span className={clsx(styles.formLabel2)}>
                                    Thumbnail
                                </span>
                                <label
                                    htmlFor="thumbnail"
                                    className={clsx(
                                        styles.formLabel2,
                                        styles.labelFile
                                    )}
                                >
                                    <div className={clsx(styles.iconFile)}>
                                        <img src={fileSelect} alt="" />
                                    </div>
                                </label>
                                {errors.thumbnail && (
                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                        {errors.thumbnail}
                                    </div>
                                )}
                                <input
                                    name="thumbnail"
                                    onChange={handleFileChange}
                                    id="thumbnail"
                                    type="file"
                                    hidden
                                    accept=".jpg, .jpeg, .png"
                                />
                            </div>
                            <div
                                className={clsx(
                                    styles.formField,
                                    "w-1/2 mt-8 ml-9"
                                )}
                            >
                                {formData.thumbnail && (
                                    <div className={clsx(styles.imgField)}>
                                        <img
                                            className={clsx(
                                                styles.thumbnailImg
                                            )}
                                            src={formData.thumbnail}
                                            alt=""
                                        />
                                        <button
                                            onClick={(e) =>
                                                handleRemoveItemPrevivew(e)
                                            }
                                            className={clsx(
                                                styles.btnClosePreview
                                            )}
                                        >
                                            <img src={btnClose} alt="" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex  overflow-hidden">
                            <div
                                className={clsx(
                                    styles.formField,
                                    "w-1/2 overflow-hidden"
                                )}
                            >
                                <span className={clsx(styles.formLabel2)}>
                                    Video
                                </span>
                                <label
                                    htmlFor={`courseVideo`}
                                    className={clsx(
                                        styles.formLabel2,
                                        styles.labelFile,
                                        "h-full"
                                    )}
                                >
                                    <div className={clsx(styles.iconFile)}>
                                        <img src={fileSelect} alt="" />
                                    </div>
                                </label>
                                <input
                                    name="video"
                                    onChange={handleUpdateVideoCourse}
                                    id={`courseVideo`}
                                    type="file"
                                    hidden
                                    accept=".mp4"
                                />
                            </div>
                            <div
                                className={clsx(
                                    styles.formField,
                                    "w-1/2 mt-8 ml-9"
                                )}
                            >
                                {formData.video && (
                                    <div className={clsx(styles.videoField)}>
                                        <video
                                            id="video"
                                            controls
                                            className="rounded-lg"
                                        >
                                            <source
                                                src={formData.video}
                                                type="video/mp4"
                                            />
                                        </video>
                                        <button
                                            className={clsx(
                                                styles.btnClosePreview
                                            )}
                                            onClick={(e) =>
                                                handleRemoveVideoCourse(e)
                                            }
                                        >
                                            {" "}
                                            <img src={btnClose} alt="" />{" "}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/*NOTE Lesson */}
                        <h5 className="text-center font-semibold text-3xl mt-12">
                            Curriculum
                        </h5>

                        <div className={clsx(styles.lessonArea)}>
                            {formData.sections &&
                                formData.sections.map(
                                    (section, sectionIndex) => {
                                        const lessons = section.lessons;
                                        return (
                                            <div
                                                className={clsx(
                                                    "mt-1 flex flex-col"
                                                )}
                                                key={sectionIndex}
                                            >
                                                <div
                                                    className={clsx(
                                                        styles.sectionName,
                                                        "text-center  font-semibold"
                                                    )}
                                                >
                                                    Section {sectionIndex + 1}
                                                </div>
                                                <div
                                                    className="justify-end px-3 py-1.5 text-sm cursor-pointer font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-end"
                                                    onClick={() => {
                                                        handleRemoveSection(
                                                            sectionIndex
                                                        );
                                                    }}
                                                >
                                                    {" "}
                                                    Remove section
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.formField,
                                                        "mt-4"
                                                    )}
                                                >
                                                    <input
                                                        data-section="1"
                                                        name={`title`}
                                                        onChange={(e) => {
                                                            handleInputSectionChange(
                                                                e,
                                                                sectionIndex
                                                            );
                                                        }}
                                                        value={section.title}
                                                        className={clsx(
                                                            styles.formInput
                                                        )}
                                                        type="text"
                                                    />
                                                    <label
                                                        className={clsx(
                                                            styles.formLabel
                                                        )}
                                                    >
                                                        Section Name
                                                    </label>
                                                </div>
                                                {lessons &&
                                                    lessons.map(
                                                        (lesson, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={clsx(
                                                                        styles.lessonField,
                                                                        "gap-6 flex flex-col mt-4"
                                                                    )}
                                                                >
                                                                    <div
                                                                        className={clsx(
                                                                            styles.formField,
                                                                            "flex justify-between"
                                                                        )}
                                                                    >
                                                                        <div className="self-center  font-semibold">
                                                                            Lesson{" "}
                                                                            {index +
                                                                                1}
                                                                        </div>

                                                                        <div
                                                                            className="justify-center px-3 py-1.5 text-sm cursor-pointer font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-center"
                                                                            onClick={() => {
                                                                                handleRemoveLesson(
                                                                                    index,
                                                                                    sectionIndex
                                                                                );
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            Remove
                                                                            lesson
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={clsx(
                                                                            styles.formField
                                                                        )}
                                                                    >
                                                                        <input
                                                                            data-section="1"
                                                                            name={`title`}
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                handleInputLessonChange(
                                                                                    e,
                                                                                    index,
                                                                                    sectionIndex
                                                                                );
                                                                            }}
                                                                            value={
                                                                                lesson.title
                                                                            }
                                                                            className={clsx(
                                                                                styles.formInput
                                                                            )}
                                                                            type="text"
                                                                        />
                                                                        <label
                                                                            className={clsx(
                                                                                styles.formLabel
                                                                            )}
                                                                        >
                                                                            Lesson
                                                                            Name
                                                                        </label>
                                                                    </div>
                                                                    <div
                                                                        className={clsx(
                                                                            styles.formField
                                                                        )}
                                                                    >
                                                                        <textarea
                                                                            name="description"
                                                                            value={
                                                                                lesson.description
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                handleInputLessonChange(
                                                                                    e,
                                                                                    index,
                                                                                    sectionIndex
                                                                                );
                                                                            }}
                                                                            className={clsx(
                                                                                styles.formInput,
                                                                                "h-22"
                                                                            )}
                                                                            type="text"
                                                                        />
                                                                        <label
                                                                            className={clsx(
                                                                                styles.formLabel,
                                                                                styles.descInput
                                                                            )}
                                                                        >
                                                                            Description
                                                                        </label>
                                                                    </div>
                                                                    <div className="flex">
                                                                        <div
                                                                            className={clsx(
                                                                                styles.formField,
                                                                                "w-1/2"
                                                                            )}
                                                                        >
                                                                            <span
                                                                                className={clsx(
                                                                                    styles.formLabel2
                                                                                )}
                                                                            >
                                                                                Video
                                                                            </span>
                                                                            <label
                                                                                htmlFor={`video${section.title}${index}`}
                                                                                className={clsx(
                                                                                    styles.formLabel2,
                                                                                    styles.labelFile
                                                                                )}
                                                                            >
                                                                                <div
                                                                                    className={clsx(
                                                                                        styles.iconFile
                                                                                    )}
                                                                                >
                                                                                    <img
                                                                                        src={
                                                                                            fileSelect
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </div>
                                                                            </label>
                                                                            <input
                                                                                name="video"
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    handleFileChange(
                                                                                        e,
                                                                                        index,
                                                                                        sectionIndex
                                                                                    );
                                                                                }}
                                                                                id={`video${section.title}${index}`}
                                                                                type="file"
                                                                                hidden
                                                                                accept=".mp4"
                                                                            />
                                                                        </div>
                                                                        <div
                                                                            className={clsx(
                                                                                styles.formField,
                                                                                "w-1/2 mt-8 ml-9"
                                                                            )}
                                                                        >
                                                                            {lesson.video && (
                                                                                <div
                                                                                    className={clsx(
                                                                                        styles.videoField
                                                                                    )}
                                                                                >
                                                                                    <video
                                                                                        id="video"
                                                                                        controls
                                                                                        className="rounded-lg"
                                                                                    >
                                                                                        <source
                                                                                            src={
                                                                                                lesson.video
                                                                                            }
                                                                                            type="video/mp4"
                                                                                        />
                                                                                    </video>
                                                                                    <button
                                                                                        className={clsx(
                                                                                            styles.btnClosePreview
                                                                                        )}
                                                                                        onClick={(
                                                                                            e
                                                                                        ) =>
                                                                                            handleRemoveItemPrevivew(
                                                                                                e,
                                                                                                "video",
                                                                                                index,
                                                                                                sectionIndex
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        {" "}
                                                                                        <img
                                                                                            src={
                                                                                                btnClose
                                                                                            }
                                                                                            alt=""
                                                                                        />{" "}
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={clsx(
                                                                            styles.formField
                                                                        )}
                                                                    >
                                                                        <input
                                                                            name="linkVideo"
                                                                            value={
                                                                                lesson.linkVideo
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                handleInputLessonChange(
                                                                                    e,
                                                                                    index,
                                                                                    sectionIndex
                                                                                );
                                                                            }}
                                                                            className={clsx(
                                                                                styles.formInput
                                                                            )}
                                                                            type="text"
                                                                        />
                                                                        <label
                                                                            className={clsx(
                                                                                styles.formLabel
                                                                            )}
                                                                        >
                                                                            Link
                                                                            Video
                                                                        </label>
                                                                    </div>

                                                                    {/* <div
                                                                        className={clsx(
                                                                            styles.formField
                                                                        )}
                                                                    >
                                                                        <input
                                                                            name="duration"
                                                                            value={
                                                                                lesson.duration
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                handleInputLessonChange(
                                                                                    e,
                                                                                    index,
                                                                                    sectionIndex
                                                                                );
                                                                            }}
                                                                            className={clsx(
                                                                                styles.formInput
                                                                            )}
                                                                            type="time"
                                                                        />
                                                                        <label
                                                                            className={clsx(
                                                                                styles.formLabel
                                                                            )}
                                                                        >
                                                                            Duration
                                                                        </label>
                                                                    </div> */}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                <button
                                                    type="submit"
                                                    className="justify-start px-1 py-2 mt-4 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/5 w-1/5 self-start"
                                                    onClick={() =>
                                                        handleAddLesson(
                                                            sectionIndex
                                                        )
                                                    }
                                                >
                                                    Add Lesson
                                                </button>
                                            </div>
                                        );
                                    }
                                )}
                        </div>
                        <button
                            type="submit"
                            className="justify-center px-5 py-2.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-1/3 w-1/3 self-center"
                            onClick={handleCreateSection}
                        >
                            Create Section
                        </button>

                        <button
                            type="submit"
                            className="justify-center px-5 py-3.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-full w-full"
                            onClick={handleSubmit}
                        >
                            Create Course
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateCourse;
