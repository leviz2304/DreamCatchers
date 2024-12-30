import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  useTheme,
  Box,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import { School, People, LibraryBooks, Article } from "@mui/icons-material";
import RecentComments from "./Comment";
import AdminEssayStatistics from "./Writing/AdminStatistics";
import EssayDataTable from "./Writing/EssayDataTable";
import { getAdminStatistics } from "../../api/apiService/dataService";
import {getRecentComments} from "../../api/apiService/dataService"
const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalCourses: 1,
    totalStudents: 1,
    totalInstructors: 1,
    totalPosts: 1,
  });
  const [recentComments, setRecentComments] = useState([]);

  const theme = useTheme();

  const cardAnimation = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  };

  const stats = [
    // {
    //   title: "Total Courses",
    //   value: statistics.totalCourses,
    //   icon: <LibraryBooks />,
    //   gradient: "linear-gradient(135deg, #FF7A85, #FF3D54)",
    // },
    {
      title: "Total Students",
      value: statistics.totalStudents,
      icon: <People />,
      gradient: "linear-gradient(135deg, #FFB974, #FF9900)",
    },
    {
      title: "Total Instructors",
      value: statistics.totalInstructors,
      icon: <School />,
      gradient: "linear-gradient(135deg, #74D3FF, #007BFF)",
    },
    // {
    //   title: "Total Posts",
    //   value: statistics.totalPosts,
    //   icon: <Article />,
    //   gradient: "linear-gradient(135deg, #A5FF72, #00D84A)",
    // },
  ];
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await getAdminStatistics();
        setStatistics(response);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    const fetchRecentComments = async () => {
      try {
        const response = await getRecentComments(5); // Get 5 most recent comments
        setRecentComments(response);
      } catch (error) {
        console.error("Failed to fetch recent comments:", error);
      }
    };

    fetchStatistics();
    fetchRecentComments();
  }, []);

  return (
    <Box
      sx={{
        background: "#240E88",
        minHeight: "100vh",
        p: 4,
      }}
    >
      {/* Statistics Section */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "repeat(2, 1fr)", md: "repeat(2, 1fr)" }}
        gap={3}
        sx={{ mb: 4 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
          >
            <Card
              elevation={3}
              sx={{
                background: stat.gradient,
                color: "white",
                borderRadius: 2,
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 16px 24px rgba(0,0,0,0.2)",
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "white", color: theme.palette.primary.main }}>
                    {stat.icon}
                  </Avatar>
                }
                title={stat.title}
                titleTypographyProps={{ variant: "h6" }}
                sx={{ textAlign: "center" }}
              />
              <CardContent>
                <Typography variant="h4" align="center" color="inherit">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {/* Main Content */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "2fr 1fr" }}
        gap={3}
        sx={{ mb: 4 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #FFFFFF, #F9FAFB)",
              borderRadius: 4,
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            }}
          >
            <RecentComments />
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              background: "linear-gradient(135deg, #FFFFFF, #F9FAFB)",
              borderRadius: 4,
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
            }}
          >
            <AdminEssayStatistics />
          </Paper>
        </motion.div>
      </Box>

      {/* Essay List Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            background: "linear-gradient(135deg, #FFFFFF, #F9FAFB)",
            borderRadius: 4,
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          }}
        >
          <EssayDataTable />
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Dashboard;
