import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { Assessment, Star } from "@mui/icons-material";
import { getAdminEssayStatistics } from "../../../api/apiService/dataService";

const AdminEssayStatistics = () => {
  const [statistics, setStatistics] = useState({ totalEssayCount: 0, averageScore: 0 });

  useEffect(() => {
    getAdminEssayStatistics().then((data) => setStatistics(data));
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "linear-gradient(135deg, #A18CD1, #FBC2EB)", // Gradient background
        color: "#FFFFFF",
        overflow: "hidden",
        position: "relative",
      }}
      component={motion.div}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          background: "linear-gradient(135deg, #FFFFFF, #FFD1DC)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        Admin Essay Statistics
      </Typography>

      {/* Statistics Section */}
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        alignItems="center"
        justifyContent="center"
        sx={{
          mt: 2,
          color: "#FFFFFF",
        }}
      >
        {/* Total Submissions */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            p: 2,
            width: "100%",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 3,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
            },
          }}
        >
          <Assessment sx={{ fontSize: 40, color: "#FFD700" }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Total Submissions
            </Typography>
            <Typography variant="h5">{statistics.totalEssayCount}</Typography>
          </Box>
        </Box>

        {/* Average Score */}
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          sx={{
            p: 2,
            width: "100%",
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: 3,
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "translateY(-4px)",
            },
          }}
        >
          <Star sx={{ fontSize: 40, color: "#FFD700" }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              Average Score
            </Typography>
            <Typography variant="h5">
              {statistics.averageScore?.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default AdminEssayStatistics;
