import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import styles from "./Menu.module.scss";
import { Fragment } from "react";
import avatarDefault from "../../assets/images/Avatar.png";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import * as authApi from "../../api/apiService/authService";
import { useDispatch, useSelector } from "react-redux";
import loginSlice from "../../redux/reducers/loginSlice";

function Dropdown({ elementClick, ...props }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.login.user);
    const navigate = useNavigate();
    const handleLogout = () => {
        const fetchApi = async () => {
            try {
                await authApi.logout();
                dispatch(loginSlice.actions.setLogout());
                navigate("/");
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    return (
        <div className="text-right flex items-center">
            <Menu as="div" className="relative text-left flex ml-2">
                <Menu.Button className="inline-flex items-center w-full justify-center rounded-md text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                    {elementClick
                        ? elementClick
                        : "Options" +
                          (
                              <ChevronDownIcon
                                  className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                                  aria-hidden="true"
                              />
                          )}
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className={clsx(
                            styles.itemClick,
                            "absolute right-0 mt-2origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                        )}
                    >
                        <div className="px-4 py-1 w-max">
                            <div
                                className={`${"text-gray-900"} group flex w-full items-center rounded-md py-2.5 text-sm`}
                            >
                                <div>
                                    <img
                                        className={clsx(styles.avatar)}
                                        src={
                                            user && user.avatar
                                                ? user.avatar
                                                : avatarDefault
                                        }
                                        alt=""
                                    />
                                </div>
                                <div
                                    className={clsx(styles.userName, "flex-1")}
                                >
                                    <span>
                                        {user && user.firstName}
                                        {user && user.lastName}
                                    </span>
                                    <div>
                                        {user?.email?.includes("@")
                                            ? "@" +
                                              user.email.substring(
                                                  0,
                                                  user.email.indexOf("@")
                                              )
                                            : "@" + user?.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-1 py-1 ">
                            {user?.role === "ADMIN" && (
                                <Link to={"/admin"}>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active
                                                        ? "bg-black text-white"
                                                        : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                            >
                                                
                                                Dashboard
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Link>
                            )}
                            <Link
                                to={`/me/profile/${
                                    user?.email?.includes("@")
                                        ? "@" +
                                          user.email.substring(
                                              0,
                                              user.email.indexOf("@")
                                          )
                                        : "@" + user?.email
                                }`}
                            >
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                          
                                            Profile
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link>
                            
                            <Link
                                to={`/speaking-report`}
                            >
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                          
                                            My Speaking Report
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link>
                            <Link
                                to={`/my-report`}
                            >
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                          
                                            My Writing Report
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link>
                            {user?.role !== "ADMIN" && (
                                <Link to={"/me/my-courses"}>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active
                                                        ? "bg-black text-white"
                                                        : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                            >
                                                   
                                              
                                                My Test
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Link>
                                
                            )}
                        </div>
                        <div className="px-1 py-1">
                            <div onClick={handleLogout}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                           
                                            Logout
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}

export default Dropdown;
