import SignUp from "../pages/signUp";
import Login from "../pages/login";
import LandingPage from "../pages/landing";
import AdminPage from "../pages/admin";
import NotFoundPage from "../pages/notFound";

import ListUser from "../pages/admin/user/list";
import userProfile from "../pages/user/userprofile/index";
import AdminView from "../pages/admin/user/userProfileAdmin";
import MyCourses from "../pages/user/usercourse/index";
import CreateUser from "../pages/admin/user/create";

import WritingTaskList from "../pages/admin/Test/WritingTask/List";
import WritingTaskCreate from "../pages/admin/Test/WritingTask/Create";
import WritingTaskEdit from "../pages/admin/Test/WritingTask/Edit";
import WritingSubmission from "../pages/IELTS/WritingSubmission";
import UserHome from "../pages/user/courseFilterPage";
import PracticeVocabulary from "../pages/IELTS/Quizlet/PracticeVocabulary";
import CreateVocabularySet from "../pages/IELTS/Quizlet/CreateVocabularySet";
import VocabularySetList from "../pages/IELTS/Quizlet/VocabularySetList";
import FlashcardList from "../pages/IELTS/Quizlet/component/FlashcardList";
import SpeakingDashboard from "../pages/admin/Speaking/components/SpeakingDashboard";
import SpeakingTask2 from "../pages/admin/Speaking/components/SpeakingTask2";
import EditVocabularySet from "../pages/IELTS/Quizlet/EditVocabularySet";
import SpeakingTopics from "../pages/IELTS/index";
import EssayHistory from "../pages/admin/Writing/EssayHistory";
import EssayDetail from "../pages/admin/Writing/EssayDetail";

import CreateCourse from "../pages/admin/Course/CoursesPage/CourseCreatePage";
import ListCourse from "../pages/admin/Course/CoursesPage/CoursePage";       // Đã uncomment
import EditCourse from "../pages/admin/Course/CoursesPage/CourseEditPage";       // Đã uncomment
import CourseDetail from "../pages/admin/Course/detail/CourseDetail"; // Đã uncomment
import MyReportPage from '../pages/myReport/MyReportPage';
import TopicList from "../component/Topics/TopicList";
import TopicCreate from "../component/Topics/TopicCreate";
import TopicEdit from "../component/Topics/TopicEdit";

import SentenceList from "../component/Sentences/SentenceList";
import SentenceCreate from "../component/Sentences/SentenceCreate";
import SentenceEdit from "../component/Sentences/SentenceEdit";
// Giả sử bạn có trang CategoryList
import CategoryList from "../pages/admin/Category/list";
import CategoryCreate from "../pages/admin/Category/create";
import CategoryEdit from "../pages/admin/Category/edit";
import Course from "../pages/course";
import DetailCourse from "../pages/course/detail";
import PronunciationPracticePage from "../pages/Pronunciation/PronunciationPracticePage";
import SpeakingReportPage from "../pages/myReport/SpeakingReportPage";
const publicRoutes = [
    { path: "/", component: LandingPage },
    { path: "/sign-up", component: SignUp },
    { path: "/login", component: Login },
    { path: "*", component: NotFoundPage },
    { path: "/courses", component: UserHome },
];

const userRoutes = [
    { path: "/essay/history", component: EssayHistory },
    { path: "/essay/history/:essayId", component: EssayDetail },
    { path: "/me/my-courses", component: MyCourses },
    { path: "/me/profile/:email", component: userProfile },
    { path: "/IELTS/Writing/Test", component: WritingSubmission },
    { path: "/IELTS/VOCAB/create", component: CreateVocabularySet },
    { path: "/IELTS/VOCAB/learn/:setId", component: PracticeVocabulary },
    { path: "/IELTS/VOCAB/sets", component: VocabularySetList },
    { path: "/IELTS/VOCAB/sets/:setId/flashcards", component: FlashcardList },
    { path: "/speaking-task/:questionId", component: SpeakingTask2 },
    { path: "/sets/:setId/edit", component: EditVocabularySet },
    { path: "/IELTS", component: SpeakingTopics },
    { path: "/course/:id", component: Course },
    { path: "/course/detail/:id", component: DetailCourse },
    { path: "/my-report", component: MyReportPage },
    { path: "/pronunciation-practice", component: PronunciationPracticePage },
    { path: "/speaking-report", component: SpeakingReportPage },

    
];

const adminRoutes = [
    { path: "/admin", component: AdminPage },

    { path: "/admin/category/list", component: CategoryList },
    { path: "/admin/category/create", component: CategoryCreate },
    { path: "/admin/category/edit/:id", component: CategoryEdit },
    { path: "/admin/writing-task/list", component: WritingTaskList },
    { path: "/admin/writing-task/create", component: WritingTaskCreate },
    { path: "/admin/writing-task/edit/:id", component: WritingTaskEdit },

    { path: "/admin/user/list", component: ListUser },
    { path: "/admin/user/create", component: CreateUser },
    { path: "/admin/user/view/:email", component: AdminView },

    { path: "/admin/speaking-dashboard", component: SpeakingDashboard },

    { path: "/admin/courses", component: ListCourse },
    { path: "/admin/courses/create", component: CreateCourse },
    { path: "/admin/courses/:id/edit", component: EditCourse },
    { path: "/admin/courses/detail/:id", component: CourseDetail },
    { path: "/admin/topics/list", component: TopicList },
    { path: "/admin/topics/create", component: TopicCreate },
    { path: "/admin/topics/edit/:id", component: TopicEdit },
    { path: "/admin/sentences/list", component: SentenceList },
    { path: "/admin/sentences/create", component: SentenceCreate },
    { path: "/admin/sentences/edit/:id", component: SentenceEdit },
];

export { publicRoutes, adminRoutes, userRoutes };
