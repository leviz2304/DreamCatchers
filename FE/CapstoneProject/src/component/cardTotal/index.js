import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const StatisticCard = ({ icon, title, value, color }) => {
    return (
        <Card
            className="statistic-card shadow-md"
            style={{
                borderLeft: `5px solid ${color}`,
                borderRadius: "8px",
                overflow: "hidden",
            }}
        >
            <CardContent className="flex items-center">
                <div
                    className="icon-wrapper text-3xl mr-4"
                    style={{ color: color }}
                >
                    {icon}
                </div>
                <div>
                    <Typography variant="h5" component="div" className="font-bold">
                        {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {title}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};

export default StatisticCard;
