import { Fragment, useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import clsx from "clsx";
import thongKe from "../../assets/images/thongKe.svg";
import StatisticCard from "../../component/cardTotal";
import * as dataApi from "../../api/apiService/dataService";
import { useSelector } from "react-redux";
// import StatisticCard from "../../component/statisticCard";
import { getAdminStatistics } from "../../api/apiService/dataService";
import { School, People, LibraryBooks, Article } from "@mui/icons-material";
import stylesList from "../admin/Course/list/List.module.scss";
import Select from "react-select";
import { Link } from "react-router-dom";
import noDataIcon from "../../assets/images/ic_noData.svg";
import avatar from "../../assets/images/avatar_25.jpg";
import Sidebar from "../../component/dashboard/SideBar2";
import RecentComments from "./Comment";
import AdminEssayStatistics from "./Writing/AdminStatistics";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import EssayDataTable from "./Writing/EssayDataTable";
const Dashboard = () => {
    const [statistical, setStatistical] = useState({});
    const [invoices, setInvoices] = useState([]);
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [totalInvoice, setTotalInvoice] = useState(0);
    const user = useSelector((state) => state.login.user);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const [statistics, setStatistics] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        totalPosts: 0,
    });
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    // useEffect(() => {
    //     const fetchApi = async () => {
    //         try {
    //             const result = await dataApi.getMonthlyStatistic(
    //                 currentMonth,
    //                 currentYear
    //             );
    //             setInvoices(result.invoicesCreated);
    //             setCourses(result.coursesCreated);
    //             setUsers(result.usersRegistered);
    //             console.table(result.coursesCreated);
    //             setTotalInvoice(result.invoiceTotal);
    //         } catch (error) {}
    //     };
    //     fetchApi();
    // }, []);
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await getAdminStatistics(); // Gọi API
                console.log(response)
                setStatistics(response); // Cập nhật state với dữ liệu trả về
                console.log(statistics)

            } catch (error) {
                console.error("Failed to fetch statistics:", error);
            }
        };
        fetchStatistics();
    }, []);
    return (
        <div className="container mx-auto px-4 mb-32">
        {/* Header Dashboard */}
        <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold text-orange-500">Admin Dashboard</h1>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, staggerChildren: 0.2 }}
        >
            <StatisticCard
                icon={<LibraryBooks />}
                title="Total Courses"
                value={statistics.totalCourses}
                color="#FF7A59"
            />
            <StatisticCard
                icon={<People />}
                title="Total Students"
                value={statistics.totalStudents.toLocaleString()}
                color="#FF7A59"
            />
            <StatisticCard
                icon={<School />}
                title="Total Instructors"
                value={statistics.totalInstructors}
                color="#FF7A59"
            />
            <StatisticCard
                icon={<Article />}
                title="Total Posts"
                value={statistics.totalPosts}
                color="#FF7A59"
            />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Recent Comments */}
            <motion.div
                className="col-span-1 lg:col-span-2 p-6 bg-white shadow-md rounded-lg"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-xl font-bold mb-4 text-orange-500">Recent Comments</h2>
                <RecentComments />
            </motion.div>

            {/* Right Column: Essay Statistics */}
            <motion.div
                className="col-span-1 p-6 bg-white shadow-md rounded-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-xl font-bold mb-4 text-orange-500">Essay Statistics</h2>
                <AdminEssayStatistics />
            </motion.div>
        </div>

        {/* Essay List Section */}
        <motion.div
            className="mt-12 p-6 bg-white shadow-md rounded-lg h-[750px]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-xl font-bold mb-4 text-orange-500">All Submitted Essays</h2>
            <EssayDataTable />
        </motion.div>
    </div>
    
    );
};

