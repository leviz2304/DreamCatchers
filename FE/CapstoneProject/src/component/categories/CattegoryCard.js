import React, { useState, useEffect } from "react";
import * as dataApi from "../../api/apiService/dataService";
import { InfiniteMovingCards } from "../InfiniteMovingCards";

const CategoryCard = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await dataApi.getCategories();
        setCategories(
          result.content.map((category) => ({
            name: category.name,
          }))
        );
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
        <div className="text-center text-gray-500">Loading categories...</div>
      ) : (
        <InfiniteMovingCards
          items={categories}
          direction="left"
          speed="normal"
          className="mt-6"
        />
      )}
    </div>
  );
};

export default CategoryCard;
