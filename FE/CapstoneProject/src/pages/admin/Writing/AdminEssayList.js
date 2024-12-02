import React, { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { getAllEssays } from "../../../api/apiService/dataService";

const AdminEssayList = () => {
  const [essays, setEssays] = useState([]);

  useEffect(() => {
    getAllEssays().then((data) => setEssays(data));
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 4,
        background: "linear-gradient(135deg, #A1C4FD, #C2E9FB)",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          fontWeight: 700,
          textAlign: "center",
          background: "linear-gradient(to right, #6A11CB, #2575FC)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        All User Essays
      </Typography>

      {/* List of Essays */}
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
        {essays.map((essay, index) => (
          <motion.li
            key={essay.id}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2, duration: 0.5 }}
            style={{ marginBottom: "1rem" }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                borderRadius: 4,
                background: "linear-gradient(135deg, #FFF1EB, #F9D423)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                },
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", color: "#333", mb: 1 }}
              >
                User: {essay.email}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 0.5 }}>
                <strong>Submission Time:</strong>{" "}
                {new Date(essay.submissionTime).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ color: "#555", mb: 0.5 }}>
                <strong>Score:</strong> {essay.score}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#777", overflowWrap: "break-word" }}
              >
                <strong>Content:</strong> {essay.content.slice(0, 100)}...
              </Typography>
            </Paper>
          </motion.li>
        ))}
      </Box>
    </Paper>
  );
};

export default AdminEssayList;
