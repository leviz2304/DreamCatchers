import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import styles from "./CreatePost.module.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";
import ImageUploader from "quill-image-uploader";
import { Quill } from "react-quill/lib";
import { toast } from "sonner";
import * as dataApi from "../../../api/apiService/dataService";
import * as userApi from "../../../api/apiService/authService";
import { legacy_createStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const init = {
    title: "",
    content: "",
};

const handleUpload = (file) => {
    if (!file) {
        return;
    }
    const fetchApi = async () => {
        try {
            const result = await dataApi.uploadImg(file);
            return result.content;
        } catch (error) {
            console.log(error);
        }
    };

    return fetchApi();
};

Quill.register("modules/imageUploader", ImageUploader);
function CreatePost() {
    const [post, setPost] = useState(init);
    const user = useSelector((state) => state.login.user);
    const handleChangeQuill = (content, delta, source, editor) =>
        setPost({ ...post, content: content });

    // const handleCreatePost = () => {
    //     toast.promise(userApi.createPost({ ...post, email: user.email }), {
    //         loading: "loading...",
    //         success: (result) => {
    //             return result.mess;
    //         },
    //         error: (error) => {
    //             console.log(error);
    //             return error.mess;
    //         },
    //     });
    // };

    return (
        <div className="container mt-10">
            <div className="wrap">
                <h1 className="font-bold text-3xl uppercase ">Create Post</h1>
                <div className={clsx(styles.wrap, "mt-10")}>
                    <form>
                        <div className={clsx(styles.formField, "text-xl ")}>
                            <textarea
                                required
                                value={post.title}
                                onChange={(e) =>
                                    setPost({
                                        ...post,
                                        title: e.target.value,
                                    })
                                }
                                name="title"
                                className={clsx(styles.formInput)}
                                placeholder="Enter a title..."
                                type="text"
                            />
                            <label className={clsx(styles.formLabel)}>
                                Title
                            </label>
                        </div>
                        <div className="mt-6">
                            <ReactQuill
                                theme="snow"
                                value={post.content || ""}
                                onChange={(content, delta, source, editor) => {
                                    handleChangeQuill(
                                        content,
                                        delta,
                                        source,
                                        editor
                                    );
                                }}
                                modules={toolbar}
                                formats={formats}
                            ></ReactQuill>
                        </div>
                    </form>
                </div>

                <Link
                    to={"/me/post/create/sub"}
                    className="cursor-pointer hover:opacity-80z w-auto rounded-lg inline-block float-end mt-4 px-4 py-2 text-white bg-black font-semibold text-base"
                >
                    Publish
                </Link>
            </div>
        </div>
    );
}

export default CreatePost;

const toolbar = {
    toolbar: {
        container: [
            [{ header: "1" }, { header: "2" }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
        ],
        // handlers: {
        //     image: imageHandler,
        // },
    },
    imageUploader: {
        upload: handleUpload,
    },
    clipboard: {
        matchVisual: false,
    },
};

const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "imageBlot",
];
