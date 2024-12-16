import { Box, IconButton, useTheme, Menu, MenuItem, Popover, Typography } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rubros, setRubros] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchRubros = async () => {
    try {
      //const response = await fetch("http://158.247.122.111:8080/api/rubros");
      const response = await fetch("http://localhost:8080/api/rubros");
      const data = await response.json();
      setRubros(data);

      // Check if any rubro has an execution percentage greater than 80
      const highExecutionRubro = data.find((rubro) => rubro.porcentajeEjecucion > 80);
      if (highExecutionRubro) {
        setHasNewNotification(true);
        setNotification(highExecutionRubro);
      } else {
        setHasNewNotification(false);
        setNotification(null);
      }
    } catch (error) {
      console.error("Error fetching rubros:", error);
    }
  };

  useEffect(() => {
    fetchRubros();
  }, []);

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box></Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleClick}>
          {hasNewNotification ? <NotificationsActiveIcon /> : <NotificationsOutlinedIcon />}
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>

      {/* MENU */}
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Cerrar sesión</MenuItem>
      </Menu>

      {/* POPOVER */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box p={2}>
          {hasNewNotification && notification ? (
            <>
              <Typography variant="h6">Nuevo Rubro Notificado</Typography>
              <Typography>Nombre: {notification.nombre}</Typography>
              <Typography>Porcentaje de Ejecución: {notification.porcentajeEjecucion}%</Typography>
            </>
          ) : (
            <Typography variant="h6">No hay nuevas notificaciones</Typography>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default Topbar;
