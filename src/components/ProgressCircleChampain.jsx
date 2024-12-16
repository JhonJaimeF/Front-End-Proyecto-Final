import { Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../theme";
import React, { useEffect, useState } from "react";

// Función para formatear los números en millones
const formatToMillion = (number) => {
  const million = number / 1000000;
  if (million < 10) {
    return `${million.toFixed(1)} Mill`;
  } else {
    return `${Math.floor(million)} Mill`;
  }
};

const ProgressCircle = ({ size = "40" }) => {
  const [progress, setProgress] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [executedBudget, setExecutedBudget] = useState(0);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

  useEffect(() => {
    fetch('http://158.247.122.111:8080/api/rubros')
      .then(response => response.json())
      .then(data => {
        const total = data.reduce((sum, item) => sum + item.presupuestoTotal, 0);
        const executed = data.reduce((sum, item) => sum + item.presupuestoEjecutado, 0);
        setTotalBudget(total);
        setExecutedBudget(executed);
        setProgress(executed / total);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt="25px">
      <Box
        sx={{
          background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
          borderRadius: "50%",
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
      <Typography variant="h5" color={colors.greenAccent[500]} sx={{ mt: "15px" }}>
        {formatToMillion(executedBudget)} / {formatToMillion(totalBudget)} presupuesto ejecutado
      </Typography>
      <Typography>Incluye gastos misceláneos y costos extra</Typography>
    </Box>
  );
};

export default ProgressCircle;
