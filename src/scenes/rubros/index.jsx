import React, { useState, useEffect } from 'react';
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Rubros = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://158.247.122.111:8080/api/rubros');
        const data = await response.json();
        if (Array.isArray(data)) {
          setRows(data);
        } else {
          console.error('Expected data to be an array, but got:', typeof data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", type: "number" },
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "presupuestoTotal", headerName: "Presupuesto Total", type: "number", flex: 1 },
    { field: "presupuestoEjecutado", headerName: "Presupuesto Ejecutado", type: "number", flex: 1 },
    { field: "fechaInicio", headerName: "Fecha de Inicio", type: "date", flex: 1 },
    { field: "fechaFin", headerName: "Fecha de Fin", type: "date", flex: 1 },
    { field: "estado", headerName: "Estado", flex: 1 },
    { field: "porcentajeEjecucion", headerName: "Porcentaje de Ejecución", type: "number", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="RUBROS" subtitle="Categorización de Los Rubros" />
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
        }}
      >
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Rubros;
