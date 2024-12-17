"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import NotificationItem from "../../component/notificationItem";
import SearchBar from "../../component/search";
import Dropdown from "../../component/dropDown";
import * as userApi from "../../api/apiService/authService";
import notificationSlice from "../../redux/reducers/notificationSlice";
import logo from "../../assets/images/E-tutor_logo.png";
import avatar from "../../assets/images/Avatar.png";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
};

const Header = () => {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.login);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const result = await userApi.getAllNotification(user.email);
        if (result.content.length > 0) {
          dispatch(notificationSlice.actions.init(result.content));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [user, dispatch]);

  const handleGoToSignUp = () => navigate("/sign-up");
  const handleGoToLogin = () => navigate("/login");

  const MenuItem = ({ item, children }) => (
    <div
      onMouseEnter={() => setActive(item)}
      onMouseLeave={() => setActive(null)} // Đảm bảo thoát trạng thái hover
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      {active === item && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 10 }}
          transition={transition}
          className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4 z-[1051]"
        >
          <motion.div
            layoutId="active"
            transition={transition}
            className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-visible border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
          >
            <motion.div layout className="w-max h-full p-4">
              {children || "No content"}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );

  const Menu = ({ children }) => (
    <nav
      onMouseLeave={() => setActive(null)}
      className="flex justify-center space-x-8 px-4"
    >
      {children}
    </nav>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center h-20 bg-white shadow-md">
      <div className="flex items-center justify-between text-white rounded-full shadow-lg px-8 py-4 max-w-[1200px] w-full">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="Dream-Catcher" className="h-8 w-8" />
          <span className="text-lg font-bold">Dream-Catcher</span>
        </Link>
        <Menu>
          <MenuItem item="Speaking">
            <div className="p-4 text-black bg-gray-100 rounded-md shadow-md">
              Speaking Content
            </div>
          </MenuItem>
          <MenuItem item="Writing">
            <div className="p-4 text-black bg-gray-100 rounded-md shadow-md">
              Writing Content
            </div>
          </MenuItem>
        </Menu>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <SearchBar />
              <NotificationItem
                iconBtn={
                  <svg
                    viewBox="0 0 448 512"
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                  >
                    <path d="..." />
                  </svg>
                }
              />
              <Dropdown
                elementClick={
                  <img
                    src={user.avatar || avatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border border-gray-200 cursor-pointer"
                  />
                }
              />
            </>
          ) : (
            <>
              <button
                onClick={handleGoToSignUp}
                className="px-4 py-2 bg-white text-black rounded-md"
              >
                Sign Up
              </button>
              <button
                onClick={handleGoToLogin}
                className="px-4 py-2 text-white border border-white rounded-md"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
