import React, { useState, useEffect } from "react";
import { BentoGrid } from "../BentoGridDemo/BentoGrid";
import { BentoGridItem } from "../BentoGridDemo/BentoGridItem";
import * as dataApi from "../../api/apiService/dataService.js";
import { toast } from "sonner";

const BentoGridDemo = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await dataApi.getCourses();
        setCourses(result);
        
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"
            ></div>
          ))}
        </div>
      ) : (
        <BentoGrid>
          {courses.map((course) => (
            <BentoGridItem
              key={course.id}
              courseId={course.id}
              title={course.title}
              header={
                <img
                  src={course.thumbnailUrl || "https://via.placeholder.com/150"}
                  alt={course.title}
                  className="h-32 w-full object-cover rounded-md"
                />
              }
              icon={
                <div className="flex items-center text-orange-500 font-semibold">
                  <span>★ {course.rating || "5.0"}</span>
                  
                </div>
              }
              categories={course.categoryIds} 
            />
          ))}
        </BentoGrid>
      )}
    </div>
  );
};

export default BentoGridDemo;
