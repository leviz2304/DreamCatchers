import React, { useState, useEffect, useRef } from "react";
import searchIcon from "../../assets/images/search.png";
import loadingIcon from "../../assets/images/loading.png";
import * as dataApi from "../../api/apiService/dataService";
import clsx from "clsx";
import styles from "./Search.module.scss";
let timerId = null;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const searchBarRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef();

    // API fetch function
    const fetchApi = async (title) => {
        try {
            const result = await dataApi.getCourseByName(title);
            setLoading(false);
            setShowResult(true);
            setSearchResult(result.content.content);
        } catch (error) {
            console.log(error);
        }
    };

    // Debounce function
    const debounce = (func, delay = 800) => {
        return (title) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func(title);
            }, delay);
        };
    };

    const fetchApiRequest = debounce(fetchApi, 500);

    const handleSearch = (event) => {
        const title = event.target.value;

        setSearchTerm(title);
        setLoading(true);
        if (title.trim() === "") {
            setSearchResult([]);
            setShowResult(false);
            clearTimeout(timerId);
            return;
        }
        fetchApiRequest(title);
    };

    // Handle clicking outside of search bar to close results
    const handleClickOutside = (event) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
            setShowResult(false);
        }
    };

    // Clear the search input
    const clearSearch = () => {
        setSearchTerm("");
        inputRef.current.focus();
        setSearchResult([]);
        setShowResult(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={clsx(
                styles.searchWrap,
                "relative flex items-center bg-white border border-gray-300 w-80 hover:border-black transition-all duration-200"
            )}
            ref={searchBarRef}
        >
            <div className="flex w-full items-center pl-4 pr-2 py-2">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-grow text-sm pl-2 pr-4 text-gray-700 leading-tight focus:outline-none"
                    placeholder="What do you want learn..."
                    onClick={() => searchResult.length > 0 && setShowResult(true)}
                    style={{ borderRadius: "0px" }} // Loại bỏ bo tròn
                />
                <div className="flex items-center">
                    {loading && searchTerm !== "" && (
                        <img
                            src={loadingIcon}
                            alt="Loading"
                            className="w-4 h-4 animate-spin mr-2"
                        />
                    )}
                    {searchTerm.length > 0 && !loading && (
                        <button onClick={clearSearch} className="mr-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="#a6a7ac"
                                className="w-5 h-5 hover:opacity-80"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    )}
                    <button className="px-2">
                        <img
                            src={searchIcon}
                            alt="Search"
                            className="w-4 h-4"
                        />
                    </button>
                </div>
            </div>

            {showResult && (
                <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 shadow-lg z-20">
                    {searchResult.length > 0 ? (
                        <div>
                            {searchResult.map((course, index) => (
                                <div
                                    key={index}
                                    className="flex font-semibold text-sm p-3 hover:bg-gray-100 cursor-pointer"
                                >
                                    <div className="w-10 h-10 mr-3">
                                        <img
                                            src={course.thumbnail ? course.thumbnail : ""}
                                            alt="thumbnail"
                                            className="w-10 h-10 object-cover"
                                        />
                                    </div>
                                    <div>
                                        {course.title}
                                        <div className="font-normal text-xs text-gray-500 mt-1">
                                            Tags:
                                            {course.categories.map((cate, ind) => (
                                                <span className="ml-1" key={ind}>
                                                    {cate.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm">
                            <p className="text-base font-bold">No Results Found</p>
                            <p className="text-gray-500 mt-1">Try checking for typos or using complete words.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
