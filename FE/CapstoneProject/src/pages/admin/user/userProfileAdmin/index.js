import React, { useState, useEffect } from "react";
import styles from "../../../user/userprofile/userProfile.module.scss";
import clsx from "clsx";
import avatar from "../../../../assets/images/avatar_25.jpg";
import ShowPassword from "../../../../component/auth/ShowPassword";
import { useNavigate, useParams } from "react-router-dom";
import * as userApi from "../../../../api/apiService/authService";
import { toast } from "sonner";

const AdminView = () => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
        phoneNumber: "",
    });
    const [activeForm, setActiveForm] = useState("details");
    const [errors, setErrors] = useState({});
    const [passwords, setPasswords] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const { email } = useParams();
    const [selectedBtn, setSelectedBtn] = useState("0");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
        setErrors({ ...errors, [name]: "" });
    };

    const handleInputPasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUser({ ...user, avatar: file });
        }
    };

    const handleSwitchPage = (e) => {
        const newIndex = e.target.dataset.index;
        setSelectedBtn(newIndex);

        switch (newIndex) {
            case "0":
                setActiveForm("details");
                break;
            case "1":
                setActiveForm("password");
                break;
            default:
                console.log("Unhandled index!");
        }
    };

    const handleSubmitChangePassword = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) {
            console.error("Invalid password input");
            toast.error("Failed to update password");
            return;
        }
        try {
            await userApi.resetPasswordByEmail(passwords.newPassword, email);
            toast.success("Password updated successfully");
        } catch (error) {
            toast.error("Failed to update password");
        }
    };

    const validatePasswordForm = () => {
        let valid = true;
        const newErrors = {};

        if (!isPasswordStrong(passwords.newPassword)) {
            newErrors.newPassword =
                "Password must have at least 8 characters, including uppercase, lowercase, and special characters.";
            valid = false;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const validateProfileForm = () => {
        let valid = true;
        const newErrors = {};

        if (!user.firstName) {
            newErrors.firstName = "First name is required.";
            valid = false;
        }
        if (!user.lastName) {
            newErrors.lastName = "Last name is required.";
            valid = false;
        }
        if (!isValidEmail(user.email)) {
            newErrors.email = "Email is not valid.";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateProfileForm()) {
            toast.error("Invalid input");
            return;
        }
        const { avatar, ...userData } = user;
        toast.promise(userApi.updateProfile(userData, avatar), {
            loading: "Loading...",
            success: (data) => {
                setUser(data.content);
                return "Update successfully";
            },
            error: (err) => {
                return err.mess;
            },
        });
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await userApi.getUserByEmail(email);
                setUser(result.content);
            } catch (error) {
                console.log(error.mess);
            }
        };
        fetchApi();
    }, [email]);

    return (
        <div className={styles.container}>
            <div className={clsx("container")}>
                <div className={clsx("row justify-center gap-6")}>
                    <div className={clsx(styles.header, "col-lg-10")}>
                        <ul className={clsx("flex gap-10 mb-0")}>
                            <li
                                onClick={handleSwitchPage}
                                className={clsx(styles.item, {
                                    [styles.selected]: selectedBtn === "0",
                                })}
                                data-index="0"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H3Zm2.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10 5.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75Zm.75 3.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5h-1.5ZM10 8a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5h-1.5A.75.75 0 0 1 10 8Zm-2.378 3c.346 0 .583-.343.395-.633A2.998 2.998 0 0 0 5.5 9a2.998 2.998 0 0 0-2.517 1.367c-.188.29.05.633.395.633h4.244Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                General
                            </li>
                            <li
                                onClick={handleSwitchPage}
                                data-index="1"
                                className={clsx(styles.item, {
                                    [styles.selected]: selectedBtn === "1",
                                })}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 1 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Security
                            </li>
                        </ul>
                    </div>
                    {selectedBtn == 0 ? (
                        <>
                            <div className={clsx("col-lg-4")}>
                                <div className="p-6 h-full flex items-center flex-col justify-center rounded-xl b-shadow-sm">
                                    <div className={clsx(styles.avatar)}>
                                        <img
                                            loading="lazy"
                                            src={
                                                user.avatar
                                                    ? user.avatar instanceof
                                                          File ||
                                                      user.avatar instanceof
                                                          Blob
                                                        ? URL.createObjectURL(
                                                              user.avatar
                                                          )
                                                        : user.avatar
                                                    : avatar
                                            }
                                            alt="User avatar"
                                        />
                                        <input
                                            accept=".jpg, .png, .jpeg"
                                            id="avatar"
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                            name=""
                                        />
                                        <label
                                            htmlFor="avatar"
                                            className={clsx(styles.updatePhoto)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                            >
                                                <path d="M9.5 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.5 5A1.5 1.5 0 0 0 1 6.5v5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 13.5 5h-.879a1.5 1.5 0 0 1-1.06-.44l-1.122-1.12A1.5 1.5 0 0 0 9.38 3H6.62a1.5 1.5 0 0 0-1.06.44L4.439 4.56A1.5 1.5 0 0 1 3.38 5H2.5ZM11 8.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            Update photo
                                        </label>
                                    </div>

                                    <div className={clsx(styles.sub)}>
                                        Allowed *.jpg, *.png, *.jpeg
                                    </div>
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    "col-lg-6 rounded-xl b-shadow-sm"
                                )}
                            >
                                <div className={clsx("p-6")}>
                                    <div className={clsx(styles.field)}>
                                        <div
                                            className={clsx(
                                                "flex gap-3 w-full"
                                            )}
                                        >
                                            <div>
                                                <div
                                                    className={clsx(
                                                        styles.formField,
                                                        "flex-1"
                                                    )}
                                                >
                                                    <input
                                                        required
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        value={user.firstName}
                                                        name="firstName"
                                                        data-validate
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
                                                        First Name
                                                    </label>
                                                </div>
                                                {errors.firstName && (
                                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                                        {errors.firstName}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div
                                                    className={clsx(
                                                        styles.formField,
                                                        "flex-1"
                                                    )}
                                                >
                                                    <input
                                                        required
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        value={user.lastName}
                                                        name="lastName"
                                                        data-validate
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
                                                        Last Name
                                                    </label>
                                                </div>
                                                {errors.lastName && (
                                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                                        {errors.lastName}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                className={clsx(
                                                    styles.formField,
                                                    "w-full"
                                                )}
                                            >
                                                <div className="relative">
                                                    <input
                                                        required
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        value={user.email}
                                                        name="email"
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
                                                        Email
                                                    </label>
                                                </div>
                                                {errors.email && (
                                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                                        {errors.email}
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                className={clsx(
                                                    styles.formField,
                                                    "w-full"
                                                )}
                                            >
                                                <div className="relative">
                                                    <input
                                                        required
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                        value={
                                                            user.phoneNumber ||
                                                            " "
                                                        }
                                                        name="phoneNumber"
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
                                                        Phone Number
                                                    </label>
                                                    {errors.phoneNumber && (
                                                        <div className="text-red-500 mt-1 text-sm ml-1">
                                                            {errors.phoneNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={clsx(styles.btn)}
                                                onClick={handleSubmit}
                                            >
                                                Save changes
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className={clsx(
                                    "col-lg-10 rounded-xl b-shadow-sm"
                                )}
                            >
                                <div className={clsx("p-6")}>
                                    <form
                                        className={clsx(styles.field)}
                                        action=""
                                    >
                                        <div>
                                            <div
                                                className={clsx(
                                                    styles.formField,
                                                    "w-full "
                                                )}
                                            >
                                                <div className="px-2 w-full flex text-sm">
                                                    <input
                                                        autoComplete="off"
                                                        id="newPassword"
                                                        required
                                                        onChange={
                                                            handleInputPasswordChange
                                                        }
                                                        value={
                                                            passwords.newPassword
                                                        }
                                                        name="newPassword"
                                                        data-validate
                                                        className={clsx(
                                                            styles.formInput
                                                        )}
                                                        type="password"
                                                    ></input>
                                                    <label
                                                        className={clsx(
                                                            styles.formLabel
                                                        )}
                                                    >
                                                        New Password
                                                    </label>
                                                    <ShowPassword
                                                        passInput={document.getElementById(
                                                            "newPassword"
                                                        )}
                                                    ></ShowPassword>
                                                </div>
                                            </div>
                                            {errors.newPassword && (
                                                <div className="text-red-500 mt-1 text-sm ml-1">
                                                    {errors.newPassword}
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={clsx(
                                                styles.formField,
                                                "w-full"
                                            )}
                                        >
                                            <div className="px-2 w-full flex text-sm">
                                                <input
                                                    autoComplete="off"
                                                    id="confirmPassword"
                                                    required
                                                    onChange={
                                                        handleInputPasswordChange
                                                    }
                                                    value={
                                                        passwords.confirmPassword
                                                    }
                                                    name="confirmPassword"
                                                    className={clsx(
                                                        styles.formInput
                                                    )}
                                                    type="password"
                                                ></input>
                                                <label
                                                    className={clsx(
                                                        styles.formLabel
                                                    )}
                                                >
                                                    Confirm Password
                                                </label>
                                                <ShowPassword
                                                    passInput={document.getElementById(
                                                        "confirmPassword"
                                                    )}
                                                ></ShowPassword>
                                            </div>
                                        </div>
                                        {errors.confirmPassword && (
                                            <div className="text-red-500  text-sm ml-1">
                                                {errors.confirmPassword}
                                            </div>
                                        )}
                                        <button
                                            type="submit"
                                            className={clsx(styles.btn)}
                                            onClick={handleSubmitChangePassword}
                                        >
                                            Save changes
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

function isValidEmail(email) {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
}

function isPasswordStrong(password) {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
}

export default AdminView;
