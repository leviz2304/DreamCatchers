import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getAllEssays } from "../../../api/apiService/dataService";
import dayjs from "dayjs";

const EssayDataTable = () => {
    const [essays, setEssays] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'email',
          headerName: 'Email',
          width: 150,
          editable: true,
        },
       
        {
          field: 'score',
          headerName: 'Score',
          type: 'number',
          width: 110,
          editable: true,
        },
        {
          field: 'submissionTime',
          headerName: 'Thời gian nộp bài',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
        },
      ];
    useEffect(() => {
        getAllEssays().then(data => {
            const formattedData = data.map(essay => ({
                ...essay,
                submissionTime: dayjs(essay.submissionTime).format("YYYY-MM-DD HH:mm"), // Định dạng ngày giờ
            }));
            setEssays(formattedData);
        });
    }, []);

    return (
        <div style={{ height: 500, width: "70%" }}>
            <h2 className="text-lg font-bold mb-4">All Submitted Essays</h2>
            <DataGrid
                rows={essays}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.id} // Đảm bảo mỗi hàng có ID duy nhất
                sx={{
                    border: 1,
                    borderColor: "#FF7A59",
                    "& .MuiDataGrid-cell": {
                        color: "#FF7A59",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#FF7A59",
                        color: "#FF7A59",
                        fontWeight: "bold",
                    },
                }}
            />
        </div>
    );
};

export default EssayDataTable;
