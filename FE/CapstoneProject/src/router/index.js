import SignUp from "../pages/signUp";
import Login from "../pages/login";
import LandingPage from "../pages/landing";
import AdminPage from "../pages/admin";
import NotFoundPage from "../pages/notFound";
import ListCourse from "../pages/admin/Course/list";
import CreateCourse from "../pages/admin/Course/create";
import EditCourse from "../pages/admin/Course/edit";
import DetailCourseAdmin from "../pages/admin/Course/detail";
import DetailCourse from "../pages/course/detail";
import Course from "../pages/course";
import ListCategory from "../pages/admin/Category/list";
import CategoryEdit from "../pages/admin/Category/edit";
import CreateCategory from "../pages/admin/Category/create";
import HistoryDeleted from "../pages/admin/Course/historyDeleted";
import HistoryDeletedCategory from "../pages/admin/Category/historyDeleted";
import ListUser from "../pages/admin/user/list";
import ListDeletedUser from "../pages/admin/user/historyDeleted";
import userProfile from "../pages/user/userprofile/index";
import Payment from "../pages/payment";
import SuccessPayment from "../pages/payment/success";
import FailurePayment from "../pages/payment/failure";
import AdminView from "../pages/admin/user/userProfileAdmin";
import MyCourses from "../pages/user/usercourse/index";
import ListInvoice from "../pages/admin/invoice/list";
import ListDeleteInvoice from "../pages/admin/invoice/historyDelete";
import CreateUser from "../pages/admin/user/create";
import AdminDetailCourse from "../pages/admin/Course/detail";
import Post from "../pages/Post";
import SubContent from "../pages/Post/create/subContent";
import CreatePost from "../pages/Post/create";
import WritingTaskList from "../pages/admin/Test/WritingTask/List";
import WritingTaskCreate from "../pages/admin/Test/WritingTask/Create";
import WritingTaskEdit from "../pages/admin/Test/WritingTask/Edit";
import WritingSubmission from "../pages/IELTS/WritingSubmission"
const publicRoutes = [
    { path: "/", component: LandingPage },
    { path: "/sign-up", component: SignUp },
    { path: "/login", component: Login },
    { path: "*", component: NotFoundPage },
    { path: "/course/:id", component: Course },
    { path: "/posts/", component: Post },
    // { path: "/search/:query", component: SearchResults },
];

const userRoutes = [
    { path: "/course/detail/:id", component: DetailCourse },
    {
        path: "/course/detail/:id/openComment",
        component: DetailCourse,
    },
    { path: "/me/my-courses", component: MyCourses },
    { path: "/course/payment/:id", component: Payment },
    { path: "/payment/success", component: SuccessPayment },
    { path: "/payment/failure", component: FailurePayment },
    { path: "me/profile/:email", component: userProfile },
    { path: "me/post/create", component: CreatePost },
    { path: "me/post/create/sub", component: SubContent },
    { path: "IELTS/Writing/Test", component: WritingSubmission },
];

const adminRoutes = [
    { path: "/admin", component: AdminPage },
    { path: "/admin/course/list", component: ListCourse },
    { path: "/admin/course/create", component: CreateCourse },
    { path: "/admin/course/edit/:id", component: EditCourse },
    {
        path: "/admin/course/detail/:id",
        component: AdminDetailCourse,
    },
    { path: "/admin/course/historyDelete", component: HistoryDeleted },
    { path: "/admin/category/list", component: ListCategory },
    { path: "/admin/category/create", component: CreateCategory },
    { path: "/admin/category/edit/:id", component: CategoryEdit },
    {
        path: "/admin/category/historyDelete",
        component: HistoryDeletedCategory,
    },
    { path: "/admin/writing-task/list", component: WritingTaskList  },
    { path: "/admin/writing-task/create", component: WritingTaskCreate },
    { path: "/admin/writing-task/edit/:id", component: WritingTaskEdit },
    { path: "/admin/user/list", component: ListUser },
    { path: "/admin/user/create", component: CreateUser },
    { path: "/admin/user/edit/:id", component: EditCourse },
    { path: "/admin/user/detail/:id", component: DetailCourseAdmin },
    { path: "/admin/user/historyDelete", component: ListDeletedUser },
    { path: "/admin/user/view/:email", component: AdminView },

    { path: "/admin/invoice/list", component: ListInvoice },
    { path: "/admin/invoice/create", component: CreateCourse },
    { path: "/admin/invoice/historyDelete", component: ListDeleteInvoice },
];

export { publicRoutes, adminRoutes, userRoutes };
