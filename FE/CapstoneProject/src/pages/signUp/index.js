import * as React from "react";
import { useState, useEffect } from "react";
import OAuth2Form from "../../component/auth/OAuth2Form.js";
import * as authService from "../../api/apiService/authService.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import eyeSlash from "../../assets/images/eye-slash.png";
import { useDispatch, useSelector } from "react-redux";
import loginSlice from "../../redux/reducers/loginSlice.js";
import styles from "../login/Login.module.scss";
import clsx from "clsx";
export default function SignUp() {
    const [lastClickTime, setLastClickTime] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        code: "",
    });
    const [errors, setErrors] = useState({});
    const [code, setCode] = useState();
    const navigate = useNavigate();
    const dangLogin = useSelector((state) => state.login.isLogin);
    const dispatch = useDispatch();

    const handleGoToLogin = () => {
        if (dangLogin) return;
        dispatch(loginSlice.actions.setLogout());
        navigate("/login");
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        if (name === "email") {
            setCountdown(0);
        }
        setFormData({
            ...formData,
            [name]: value,
        });
        errors[name] = "";
        setErrors(errors);
    }

    function handleOtpButtonClick() {
        const currentTime = new Date().getTime();
        if (!isValidEmail(formData["email"])) {
            errors.email = "Please enter a valid email";
            setErrors((err) => {
                return { ...err };
            });
            return;
        }
        if (countdown === 0) {
            const fetchApi = async () => {
                toast.promise(authService.sendMail(formData["email"]), {
                    loading: "Sending mail...",
                    success: (result) => {
                        console.log(result);
                        setCode(result);
                        return "Send email successfully";
                    },
                    error: (err) => {
                        return err;
                    },
                });
            };
            fetchApi();
            setLastClickTime(currentTime);
            setCountdown(60);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const errors = {};

        Object.keys(formData).forEach((key) => {
            if (!formData[key]) {
                errors[key] = "This field is required.";
            }
        });

        if (!isPasswordStrong(formData.password)) {
            errors.password =
                "Password must have at least 8 characters, including uppercase, normal, and special characters like #@!$...";
        }

        if (!isValidEmail(formData.email)) {
            errors.email = "Email invalidate";
        }

        if (code != document.querySelector("#code").value) {
            errors.code = "The code is invalid";
            setErrors(errors);
        }

        if (
            formData["confirmPassword"] !== "" &&
            formData["password"] !== "" &&
            formData["confirmPassword"] !== formData["password"]
        ) {
            errors.confirmPassword = "Confirm password doesn't match";
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        const fetchApi = async () => {
            toast.promise(authService.register({ ...formData }), {
                loading: "Loading...",
                success: () => {
                    // nhận mã 200 - ok
                    navigate("/login");
                    return "Sign up successfully";
                },
                error: "Error registering",
            });
        };
        fetchApi();
    }
    function isValidEmail(email) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
    }

    useEffect(() => {
        if (formData["email"] === "") {
            setCountdown(0);
        }
    });

    function isPasswordStrong(password) {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        return passwordRegex.test(password);
    }

    function handleShowPassword(e, name) {
        let passInput = document.getElementById(name);

        if (passInput.type === "password") {
            passInput.type = "text";
            e.target.src =
                "https://cdn.builder.io/api/v1/image/assets/TEMP/a8819b1cf48d19a6e95bc57cb5d373ec0162742f3cfe62b7ec31b90b0b48de06?apiKey=9349475655ee4a448868f824f5feb11d&";
        } else {
            passInput.type = "password";
            e.target.src = eyeSlash;
        }
    }

    return (
        <div className="w-full min-h-screen flex bg-white">
        {/* Nửa trái: ảnh */}
        <div className="hidden md:flex md:w-1/2 h-full">
            <img
                src="https://images.unsplash.com/photo-1593642531955-b62e0cda5e1e"
                alt="Signup Image"
                className="w-full h-full object-cover"
            />
        </div>

        {/* Nửa phải: form */}
        <div className="w-[80%] md:w-1/2 flex flex-col justify-center p-6 bg-white mt-20">
            <h2 className="text-3xl font-bold text-center text-black mb-6">
                Sign Up
            </h2>

            <form onSubmit={handleSubmit} method="post" className="space-y-4">
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label htmlFor="firstName" className="font-medium block mb-1 text-black">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter your First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-sm"
                        />
                        {errors.firstName && (
                            <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>
                        )}
                    </div>
                    <div className="flex-1">
                        <label htmlFor="lastName" className="font-medium block mb-1 text-black">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter your Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-sm"
                        />
                        {errors.lastName && (
                            <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="email" className="font-medium block mb-1 text-black">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your Email"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-orange-500 text-sm"
                    />
                    {errors.email && (
                        <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="font-medium block mb-1 text-black">
                        Password
                    </label>
                    <div className="flex items-center border border-gray-300 rounded">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter your Password"
                            className="flex-1 p-2 focus:outline-none text-sm"
                        />
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8819b1cf48d19a6e95bc57cb5d373ec0162742f3cfe62b7ec31b90b0b48de06"
                            alt="Eye icon"
                            className="cursor-pointer w-6 h-6 mr-2"
                            onClick={(e) => handleShowPassword(e, "password")}
                        />
                    </div>
                    {errors.password && (
                        <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="font-medium block mb-1 text-black">
                        Confirm Password
                    </label>
                    <div className="flex items-center border border-gray-300 rounded">
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            onChange={handleInputChange}
                            placeholder="Enter your confirm Password"
                            className="flex-1 p-2 focus:outline-none text-sm"
                        />
                        <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8819b1cf48d19a6e95bc57cb5d373ec0162742f3cfe62b7ec31b90b0b48de06"
                            alt="Eye icon"
                            className="cursor-pointer w-6 h-6 mr-2"
                            onClick={(e) => handleShowPassword(e, "confirmPassword")}
                        />
                    </div>
                    {errors.confirmPassword && (
                        <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
                    )}
                </div>

                <div>
                    <label htmlFor="code" className="font-medium block mb-1 text-black">
                        Code
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="code"
                            name="code"
                            placeholder="Enter your Code"
                            className="p-2 border border-gray-300 rounded-l focus:outline-none focus:border-orange-500 flex-1 text-sm"
                            onChange={handleInputChange}
                        />
                        <button
                            className={`px-3 py-2 text-white text-sm rounded-r ${
                                countdown > 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : formData["email"].length === 0
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600"
                            }`}
                            onClick={(e) => {
                                e.preventDefault();
                                handleOtpButtonClick();
                            }}
                            disabled={countdown > 0 || formData["email"].length === 0}
                        >
                            {countdown > 0 ? `${countdown}s` : "Send code"}
                        </button>
                    </div>
                    {errors.code && (
                        <div className="text-red-500 text-xs mt-1">{errors.code}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors py-3 mt-5 rounded"
                >
                    Sign Up
                </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-sm text-neutral-400">
                <hr className="flex-1 border-zinc-200" />
                <span>OR</span>
                <hr className="flex-1 border-zinc-200" />
            </div>
            <OAuth2Form />

            <div className="flex gap-1.5 justify-center mt-6 text-sm text-center text-neutral-800">
                <span>Already have an account?</span>
                <button
                    onClick={handleGoToLogin}
                    type="button"
                    className="cursor-pointer font-medium underline"
                >
                    Login
                </button>
                <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/52e263b3f77bfff5dc120002e909b75e45aba8be06ea8bd8be14872be77d8f38"
                    alt="Arrow icon"
                    className="w-5 h-5"
                />
            </div>
        </div>
    </div>
    );
}