export default Dashboard;       
  {/* <div
    className={clsx(
        styles.greeting,
        "col-lg-12 rounded-lg",
        "flex justify-between"
    )}
>
    <div className={clsx(styles.title, "p-10")}>
        <h4
            className={clsx(
                styles.green,
                "font-semibold text-2xl"
            )}
        >
            Welcom back 👋
            <br />
            <strong style={{ textTransform: "capitalize" }}>
                {user?.firstName + " " + user?.lastName}
            </strong>
        </h4>
        <span className="text-sm">
            That is statistical information for{" "}
            <strong>
                {" "}
                {monthNames[currentMonth - 1]},{" "}
                {currentYear}
            </strong>
        </span>
    </div>
    <div
        className={clsx(
            styles.imgThongKe,
            "flex items-center"
        )}
    >
        <img src={thongKe} alt="" />
    </div>
</div> */}

{/* <div className="col-lg-4 rounded-lg">
    <CardStatiscal
        title={"Total Active Users"}
        amount={users?.totalElements}
    ></CardStatiscal>
</div>
<div className="col-lg-4 rounded-lg">
    <CardStatiscal
        title={"Total Active Courses"}
        amount={courses?.totalElements}
    ></CardStatiscal>
</div>
<div className="col-lg-4 rounded-lg">
    <CardStatiscal
        title={"Total Balance"}
        amount={totalInvoice}
        currency={"VND"}
    ></CardStatiscal>
</div> */}

{/* /?NOTE Table
<div className="col-lg-6 rounded-lg">
    <div className="boxShadow p-4 rounded-lg">
        <div className={clsx("mb-2 pl-6")}>
            <h4 className="text-base font-semibold">
                NEW USER
            </h4>
        </div>
        <hr className="cssHr" />
        <div className={clsx(stylesList.mid, "mt-4")}>
            <div
                className={clsx(
                    styles.titleMid,
                    "row rounded-lg py-2 bg-black text-white"
                )}
            >
                <div className="col-lg-2 self-center">
                    ID
                </div>
                <div className="col-lg-10">User</div>
            </div>
            <div
                className={clsx(
                    stylesList.containerData,
                    "overflow-y-scroll mt-0 max-h-[364px] overflow-x-hidden"
                )}
            >
                {users &&
                    users?.content?.map(
                        (element, index) => {
                            return (
                                <div
                                    key={index}
                                    className={clsx(
                                        stylesList.item,
                                        "row rounded-lg h-[60px]"
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-2"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.name
                                            )}
                                        >
                                            {element.id}
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-10 flex "
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.cssImg
                                            )}
                                        >
                                            <img
                                                src={
                                                    !element.avatar
                                                        ? avatar
                                                        : element.avatar
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div
                                                className={clsx(
                                                    stylesList.name
                                                )}
                                            >
                                                {element.firstName +
                                                    " " +
                                                    element.lastName}
                                            </div>
                                            <div
                                                className={clsx(
                                                    stylesList.categories
                                                )}
                                            >
                                                {
                                                    element.email
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                {users?.content?.length === 0 && (
                    <div
                        className={clsx(
                            stylesList.noData,
                            "flex flex-col justify-center text-center"
                        )}
                    >
                        <img
                            src={noDataIcon}
                            alt=""
                            className={clsx(
                                stylesList.noDataImg,
                                "m-auto w-32"
                            )}
                        />
                        <span>No Data</span>
                    </div>
                )}
            </div>
        </div>
    </div>
</div> */}

