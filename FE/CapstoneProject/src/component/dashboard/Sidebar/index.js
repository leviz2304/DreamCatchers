import React from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Drawer,
  Card,
} from "@material-tailwind/react";
import appDash from "../../../assets/images/app_dash.svg";
import icUser from "../../../assets/images/ic_user.svg";
import icCourse from "../../../assets/images/icCourse.svg";
import Avatar from "../../../assets/images/Avatar.png";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationItem from "../../notificationItem";
import Dropdown from "../../dropDown";
import SearchBar from "../../search";

export default function SidebarWithBurgerMenu() {
  const [open, setOpen] = React.useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const location = useLocation();
  const user = useSelector((state) => state.login.user);

  const handleOpen = (value) => {
    setOpen(open === value ? null : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Navigation data
  const navigationData = [
    {
      title: "OVERVIEW",
      items: [
        {
          label: "App",
          icon: appDash,
          link: "/admin",
        },
      ],
    },
    {
      title: "Manager",
      items: [
        {
          label: "User",
          icon: icUser,
          subItems: [
            { label: "List", link: "/admin/user/list" },
            { label: "Create", link: "/admin/user/create" },
            { label: "History Delete", link: "/admin/user/historyDelete" },
          ],
        },
        {
          label: "Course",
          icon: icCourse,
          subItems: [
            { label: "List", link: "/admin/course/list" },
            { label: "Create", link: "/admin/course/create" },
            { label: "History Delete", link: "/admin/course/historyDelete" },
          ],
        },
        // Add other items like Category, Invoice, etc.
      ],
    },
  ];

  return (
    <>
      <IconButton variant="text" size="lg" onClick={openDrawer}>
        {isDrawerOpen ? (
          <XMarkIcon className="h-8 w-8 stroke-2" />
        ) : (
          <Bars3Icon className="h-8 w-8 stroke-2" />
        )}
      </IconButton>
      <Drawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        overlay={false}
        className=""
      >
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full"
        >
          {/* User Info Section */}
          <div className="mb-4 flex items-center gap-4 p-4">
            {/* Notification Icon */}
            <div className="flex items-center">
              <NotificationItem
                iconBtn={
                  <svg viewBox="0 0 448 512" className="bell w-6 h-6">
                    <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                  </svg>
                }
              />
            </div>

            {/* User Avatar and Info */}
            <div className="flex items-center gap-3">
              <Dropdown
                admin={true}
                elementClick={
                  <img
                    className="rounded-full object-cover w-12 h-12 border border-gray-200 cursor-pointer"
                    src={user?.avatar || Avatar}
                    alt="User Avatar"
                  />
                }
              />
              <div className="flex flex-col">
                <b className="uppercase">
                  {user ? `${user.firstName} ${user.lastName}` : "User Name"}
                </b>
                <div className="text-sm text-gray-500">
                  {user?.role || "Role"}
                </div>
              </div>
            </div>
          </div>

          {/* Optional Divider */}
          <hr className="my-2 border-blue-gray-50" />

          {/* Search Bar */}
          <div className="p-2">
            <SearchBar />
          </div>

          {/* Navigation List */}
          <List>
            {navigationData.map((section, index) => (
              <React.Fragment key={index}>
                <Typography
                  variant="small"
                  color="gray"
                  className="font-medium uppercase py-2 px-3"
                >
                  {section.title}
                </Typography>
                {section.items.map((item, idx) => {
                  const isActive = location.pathname.startsWith(item.link);
                  if (item.subItems) {
                    return (
                      <Accordion
                        key={idx}
                        open={open === item.label}
                        icon={
                          <ChevronDownIcon
                            strokeWidth={2.5}
                            className={`mx-auto h-4 w-4 transition-transform ${
                              open === item.label ? "rotate-180" : ""
                            }`}
                          />
                        }
                      >
                        <ListItem className="p-0">
                          <AccordionHeader
                            onClick={() => handleOpen(item.label)}
                            className="border-b-0 py-2 px-3"
                          >
                            <ListItemPrefix>
                              {typeof item.icon === "string" ? (
                                <img
                                  src={item.icon}
                                  alt={item.label}
                                  className="h-5 w-5"
                                />
                              ) : (
                                item.icon
                              )}
                            </ListItemPrefix>
                            <Typography
                              color="blue-gray"
                              className="mr-auto font-normal"
                            >
                              {item.label}
                            </Typography>
                          </AccordionHeader>
                        </ListItem>
                        <AccordionBody className="py-1">
                          <List className="p-0">
                            {item.subItems.map((subItem, subIdx) => (
                              <Link to={subItem.link} key={subIdx}>
                                <ListItem
                                  selected={
                                    location.pathname === subItem.link
                                  }
                                  className="py-2 px-3"
                                >
                                  <ListItemPrefix>
                                    <ChevronRightIcon
                                      strokeWidth={3}
                                      className="h-3 w-5"
                                    />
                                  </ListItemPrefix>
                                  {subItem.label}
                                </ListItem>
                              </Link>
                            ))}
                          </List>
                        </AccordionBody>
                      </Accordion>
                    );
                  } else {
                    return (
                      <Link to={item.link} key={idx}>
                        <ListItem selected={isActive} className="py-2 px-3">
                          <ListItemPrefix>
                            {typeof item.icon === "string" ? (
                              <img
                                src={item.icon}
                                alt={item.label}
                                className="h-5 w-5"
                              />
                            ) : (
                              item.icon
                            )}
                          </ListItemPrefix>
                          {item.label}
                        </ListItem>
                      </Link>
                    );
                  }
                })}
              </React.Fragment>
            ))}
          </List>
        </Card>
      </Drawer>
    </>
  );
}
