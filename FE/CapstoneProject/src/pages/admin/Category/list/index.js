// ListCategory.jsx
import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select as MUISelect,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  InputAdornment, // Đã thêm
  Box, // Đã thêm để thay thế Grid nếu cần
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { debounce } from "lodash";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import clsx from "clsx";
import styles from "./ListCategory.module.scss"; // Đảm bảo đường dẫn đúng
import * as dataApi from "../../../../api/apiService/dataService"; // Đảm bảo đường dẫn đúng
import noDataIcon from "../../../../assets/images/ic_noData.svg"; // Đã thêm

const rowsPerPageOptions = [5, 10, 25];

const ListCategory = () => {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      search: "",
      rowsPerPage: rowsPerPageOptions[0],
    },
  });

  const [categories, setCategories] = useState([]);
  const [deletedModalOpen, setDeletedModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [totalData, setTotalData] = useState(0);
  const [page, setPage] = useState(1); // Bắt đầu từ trang 1
  const [isLoading, setIsLoading] = useState(false);

  const searchTerm = watch("search");
  const rowsPerPage = watch("rowsPerPage");

  // Debounced search handler
  const handleSearch = debounce((value) => {
    setPage(1); // Reset về trang đầu tiên khi tìm kiếm
    fetchCategories(value, rowsPerPage, 1);
  }, 500);

  // Fetch categories based on search, pagination, and rows per page
  const fetchCategories = async (search = "", limit = rowsPerPage, currentPage = page) => {
    try {
      setIsLoading(true);
      let response;
      if (search) {
        response = await dataApi.getCategoryByTitle(search, currentPage - 1, limit);
      } else {
        response = await dataApi.getAllCategories(currentPage - 1, limit);
      }
      setCategories(response.content.content);
      setTotalData(response.content.totalElements);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and fetch when search term or rows per page change
  useEffect(() => {
    fetchCategories(searchTerm, rowsPerPage, page);
  }, [searchTerm, rowsPerPage, page]);

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    const value = event.target.value;
    setValue("rowsPerPage", value);
    setPage(1); // Reset về trang đầu tiên khi thay đổi số hàng trên mỗi trang
  };

  // Handle search input change
  const onSearchChange = (e) => {
    const value = e.target.value;
    handleSearch(value);
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeletedModalOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeletedModalOpen(false);
    setDeleteId(null);
  };

  // Handle category deletion
  const handleDeleteCategory = async () => {
    try {
      await dataApi.softDeleteCategoryById(deleteId);
      toast.success("Category removed successfully.");
      closeDeleteDialog();
      fetchCategories(searchTerm, rowsPerPage, page);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to remove category.");
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="container mt-5 mx-14">
        <div className="wrapMainDash">
          {/* Header */}
          <div className={clsx(styles.topMain, "flex justify-between items-center mb-6")}>
            <Typography variant="h4" component="h2">
              List Categories
            </Typography>
            <Link to="/admin/category/create">
              <Button variant="contained" color="primary" startIcon={<AddIcon />}>
                New Category
              </Button>
            </Link>
          </div>

          {/* Search and Rows Per Page */}
          <div className={clsx(styles.formGroup, "mb-6")}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Search Field */}
              <Controller
                name="search"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Search by Title"
                    variant="outlined"
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                    onChange={(e) => {
                      field.onChange(e); // Cập nhật giá trị trong react-hook-form
                      onSearchChange(e); // Gọi hàm tìm kiếm
                    }}
                  />
                )}
              />
              {/* Rows Per Page Select */}
              <FormControl variant="outlined" size="small" className="w-40">
                <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
                <Controller
                  name="rowsPerPage"
                  control={control}
                  render={({ field }) => (
                    <MUISelect
                      {...field}
                      labelId="rows-per-page-label"
                      label="Rows per page"
                      onChange={handleRowsPerPageChange}
                    >
                      {rowsPerPageOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </MUISelect>
                  )}
                />
              </FormControl>
            </div>
          </div>

          {/* Table */}
          <TableContainer component={Paper} className="shadow-lg rounded-lg">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Create At</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body1">Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : categories.length > 0 ? (
                  categories.map((category) => {
                    const dateTime = new Date(category.date);
                    const date = dateTime.toLocaleDateString();
                    const time = dateTime.toLocaleTimeString();

                    return (
                      <TableRow key={category.id}>
                        <TableCell>{category.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <Typography variant="subtitle1">{category.name}</Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {date} <br /> {time}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex items-center gap-2 justify-center">
                            <Link to={`/admin/category/detail/${category.id}`}>
                              <IconButton color="primary">
                                <VisibilityIcon />
                              </IconButton>
                            </Link>
                            <Link to={`/admin/category/edit/${category.id}`}>
                              <IconButton color="warning">
                                <EditIcon />
                              </IconButton>
                            </Link>
                            <IconButton color="error" onClick={() => openDeleteDialog(category.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <div className="flex flex-col items-center">
                        <img src={noDataIcon} alt="No Data" className="w-32 mb-4" />
                        <Typography variant="body1">No Data</Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
            <Typography variant="body2">
              Showing {page * rowsPerPage - rowsPerPage + 1}-
              {Math.min(page * rowsPerPage, totalData)} of {totalData}
            </Typography>
            <Pagination
              count={Math.ceil(totalData / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deletedModalOpen}
          onClose={closeDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Delete Category</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteCategory} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ListCategory;
