import { cn } from "../../utils/cn";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as dataApi from "../../api/apiService/dataService.js";
import { toast } from "sonner";
import Badge from "./Badge.js";
export const BentoGridItem = ({ 
  className, 
  title, 
  description, 
  header, 
  icon, 
  courseId, 
  categories = []
}) => {
  const user = useSelector((state) => state.login.user);
  const navigate = useNavigate();

  const handleGoToCourse = async () => {
    if (!user) {
      toast.info("Please login to enroll in this course");
      sessionStorage.setItem("prevPath", window.location.pathname);
      navigate("/login");
      return;
    }

    try {
      const isEnrolledResponse = await dataApi.checkEnrollment(courseId, user.id);
      // isEnrolledResponse = { enrolled: true/false }
      const isEnrolled = isEnrolledResponse.enrolled;

      if (isEnrolled) {
        toast.success("You are already enrolled in this course. Redirecting...");
        navigate(`/course/detail/${courseId}`);
      } else {
        navigate(`/course/${courseId}`);
      }
    } catch (error) {
      toast.error("Failed to check enrollment status. Please try again.");
      console.error("Error checking enrollment:", error);
    }
  };

  return (
    <div
      className={cn(
        "h-[350px] rounded-xl  group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent flex flex-col justify-between mb-6",
        className
      )}
    >
      {header}
      {/* <div className="mb-4">
        {categories.map((category, index) => (
          <Badge key={index} keyData={category.id}>
            {category.id}
          </Badge>
        ))}
      </div> */}
      <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
        {description}
      </div>
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <button
          type="button"
          onClick={handleGoToCourse}
          className="mt-4 w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-orange-500 hover:bg-orange-600 transition"
        >
          Get It Now
        </button>
      </div>
    </div>
  );
};

export default BentoGridItem;