import React, { useState, useEffect } from "react";
import { BsFilter, BsSearch } from "react-icons/bs";
import { getAllCategories } from "../../../../api/apiService/dataService";

const FilterSortBar = ({ onFilterChange, onSearchChange }) => {
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories(0, 99);
        setCategories(res.content.content); // Adjust according to API response structure
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    const updatedSelectedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(updatedSelectedCategories);
    setActiveFilters(updatedSelectedCategories.length);
    onFilterChange(updatedSelectedCategories);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value); // Notify the parent of search changes
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const resetFilter = () => {
    setSelectedCategories([]);
    setActiveFilters(0);
    onFilterChange([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-2">
      {/* Filter Button */}
      <div className="relative">
        <button
          className="flex items-center bg-orange-100 px-4 py-2 rounded-lg text-orange-700 font-semibold text-sm"
          onClick={toggleDropdown}
        >
          <BsFilter className="mr-2" />
          Filter
          {activeFilters > 0 && (
            <span className="ml-2 bg-orange-500 text-white rounded-full px-2 py-1 text-xs">
              {activeFilters}
            </span>
          )}
        </button>

        {/* Dropdown Filter Menu */}
        {isDropdownOpen && (
          <div className="absolute mt-2 bg-white rounded-lg shadow-lg w-64 z-10 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Filter by Categories
              </h3>
              <button
                onClick={resetFilter}
                className="text-xs text-blue-500 underline"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                    className="form-checkbox text-orange-500"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="flex items-center w-1/2 relative">
        <BsSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchInput}
          className="w-full pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
};

export default FilterSortBar;
