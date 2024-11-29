import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as dataApi from "../../api/apiService/dataService"

const TopCategories = ({ category }) => {
  return (
    <div className="bg-orange-100 shadow-md w-full h-20  rounded-lg p-4 m-2 lg:w-1/4 px-28 lg:justify-center">
      <h3 className="text-lg font-bold mb-2">{category.name}</h3>
      {/* <p className="text-gray-600">{category.count} Courses</p> */}
    </div>
  );
};

const CategoryCard = () => {
  const dispatch=useDispatch()
  const [categories,setCategories]=useState([])
  console.log(categories)
  const [courses, setCourses] = useState([]);
  useEffect(() => {
      const fetchApi = async () => {
          try {
              const result = await dataApi.getAllCategories(0, 100);
              console.log("Hello"+result.content)
              setCategories(result.content.content);
          } catch (error) {
              console.log("error: " + error);
          }
      };
      fetchApi();
  }, []);
  return (
    <div className="flex flex-wrap justify-center mb-6 sm:w-full">
      {categories &&categories.map((category,index) => (
        <TopCategories key={category.name} category={category} />
      ))}
    </div>
  );
};

export default CategoryCard;
