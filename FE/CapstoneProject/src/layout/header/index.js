import React, { useEffect,useState  } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/E-tutor_logo.png";
import avatar from "../../assets/images/Avatar.png";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import clsx from "clsx";
import Dropdown from "../../component/dropDown";
import { useDispatch, useSelector } from "react-redux";
import * as userApi from "../../api/apiService/authService";
import * as dataApi from "../../api/apiService/dataService";

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
            <div className="z-[1050] w-1400px flex justify-center sticky top-0">
               {/* <div className="w-full fixed top-0 bg-black text-white z-50">
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
                </div> */}

                <header
                    className={clsx(
                        ` ${styles.boxShadow} rounded-full z-header h-[50px] w-1400 bg-white mt-1 fixed flex items-center justify-between px-5 text-sm leading-5 border-b border-gray-100 mx-auto max-md:flex-wrap max-md:px-5 max-md:max-w-full`
                    )}
                >
                    <div className="flex gap-5 justify-between self-start pt-2 text-neutral-800">
                        <Link to="/">
                        <div className="flex items-center gap-2">
                            <img
                                loading="lazy"
                                src={logo}
                                alt="Logo"
                                className="shrink-0 h-8 w-8 aspect-square"
                            />
                            <p className="text-base font-semibold m-0">Dream-Catcher</p>
                        </div>
                        </Link>
                    </div>
                    
                    <nav className="flex justify-start py-2">
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "/" ? "nav-header-active" : ""
                            } px-4 py-2 text-black text-sm`}
                            to="/IELTS"
                        >
                            Speaking
                        </Link>
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "" ? "nav-header-active" : ""
                            } px-4 py-2 text-black text-sm`}    
                            to="/IELTS/Writing/Test"
                        >
                            Writing
                        </Link>
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "" ? "nav-header-active" : ""
                            } px-4 py-2 text-black text-sm`}    
                            to="/pronunciation-practice"
                        >
                            Pronunciation
                        </Link>
                        {/* <Link
                            className={`nav-header ${
                                window.location.pathname === "/courses" ? "nav-header-active" : ""
                            } px-4 py-2 text-black text-sm`}
                            to="/courses"
                        >
                            Courses
                        </Link> */}
                    
                       
                        <Link
                            className={`nav-header ${
                                window.location.pathname === "/instructor" ? "nav-header-active" : ""
                            } px-4 py-2 text-black text-sm`}
                            to="IELTS/VOCAB/sets"
                        >
                            Quiz
                        </Link>
                    </nav>
                    <div className="flex gap-3 justify-between">
                        {!user ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleGoToSignUp}
                                    id="signUp"
                                    className={`"cursor-pointer" ${
                                        page === "sign-up"
                                            ? "px-4 py-1 rounded-md bg-black text-white"
                                            : "px-4 py-1 text-neutral-800 rounded-md"
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
                                            ? "px-4 py-2 rounded-full bg-black text-white"
                                            : "px-4 py-2 text-neutral-800 rounded-md"
                                    }`}
                                >
                                    Login
                                </button>
                            </>
                        ) : (
                            <>
                            <div className="flex items-center">
                            {/* <div className="w-35 mr-2">
                                <Select
                                    // onChange={handleSelectChange}
                                    getOptionLabel={(x) => x.name}
                                    getOptionValue={(x) => x.id}
                                    options={categories}
                                    styles={selectStyles}
                                    placeholder="Categories"
                                />
                            </div> */}
                        </div>
                            <div className={clsx(styles.notification, "flex items-center gap-5")}>                                   
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
