import React, { useState, useEffect } from 'react';
import { Box, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://158.247.122.111:8080/api/asignaciones');
        const data = await response.json();
        setRows(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "rubroId", headerName: "Rubro ID" },
    {
      field: "montoTotal",
      headerName: "Monto Total",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "montoUtilizado",
      headerName: "Monto Utilizado",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "montoDisponible",
      headerName: "Monto Disponible",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "fechaInicio",
      headerName: "Fecha de Inicio",
      type: "date",
      flex: 1,
    },
    {
      field: "fechaFin",
      headerName: "Fecha de Fin",
      type: "date",
      flex: 1,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Asignaciones Presupuestales"
        subtitle="Gastos referentes a los Rubros"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;
