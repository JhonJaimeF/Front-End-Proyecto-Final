import { Box, Typography, useTheme } from "@mui/material";
import { tokens} from "../../theme";
import { mockTransactions } from "../../data/mockData";
import LabelImportantOutlinedIcon from '@mui/icons-material/LabelImportantOutlined';
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import React, { useEffect,useState } from 'react';
import ProgressCircleChampain from "../../components/ProgressCircleChampain";


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); 
  const [data, setData] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://158.247.122.111:8080/api/rubros');
        const result = await response.json();
        console.log(result.data);
        
        // Filtrar datos con 100% de ejecución
        const filteredData = result.data.filter(item => (item.presupuestoEjecutado / item.presupuestoTotal) < 1);
  
        // Ordenar los datos por porcentaje de ejecución (presupuestoEjecutado / presupuestoTotal)
        const sortedData = filteredData.sort((a, b) => {
          const percentA = (a.presupuestoEjecutado / a.presupuestoTotal);
          const percentB = (b.presupuestoEjecutado / b.presupuestoTotal);
          return percentB - percentA;
        });
  
        setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  


  return (
    <Box m="20px">
      {/* HEADER */}

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="150px"
        gap="20px"
      >
        {/* LineChart */}
        <Box
          gridColumn="span 12"
          backgroundColor={colors.primary[400]}
        >
          <Box height="100%" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Progreso General
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircleChampain size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
            </Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Rubros por Categoria
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 2 */}
        {data.slice(0, 5).map((item, index) => ( 
          <Box key={index} gridColumn="span 3" 
            backgroundColor={colors.primary[400]} 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            overflow="hidden" > 
            
            <StatBox title={item.nombre} 
            progress={(item.presupuestoTotal - item.presupuestoEjecutado) / item.presupuestoTotal} 
            subtitle={item.estado}
            increase={item.porcentajeEjecucion+"% Gastado"} 
            icon={ <LabelImportantOutlinedIcon 
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }} 
                /> } /> 
          </Box> ))}       
      </Box>
    </Box>
  );
};

export default Dashboard;
