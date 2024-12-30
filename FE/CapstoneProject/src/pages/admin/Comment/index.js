import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { getRecentComments } from "../../../api/apiService/dataService";

const RecentComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getRecentComments().then((data) => setComments(data));
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
        background: "linear-gradient(135deg, #FF9A8B, #FF6A88, #FF99AC)",
        color: "#FFFFFF",
        maxWidth: 600,
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          fontWeight: 700,
          textAlign: "center",
          background: "linear-gradient(135deg, #FFFFFF, #FFD1DC)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 3,
        }}
      >
        Recent Comments
      </Typography>

      {/* Comment List */}
      <List>
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <ListItem
              sx={{
                display: "flex",
                alignItems: "flex-start", // Align avatar with text
                background: "linear-gradient(135deg, #FFF7F7, #FFEBE9)",
                borderRadius: 2,
                mb: 2,
                p: 2,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={comment.avatar}
                  alt={comment.userName}
                  sx={{
                    width: 56,
                    height: 56,
                    background: "linear-gradient(135deg, #FF9A8B, #FF6A88)",
                    color: "#FFF",
                  }}
                />
              </ListItemAvatar>
              <Box
                sx={{
                  flex: 1, // Take remaining space
                  ml: 2, // Add spacing between avatar and text
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5, // Adjust spacing between text blocks
                }}
              >
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    color: "#333",
                  }}
                >
                  {comment.userName} ({comment.userEmail})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#555",
                    lineHeight: 1.5,
                  }}
                >
                  {comment.content}
                </Typography>
                {/* <Typography
                  variant="caption"
                  sx={{
                    color: "#777",
                  }}
                >
                  On Lesson: {comment.lessonId || "N/A"}
                  {comment.replyToUser && ` | Reply to: ${comment.replyToUserName}`}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#999",
                  }}
                >
                  {new Date(comment.date).toLocaleString()}
                </Typography> */}
              </Box>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Paper>
  );
};

export default RecentComments;
