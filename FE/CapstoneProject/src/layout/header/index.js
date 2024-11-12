import React, { useEffect,useState  } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/E-tutor_logo.png";
import avatar from "../../assets/images/Avatar.png";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import clsx from "clsx";
import Dropdown from "../../component/dropDown";
import { useDispatch, useSelector } from "react-redux";
import NotificationItem from "../../component/notificationItem";
import useNotificationWebSocket from "../../component/useNotificationWebSocket";
import * as userApi from "../../api/apiService/authService";
import * as dataApi from "../../api/apiService/dataService";

import notificationSlice from "../../redux/reducers/notificationSlice";
import SearchBar from "../../component/search";
import Combobox from "../../component/combobox";
import Select ,{ StylesConfig }from 'react-select';
export default function Header() {
    const navigate = useNavigate();
    const [page, setPage] = React.useState("login");
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [categories, setCategories] = useState([]); // State để lưu danh mục
    const { user } = useSelector((state) => state.login);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (window.location.pathname === "/admin") {
            setIsAdmin(true);
        }
    }, []);

    useNotificationWebSocket();

    useEffect(() => {
        if (!user) return;
        const fetchApi = async () => {
            try {
                const result = await userApi.getAllNotification(user.email);
                if (result.content.length > 0) {
                    dispatch(notificationSlice.actions.init(result.content));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [user, dispatch]);

    const handleGoToSignUp = () => {
        if (window.location.pathname === "/sign-up") return;
        setPage("sign-up");
        navigate("/sign-up");
    };

    const handleGoToLogin = () => {
        if (window.location.pathname === "/login") return;
        setPage("login");
        navigate("/login");
    };
    const selectStyles = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "black" : "#e9ecee",
            minHeight: "30px",
            height: "35px",
            padding: "0 8px",
        }),
        valueContainer: (baseStyles) => ({
            ...baseStyles,
            padding: "0 8px",
        }),
        input: (baseStyles) => ({
            ...baseStyles,
            margin: 0,
            padding: 0,
        }),
        singleValue: (baseStyles) => ({
            ...baseStyles,
            margin: 0,
            padding: 0,
        }),
    };
    useEffect(() => {
        const fetchCategories = async () => {
            try {
               let categories = [];
                categories = await dataApi.getAllCategories(0, 99999);
                categories.content.content.push({ id: "-1", name: "All" });
                setCategories(categories.content.content);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);
    return (
        !isAdmin && (
            <div className="z-9999 relative w-1400px flex justify-center">
               <div className="w-full fixed top-0 bg-black text-white z-50">
                    <nav className="flex justify-start py-2">
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "/" ? "nav-header-active" : ""
                            } px-4 py-2 text-white text-sm`}
                            to="/"
                        >
                            Home
                        </Link>
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "/courses" ? "nav-header-active" : ""
                            } px-4 py-2 text-white text-sm`}
                            to="/courses"
                        >
                            Courses
                        </Link>
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "/about" ? "nav-header-active" : ""
                            } px-4 py-2 text-white text-sm`}
                            to="/about"
                        >
                            About
                        </Link>
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "/contact" ? "nav-header-active" : ""
                            } px-4 py-2 text-white text-sm`}
                            to="/contact"
                        >
                            Contact
                        </Link>
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "/instructor" ? "nav-header-active" : ""
                            } px-4 py-2 text-white text-sm`}
                            to="/instructor"
                        >
                            Become an Instructor
                        </Link>
                    </nav>
                </div>

                <header
                    className={clsx(
                        ` ${styles.boxShadow} rounded-b-xl z-header w-1400  bg-white mt-10 items-center fixed flex gap-5 justify-between px-16 pt-4 pb-2.5 text-sm leading-5 border-b border-gray-100 border-solid  max-md:flex-wrap max-md:px-5 max-md:max-w-full`
                    )}
                >
                    <div className="flex gap-5 justify-between self-start text-neutral-800">
                        <Link to="/">
                          
                        <div className="flex items-center gap-3">
                            <img
                                loading="lazy"
                                src={logo}
                                alt="Logo"
                                className="shrink-0 w-10 aspect-square"
                            />
                            <p className="text-center text-lg font-semibold leading-none self-center m-0	">Dream-Catcher</p>
                        </div>
                        </Link>

                        <div className="flex items-center">
                            <div className="w-40 mr-5">
                                <Select
                                    // onChange={handleSelectChange}
                                    getOptionLabel={(x) => x.name}
                                    getOptionValue={(x) => x.id}
                                    options={categories}
                                    styles={selectStyles}
                                    placeholder="Categories"
                                />
                            </div>
                            <SearchBar></SearchBar>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-between">
                        {!user ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleGoToSignUp}
                                    id="signUp"
                                    className={`"cursor-pointer" ${
                                        page === "sign-up"
                                            ? "justify-center px-6 py-3 whitespace-nowrap rounded-md max-md:px-5 bg-black text-white"
                                            : "my-auto px-6 py-3 text-neutral-800 whitespace-nowrap rounded-md"
                                    }`}
                                >
                                    Sign Up
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGoToLogin}
                                    id="login"
                                    className={`"cursor-pointer" ${
                                        page === "login"
                                            ? "justify-center px-6 py-3 whitespace-nowrap rounded-md max-md:px-5 bg-black text-white"
                                            : "my-auto px-6 py-3 text-neutral-800 whitespace-nowrap rounded-md"
                                    }`}
                                >
                                    Login
                                </button>
                            </>
                        ) : (
                            <>
                            <div className={clsx(styles.notification, "flex items-center gap-5")}>
                                {/* Notification Icon */}
                                <div className="relative cursor-pointer">
                                    <NotificationItem
                                        iconBtn={
                                            <svg
                                                viewBox="0 0 448 512"
                                                className="bell w-6 h-6 text-gray-700"
                                            >
                                                <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                                            </svg>
                                        }
                                    />
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
                                </div>
                        
                                {/* Favorite Icon */}
                                <div className="relative cursor-pointer">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-7 h-7 text-gray-700"
                                    >
                                        <path d="M18.2 6.6c-1.5-1.7-4-1.8-5.6 0l-.7.7-.7-.7c-1.5-1.7-4-1.8-5.6 0-1.7 1.5-1.8 4 0 5.6l6.3 6.3 6.3-6.3c1.7-1.5 1.8-4.1 0-5.6z"></path>
                                    </svg>
                                </div>
                        
                                {/* Cart Icon */}
                                <div className="relative cursor-pointer">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-6 h-6 text-gray-700"
                                    >
                                        <circle cx="9" cy="21" r="1"></circle>
                                        <circle cx="20" cy="21" r="1"></circle>
                                        <path d="M1 1h4l2.7 13.4a1 1 0 0 0 1 0.8h12.2a1 1 0 0 0 1-.8l1.5-7.5h-17"></path>
                                    </svg>
                                    {/* <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"></span> */}
                                </div>
                        
                                <Dropdown
                                    elementClick={
                                        <img
                                            className="border rounded-full object-cover w-10 h-10 border-gray-200 cursor-pointer"
                                            src={user && user.avatar ? user.avatar : avatar}
                                            alt="User Avatar"
                                        />
                                    }
                                />
                            </div>
                        </>
                        
                        )}
                    </div>
                </header>
            </div>
        )
    );
}
