// AdminView.jsx
import React, { useState, useEffect } from "react";
import clsx from "clsx";
// import avatar from "../../../assets/images/avatar_25.jpg";
import ShowPassword from "../../../../component/auth/ShowPassword";
import * as userApi from "../../../../api/apiService/authService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Messages from "../../../../component/profileComponent/Messages";
import Settings from "../../../../component/profileComponent/Setting";

function isValidEmail(email) {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
}

function isPasswordStrong(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}

function AdminView({ adminOpen = false }) {
  const userInfo = useSelector((user) => user.login.user);
  console.log(userInfo);
  const [user, setUser] = useState({ ...userInfo });
  const [activeSection, setActiveSection] = useState("messages");

  const [activeForm, setActiveForm] = useState("details");
  const [errors, setErrors] = useState({});
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [selectedBtn, setSelectedBtn] = useState("0");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleInputPasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
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

  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Invalid password input");
      return;
    }

    toast.promise(userApi.updatePassword(passwords), {
      loading: "Updating password...",
      success: (data) => {
        return data.mess;
      },
      error: (err) => {
        return "Update Failed";
      },
    });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};
    if (user.firstName === null) {
      newErrors.firstName = "First name cannot be empty";
      valid = false;
    }
    if (user.firstName !== null && !user.firstName.trim()) {
      newErrors.firstName = "First name cannot be empty";
      valid = false;
    }
    if (user.lastName === null) {
      newErrors.lastName = "Last name cannot be empty";
      valid = false;
    }
    if (user.lastName !== null && !user.lastName.trim()) {
      newErrors.lastName = "Last name cannot be empty";
      valid = false;
    }

    if (activeForm === "details") {
      if (!isValidEmail(user.email)) {
        newErrors.email = "Please enter a valid email";
        valid = false;
      }
    } else if (activeForm === "password") {
      if (!passwords.oldPassword) {
        newErrors.oldPassword = "Old password is required.";
        valid = false;
      }
      if (!isPasswordStrong(passwords.newPassword)) {
        newErrors.newPassword =
          "Password must have at least 8 characters, including uppercase, lowercase, and special characters.";

        valid = false;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    const { avatar, ...userData } = user;
    toast.promise(userApi.updateProfile(userData, avatar), {
      loading: "Loading...",
      success: (data) => {
        console.log(data);
        // setUser(data.content);
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
        const result = await userApi.getUserByEmail(userInfo.email);
        // if (!result.content.email.includes("@")) {
        //     result.content.email = null;
        // }
        setUser(result.content);
        setPasswords({ ...passwords, email: result.content.email });
      } catch (error) {
        console.log(error);
      }
    };
    fetchApi();
  }, [userInfo?.email]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="p-6 flex items-center justify-between bg-gray-50">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt="Profile"
              className="h-16 w-16 rounded-full border"
            />
            <div>
              <h1 className="font-bold text-xl">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="text-sm text-gray-500">
                Web Designer & Best-Selling Instructor
              </p>
            </div>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
            Become Instructor →
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-white border-t border-b p-4">
          <ul className="flex justify-center space-x-6 text-sm font-medium">
            <li
              onClick={() => setActiveSection("messages")}
              className={clsx("cursor-pointer", {
                "text-orange-500 font-bold": activeSection === "messages",
                "hover:text-orange-500": activeSection !== "messages",
              })}
            >
              Messages
            </li>
            <li
              onClick={() => setActiveSection("settings")}
              className={clsx("cursor-pointer", {
                "text-orange-500 font-bold": activeSection === "settings",
                "hover:text-orange-500": activeSection !== "settings",
              })}
            >
              Settings
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {activeSection === "messages" && <Messages />}
        {activeSection === "settings" && <Settings />}
      </main>
    </div>
  );
}

export default AdminView;
