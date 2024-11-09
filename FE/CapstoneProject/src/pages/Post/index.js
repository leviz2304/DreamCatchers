import { Link } from "react-router-dom";
import styles from "./Post.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import * as dataApi from "../../api/apiService/dataService";
import avatar from "../../assets/images/avatar_25.jpg";

const PostItem = () => {
    return (
        <div className="boxShadow rounded-lg border-solid border border-gray-400">
            <div className={clsx("px-3 py-3")}>
                <div className={clsx("flex justify-between")}>
                    <div className="flex">
                        <img
                            loading="lazy"
                            className="mr-3 w-9 h-9 rounded-full"
                            src={avatar}
                            alt="Avatar"
                        />
                        <span className="text-sm font-semibold self-center">
                            Nguyen Thanh
                        </span>
                    </div>
                    <div className="cursor-pointer hover:opacity-80">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="flex">
                    <div className="pr-4 flex-1">
                        <div className={clsx("mt-2.5 flex justify-between ")}>
                            <div>
                                <span className="font-bold text-lg line-clamp-3">
                                    Config Zsh with ubuntuConfig Zsh with
                                    ubuntuConfig Zsh withConfig Zsh with
                                    ubuntuConfig Zsh with ubuntuConfig Zsh
                                </span>
                                <span className="text-sm mt-2 font-light line-clamp-2">
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Minus soluta quas
                                    blanditiis, rem modi doloremque nam
                                    asperiores veniam eius harum culpa ea vel
                                    laboriosam quaerat! Vel obcaecati rem
                                    blanditiis voluptatum?
                                </span>
                            </div>
                        </div>
                        <div className={clsx("pt-2.5")}>
                            <div
                                className={clsx(
                                    styles.sub,
                                    "text-xs flex items-center gap-2"
                                )}
                            >
                                <span className="bg-gray-200 rounded-xl px-2 py-1 font-medium ">
                                    Ubuntu
                                </span>
                                <span className="font-medium">
                                    {" "}
                                    1 month ago
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="max-h-32 w-52">
                        <img
                            className="w-full h-full block rounded-lg object-cover"
                            src="https://files.fullstack.edu.vn/f8-prod/blog_posts/10266/6628ed851ef83.png"
                            alt="post thumbnail"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

function Post() {
    const [page, setPaeg] = useState(0);
    const [size, setSize] = useState(5);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getPosts(page, size);
                console.log(result);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [size, page]);
    return (
        <div className="flex flex-wrap gap-5 mx-auto max-w-screen-xl text-start mt-10">
            <div className="container">
                <div className="flex justify-between items-center">
                    <h1 className={clsx("uppercase font-bold text-3xl")}>
                        featured article
                    </h1>
                    <Link
                        to={"/me/post/create"}
                        className="hover:opacity-80 px-3 py-3 rounded-lg bg-black text-white cursor-pointer"
                    >
                        Create post
                    </Link>
                </div>
                <span>
                    Collection of articles sharing experiences of self-learning
                    online programming and web programming techniques.
                </span>
                <div className="wrap">
                    <div className={clsx("mt-8")}>
                        <PostItem></PostItem>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
