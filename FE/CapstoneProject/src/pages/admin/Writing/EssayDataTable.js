import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { getAllEssays } from "../../../api/apiService/dataService";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";

const EssayDataTable = () => {
  const [essays, setEssays] = useState([]);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true,
    },
    {
      field: "score",
      headerName: "Score",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "submissionTime",
      headerName: "Submission Time",
      width: 200,
      sortable: false,
    },
  ];

  useEffect(() => {
    getAllEssays().then((data) => {
      const formattedData = data.map((essay) => ({
        ...essay,
        submissionTime: dayjs(essay.submissionTime).format("YYYY-MM-DD HH:mm"), // Format datetime
      }));
      setEssays(formattedData);
    });
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        width: "80%",
        margin: "0 auto",
        padding: "16px",
        background: "linear-gradient(135deg, #ffffff, #f9f9f9)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        align="center"
        sx={{
          marginBottom: "16px",
          fontWeight: "bold",
          background: "linear-gradient(to right, #ff7a59, #ff5a59)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        All Submitted Essays
      </Typography>

      {/* DataGrid */}
      <DataGrid
        rows={essays}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id}
        sx={{
          background: "white",
          border: "none",
          borderRadius: "8px",
          "& .MuiDataGrid-cell": {
            color: "#333",
            "&:hover": {
              backgroundColor: "#fef5e7",
            },
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#ff7a59",
            color: "black",
            fontWeight: "bold",
            borderRadius: "8px 8px 0 0",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#ff7a59",
            color: "black",
            borderRadius: "0 0 8px 8px",
          },
        }}
      />
    </Box>
  );
};

export default EssayDataTable;