{/* <div className="col-lg-6 rounded-lg">
    <div className="boxShadow p-4 rounded-lg">
        <div className={clsx("mb-2 pl-6")}>
            <h4 className="text-base font-semibold uppercase">
                NEW COURSE
            </h4>
        </div>
        <hr className="cssHr" />
        <div className={clsx(stylesList.mid, "mt-4")}>
            <div
                className={clsx(
                    styles.titleMid,
                    "row rounded-lg py-2 bg-black text-white"
                )}
            >
                <div className="col-lg-2 self-center">
                    ID
                </div>
                <div className="col-lg-7">Title</div>
                <div className="col-lg-3">Price</div>
            </div>
            <div
                className={clsx(
                    stylesList.containerData,
                    "overflow-y-scroll mt-0 max-h-[364px] overflow-x-hidden"
                )}
            >
                {courses &&
                    courses?.content?.map(
                        (element, index) => {
                            return (
                                <div
                                    key={index}
                                    className={clsx(
                                        stylesList.item,
                                        "row rounded-lg h-[60px]"
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-2"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.name
                                            )}
                                        >
                                            {element.id}
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-7 flex "
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.cssImg
                                            )}
                                        >
                                            <img
                                                src={
                                                    !element.thumbnail
                                                        ? avatar
                                                        : element.thumbnail
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div
                                                className={clsx(
                                                    stylesList.name,
                                                    "line-clamp-3 text-wrap"
                                                )}
                                            >
                                                {
                                                    element.title
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-3"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.name
                                            )}
                                        >
                                            {element?.price ===
                                            0
                                                ? "Free"
                                                : element.price.toLocaleString() +
                                                  " VND"}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                {courses?.content?.length === 0 && (
                    <div
                        className={clsx(
                            stylesList.noData,
                            "flex flex-col justify-center text-center"
                        )}
                    >
                        <img
                            src={noDataIcon}
                            alt=""
                            className={clsx(
                                stylesList.noDataImg,
                                "m-auto w-32"
                            )}
                        />
                        <span>No Data</span>
                    </div>
                )}
            </div>
        </div>
    </div>
</div> */}

{/* <div className="mx-auto col-lg-10 rounded-lg">
    <div className="boxShadow p-4 rounded-lg">
        <div className={clsx("mb-2 pl-6")}>
            <h4 className="text-base font-semibold uppercase">
                NEW invoice
            </h4>
        </div>
        <hr className="cssHr" />
        <div className={clsx(stylesList.mid, "mt-4")}>
            <div
                className={clsx(
                    styles.titleMid,
                    "row rounded-lg py-2 bg-black text-white"
                )}
            >
                <div className="col-lg-1 self-center">
                    ID
                </div>
                <div className="col-lg-4">Title</div>
                <div className="col-lg-3">Content</div>
                <div className="col-lg-2">Create at</div>
                <div className="col-lg-2">Amount at</div>
            </div>
            <div
                className={clsx(
                    stylesList.containerData,
                    "overflow-y-scroll mt-0 max-h-[364px] overflow-x-hidden"
                )}
            >
                {invoices &&
                    invoices?.content?.map(
                        (element, index) => {
                            return (
                                <div
                                    key={index}
                                    className={clsx(
                                        stylesList.item,
                                        "row rounded-lg h-[60px]"
                                    )}
                                >
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-1"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.name
                                            )}
                                        >
                                            {element.id}
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-4 flex "
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.cssImg
                                            )}
                                        >
                                            <img
                                                src={
                                                    !element
                                                        ?.user
                                                        ?.avatar
                                                        ? avatar
                                                        : element
                                                              .user
                                                              .avatar
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="overflow-hidden">
                                            <div
                                                className={clsx(
                                                    stylesList.name,
                                                    "line-clamp-3 text-wrap"
                                                )}
                                            >
                                                {element
                                                    ?.user
                                                    ?.firstName +
                                                    " " +
                                                    element
                                                        ?.user
                                                        ?.lastName}
                                            </div>
                                            <div
                                                className={clsx(
                                                    stylesList.categories
                                                )}
                                            >
                                                {
                                                    element.methodPayment
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-3"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.name,
                                                "text-wrap line-clamp-3"
                                            )}
                                        >
                                            {
                                                element?.content
                                            }
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-2"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.name
                                            )}
                                        >
                                            {element?.createDate?.toLocaleTimeString()}
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            stylesList.field,
                                            "col-lg-2"
                                        )}
                                    >
                                        <div
                                            className={clsx(
                                                stylesList.name
                                            )}
                                        >
                                            {element?.totalInvoice.toLocaleString()}{" "}
                                            VND
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    )}
                {invoices?.content?.length === 0 && (
                    <div
                        className={clsx(
                            stylesList.noData,
                            "flex flex-col justify-center text-center"
                        )}
                    >
                        <img
                            src={noDataIcon}
                            alt=""
                            className={clsx(
                                stylesList.noDataImg,
                                "m-auto w-32"
                            )}
                        />
                        <span>No Data</span>
                    </div>
                )}
            </div>
        </div>
    </div>
</div> */}