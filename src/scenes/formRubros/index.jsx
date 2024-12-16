import { Box, Button, TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = async (values, { resetForm }) => {
    console.log("Datos a agregar:", values); // Muestra los datos en consola

    try {
      const response = await fetch("http://158.247.122.111:8080/api/rubros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        alert("Rubro agregado correctamente");
        resetForm(); // Limpia los datos del formulario
      } else {
        console.error("Error al agregar el rubro:", response.statusText);
        alert("Error al agregar el rubro. Intente nuevamente.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión al servidor. Intente más tarde.");
    }
  };

  const estadoOptions = ["PENDIENTE", "EN_EJECUCION", "COMPLETADO", "SOBREPASADO"];

  return (
    <Box m="20px">
      <Header title="AGREGAR RUBRO" subtitle="Se agregan rubros al presupuesto" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nombre"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nombre}
                name="nombre"
                error={!!touched.nombre && !!errors.nombre}
                helperText={touched.nombre && errors.nombre}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Presupuesto Total"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.presupuestoTotal}
                name="presupuestoTotal"
                error={!!touched.presupuestoTotal && !!errors.presupuestoTotal}
                helperText={touched.presupuestoTotal && errors.presupuestoTotal}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha Inicio"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e); // Actualiza la Fecha Inicio
                  const startDate = new Date(e.target.value);
                  const oneYearLater = new Date(startDate);
                  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                  setFieldValue("fechaFin", oneYearLater.toISOString().split("T")[0]); // Actualiza Fecha Fin
                }}
                value={values.fechaInicio}
                name="fechaInicio"
                InputLabelProps={{ shrink: true }}
                error={!!touched.fechaInicio && !!errors.fechaInicio}
                helperText={touched.fechaInicio && errors.fechaInicio}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha Fin"
                value={values.fechaFin}
                name="fechaFin"
                InputLabelProps={{ shrink: true }}
                error={!!touched.fechaFin && !!errors.fechaFin}
                helperText={touched.fechaFin && errors.fechaFin}
                sx={{ gridColumn: "span 2" }}
                disabled // Hace que el campo sea solo lectura
              />
              <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={values.estado}
                  name="estado"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  label="Estado"
                  error={!!touched.estado && !!errors.estado}
                >
                  {estadoOptions.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {estado}
                    </MenuItem>
                  ))}
                </Select>
                {touched.estado && errors.estado && (
                  <Box color="red" mt="4px">{errors.estado}</Box>
                )}
              </FormControl>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Agregar Rubro
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const checkoutSchema = yup.object().shape({
  nombre: yup.string().required("Campo obligatorio"),
  presupuestoTotal: yup
    .number()
    .required("Campo obligatorio")
    .min(0, "Debe ser mayor o igual a 0")
    .notOneOf([0], "El presupuesto total no puede ser igual a cero"),
  fechaInicio: yup.date().required("Campo obligatorio"),
  fechaFin: yup.date().required("Campo obligatorio"),
  estado: yup.string().required("Campo obligatorio"),
});

const initialValues = {
  nombre: "",
  presupuestoTotal: 0,
  fechaInicio: "",
  fechaFin: "",
  estado: "PENDIENTE", // Valor por defecto
};

export default Form;
