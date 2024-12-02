import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from "@mui/material";
import Select from "react-select";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { toast } from "sonner";
import Modal from "../../../../component/modal";
import * as dataApi from "../../../../api/apiService/dataService";

const ListCourse = () => {
  const [deletedModalOpen, setDeletedModalOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [options, setOptions] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [selected, setSelected] = useState(5); // Rows per page
  const [page, setPage] = useState(0);

  const fetchCourses = async (page, size) => {
    try {
      const result = await dataApi.getAllCourseAdmin(page, size);
      setCourses(result.content.content);
      setTotalData(result.content.totalElements);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await dataApi.getAllCategories(0, 99999);
        const result = await dataApi.getAllCourseAdmin(page, selected);
        categories.content.content.push({ id: "-1", name: "All" });
        setCourses(result.content.content);
        setTotalData(result.content.totalElements);
        setOptions(categories.content.content);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [page, selected]);

  const handleRemoveCourse = async () => {
    try {
      await dataApi.softDeleteCourse(deleteId);
      toast.success("Course deleted successfully");
      fetchCourses(page, selected);
      setDeletedModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handleCategoryChange = async (selectedOption) => {
    const result = await dataApi.getCoursesByCategory(selectedOption.id, page, selected);
    setCourses(result.content.content);
    setTotalData(result.content.totalElements);
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && page * selected + selected < totalData) {
      setPage(page + 1);
    } else if (direction === "prev" && page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">List of Courses</h1>
          <Link to="/admin/course/create">
            <Button variant="contained" color="primary" startIcon={<ChevronRight />}>
              New Course
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <Select
            options={options}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.id}
            onChange={handleCategoryChange}
            className="w-1/3"
          />
          <input
            type="text"
            placeholder="Search..."
            className="border border-gray-300 p-2 rounded-lg w-1/3"
            onChange={(e) => {
              const fetchSearch = async () => {
                const result = await dataApi.getCourseByName(e.target.value, page, selected);
                setCourses(result.content.content);
                setTotalData(result.content.totalElements);
              };
              fetchSearch();
            }}
          />
        </div>

        {/* Table */}
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Create Date</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <Avatar src={course.thumbnail} alt={course.title} />
                      <div>
                        <p className="font-bold">{course.title}</p>
                        <p className="text-gray-500">{course.category?.join(", ")}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(course.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {course.price === 0 ? "Free" : `${course.price.toLocaleString("vi-VN")} VND`}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/course/detail/${course.id}`}>
                        <Button variant="outlined" size="small">
                          View
                        </Button>
                      </Link>
                      <Link to={`/admin/course/edit/${course.id}`}>
                        <Button variant="outlined" size="small" color="warning">
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => {
                          setDeleteId(course.id);
                          setDeletedModalOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <p>
            Showing {page * selected + 1}-
            {Math.min(totalData, page * selected + selected)} of {totalData}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="contained"
              size="small"
              onClick={() => handlePageChange("prev")}
              disabled={page === 0}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handlePageChange("next")}
              disabled={page * selected + selected >= totalData}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {deletedModalOpen && (
        <Modal
          isOpen={deletedModalOpen}
          closeModal={() => setDeletedModalOpen(false)}
          title="Delete Course"
          description="Are you sure you want to delete this course?"
          handleRemove={handleRemoveCourse}
        />
      )}
    </div>
  );
};

export default ListCourse;
