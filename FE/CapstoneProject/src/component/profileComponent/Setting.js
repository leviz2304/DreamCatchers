// src/pages/Settings.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as userApi  from "../../api/apiService/authService";
import { toast } from "sonner";
import { isValidEmail, isPasswordStrong } from "../../utils/validation";

const Settings = () => {
  const userInfo = useSelector((state) => state.login.user);
  const [user, setUser] = useState({ ...userInfo });
  const [errors, setErrors] = useState({});
  const [passwords, setPasswords] = useState({
    email: userInfo?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedForm, setSelectedForm] = useState("details");
  const [avatarFile, setAvatarFile] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await userApi.getUserByEmail(userInfo.email);
        setUser(result.content);
        setPasswords((prevPasswords) => ({
          ...prevPasswords,
          email: result.content.email,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchApi();
  }, [userInfo?.email]);

  // Handle input changes for user details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Handle input changes for password fields
  const handleInputPasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Handle file change for avatar upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (optional)
      if (file.size > 1 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          avatar: "Image size should be under 1MB",
        }));
        return;
      }
  
      // Update avatar file state
      setAvatarFile(file);
  
      // Update avatar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prevUser) => ({
          ...prevUser,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
  
      // Clear any previous avatar errors
      setErrors((prevErrors) => ({
        ...prevErrors,
        avatar: "",
      }));
    }
  };
  

  // Handle form switching between 'details' and 'password'
  const handleSwitchForm = (formName) => {
    setSelectedForm(formName);
    // Reset errors when switching forms
    setErrors({});
  };

  // Form validation logic
  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (selectedForm === "details") {
      if (!user.firstName || !user.firstName.trim()) {
        newErrors.firstName = "First name cannot be empty";
        valid = false;
      }
      if (!user.lastName || !user.lastName.trim()) {
        newErrors.lastName = "Last name cannot be empty";
        valid = false;
      }
      if (!isValidEmail(user.email)) {
        newErrors.email = "Please enter a valid email";
        valid = false;
      }
    } else if (selectedForm === "password") {
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

  // Handle form submission for profile details
  const handleSubmitDetails = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
  
    const userData = {
      ...user,
    };
  
    // Create FormData object
    const formData = new FormData();
    // Append user data as JSON string
    formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    // Append avatar file if it exists
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }
  
    toast.promise(userApi.updateProfile(formData), {
      loading: "Updating profile...",
      success: (data) => {
        console.log(data);
        toast.success("Profile updated successfully");
        return "Profile updated successfully";
      },
      error: (err) => {
        console.error(err);
        return err.response?.data?.message || "Update Failed";
      },
    });
  };

  // Handle form submission for password change
  const handleSubmitChangePassword = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Invalid password input");
      return;
    }

    toast.promise(userApi.updatePassword(passwords), {
      loading: "Updating password...",
      success: (data) => {
        return data.mess || "Password updated successfully";
      },
      error: (err) => {
        return err.mess || "Update Failed";
      },
    });
  };

  return (
    <div className="bg-white border rounded-lg p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>
      <div className="flex mb-8">
        <button
          onClick={() => handleSwitchForm("details")}
          className={`px-4 py-2 rounded-t-lg ${
            selectedForm === "details"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Profile Details
        </button>
        <button
          onClick={() => handleSwitchForm("password")}
          className={`px-4 py-2 rounded-t-lg ml-2 ${
            selectedForm === "password"
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Change Password
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Profile Upload Section */}
        {selectedForm === "details" && (
          <div className="col-span-1 flex flex-col items-center">
            <div className="relative w-32 h-32">
              <img
                src={user.avatar || "/default-avatar.jpg"}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center rounded-full opacity-0 hover:opacity-100 transition cursor-pointer"
              >
                Upload Photo
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Image size should be under 1MB and ratio needs to be 1:1
            </p>
          </div>
        )}

        {/* Right: Form Section */}
        <div
          className={`${
            selectedForm === "details" ? "col-span-2" : "col-span-3"
          }`}
        >
          {selectedForm === "details" ? (
            <form
              className="grid grid-cols-2 gap-6"
              onSubmit={handleSubmitDetails}
            >
              {/* First Name */}
              <div>
                <label className="block text-sm text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={user.firstName || ""}
                  onChange={handleInputChange}
                  placeholder="First name"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              {/* Last Name */}
              <div>
                <label className="block text-sm text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={user.lastName || ""}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              {/* Username */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={user.username || ""}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Email */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email || ""}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Title */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={user.title || ""}
                  onChange={handleInputChange}
                  placeholder="Your title, profession or small biography"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">
                  {user.title ? user.title.length : 0}/50
                </p>
              </div>

              {/* Save Changes Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white rounded-lg p-2 mt-4"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <form
              className="grid grid-cols-2 gap-6"
              onSubmit={handleSubmitChangePassword}
            >
              {/* Old Password */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-700">
                  Old Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handleInputPasswordChange}
                  placeholder="Enter your old password"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.oldPassword && (
                  <p className="text-sm text-red-500">{errors.oldPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handleInputPasswordChange}
                  placeholder="Enter your new password"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-500">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleInputPasswordChange}
                  placeholder="Confirm your new password"
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Save Changes Button */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white rounded-lg p-2 mt-4"
                >
                  Update Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
