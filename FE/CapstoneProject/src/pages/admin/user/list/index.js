// ListUser.jsx
import React, { Fragment, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TextField,
  Select as MUISelect,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { debounce } from "lodash";
import { toast } from "sonner";
import * as authApi from "../../../../api/apiService/authService";
import clsx from "clsx";
import styles from "./ListUser.module.scss"; // Đảm bảo đường dẫn đúng

const rowsPerPageOptions = [5, 10, 25];

const ListUser = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues: {
      role: "All",
      search: "",
    },
  });

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([
    { id: "-1", name: "All" },
    { id: "1", name: "INSTRUCTOR" },
    { id: "2", name: "ADMIN" },
    { id: "3", name: "USER" },
  ]);
  const [selectedRole, setSelectedRole] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1); // Bắt đầu từ trang 1
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [totalData, setTotalData] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users based on filters
  const fetchUsers = async (filters) => {
    try {
      setIsLoading(true);
      const { role, search } = filters;
      let response;

      if (search) {
        response = await authApi.getUserByName(search, page - 1, rowsPerPage);
      } else if (role && role !== "All") {
        response = await authApi.getUserByRole(role, page - 1, rowsPerPage);
      } else {
        response = await authApi.getUserByPage(page - 1, rowsPerPage);
      }

      setUsers(response.content);
      setTotalData(response.content.totalElements);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users!");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and fetch when filters change
  useEffect(() => {
    fetchUsers({ role: selectedRole, search: searchTerm });
  }, [page, rowsPerPage, selectedRole, searchTerm]);

  // Debounced search handler
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on search
  }, 500);

  // Handle role change
  const handleRoleChange = (event) => {
    const value = event.target.value;
    setSelectedRole(value);
    setPage(1); // Reset to first page on filter
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setPage(1); // Reset to first page on change
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      await authApi.softDeleteUser(deleteId);
      toast.success("User deleted successfully");
      fetchUsers({ role: selectedRole, search: searchTerm });
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" component="h1">
            List of Users
          </Typography>
          <Link to="/admin/user/create">
            <Button variant="contained" color="primary">
              New User
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSubmit((data) => {
            setSelectedRole(data.role);
            setSearchTerm(data.search);
            setPage(1);
          })}
          className="flex flex-col md:flex-row items-center gap-4 mb-6"
        >
          {/* Role Filter */}
          <FormControl variant="outlined" className="min-w-[200px]">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <MUISelect
                  {...field}
                  labelId="role-select-label"
                  label="Role"
                  onChange={(e) => {
                    field.onChange(e);
                    handleRoleChange(e);
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.name}>
                      {role.name}
                    </MenuItem>
                  ))}
                </MUISelect>
              )}
            />
          </FormControl>

          {/* Search Input */}
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Search by name or email"
                variant="outlined"
                onChange={(e) => {
                  field.onChange(e);
                  handleSearch(e.target.value);
                }}
                className="min-w-[300px]"
              />
            )}
          />

          {/* Reset Filters */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              reset({
                role: "All",
                search: "",
              });
              setSelectedRole("All");
              setSearchTerm("");
              setPage(1);
            }}
          >
            Reset
          </Button>
        </form>

        {/* Table */}
        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={user.avatar || "/path/to/default/avatar.jpg"} // Đảm bảo đường dẫn đúng
                          alt={user.firstName + " " + user.lastName}
                        />
                        <div>
                          <Typography variant="subtitle1">
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.phoneNumber || <Typography color="error">Empty</Typography>}
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell align="center">
                      <div className="flex items-center gap-2 justify-center">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/admin/user/view/${user.id}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="warning"
                          onClick={() => navigate(`/admin/user/edit/${user.id}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Typography variant="body2">
            Showing{" "}
            {page * rowsPerPage - rowsPerPage + 1}-
            {Math.min(page * rowsPerPage, totalData)} of {totalData}
          </Typography>
          <div className="flex items-center gap-2">
            <FormControl variant="outlined" className="min-w-[120px]">
              <InputLabel id="rows-per-page-label">Rows per page</InputLabel>
              <Controller
                name="rowsPerPage"
                control={control}
                render={({ field }) => (
                  <MUISelect
                    {...field}
                    labelId="rows-per-page-label"
                    label="Rows per page"
                    value={rowsPerPage}
                    onChange={(e) => {
                      field.onChange(e);
                      handleRowsPerPageChange(e);
                    }}
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
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Delete User</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default ListUser;
