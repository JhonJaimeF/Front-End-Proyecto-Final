import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";

// Función para formatear los valores en millones
const formatToMillion = (value) => {
  const million = value / 1000000;
  if (million < 10) {
    return `${million.toFixed(1)} Mill`;
  } else {
    return `${Math.floor(million)} Mill`;
  }
};

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://158.247.122.111:8080/api/rubros");
        const result = await response.json();

        const formattedData = result.data.map((item) => {
          const total = item.presupuestoTotal || 0;
          const usado = item.presupuestoEjecutado || 0;
          const Libre = total - usado;

          return {
            nombre: item.nombre || "Desconocido",
            usado,
            Libre,
          };
        });

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveBar
      data={data}
      keys={["usado", "Libre"]}
      indexBy="nombre"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ id }) => (id === "usado" ? "#fb9a99" : "#a6cee3")}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Rubros",
        legendPosition: "middle",
        legendOffset: 32,
        tickColor: theme.palette.mode === "dark" ? "#ffffff" : "#000000", // Ajustar color del eje X según el tema
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Presupuesto",
        legendPosition: "middle",
        legendOffset: 10,  // Ajusta este valor para mover el título hacia arriba
        tickColor: theme.palette.mode === "dark" ? "#ffffff" : "#000000",
        format: formatToMillion, // Usar la función de formato personalizada
      }}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: theme.palette.mode === "dark" ? "#ffffff" : "#000000", // Ajustar color de la línea del eje
            },
          },
          ticks: {
            line: {
              stroke: theme.palette.mode === "dark" ? "#ffffff" : "#000000", // Ajustar color de las líneas de las marcas
              strokeWidth: 1,
            },
            text: {
              fill: theme.palette.mode === "dark" ? "#ffffff" : "#000000", // Ajustar color del texto de las marcas
            },
          },
          legend: {
            text: {
              fill: theme.palette.mode === "dark" ? "#ffffff" : "#000000", // Ajustar color del texto de la leyenda
            },
          },
        },
        legends: {
          text: {
            fill: theme.palette.mode === "dark" ? "#ffffff" : "#000000", // Ajustar color del texto en las leyendas
          },
        },
      }}
      enableLabel={false}
      legends={[
        {
          dataFrom: "keys",
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: "left-to-right",
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: "hover",
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={(e) =>
        `${e.id}: ${e.formattedValue} en rubro: ${e.indexValue}`
      }
    />
  );
};

export default BarChart;
