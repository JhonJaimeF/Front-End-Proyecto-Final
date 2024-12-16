import { Box, Button, TextField, MenuItem } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState } from "react";
import Header from "../../components/Header";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [rubros, setRubros] = useState([]);

  // Cargar los rubros existentes
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await fetch("http://158.247.122.111:8080/api/rubros");
        const data = await response.json();
        // Filtrar los rubros que no tengan el presupuesto ejecutado al 100%
        const filteredRubros = data.data.filter(rubro => {
          return rubro.porcentajeEjecucion < 100;
        });
        setRubros(filteredRubros);
      } catch (error) {
        console.error("Error al cargar los rubros:", error);
      }
    };
    fetchRubros();
  }, []);

  const handleFormSubmit = async (values, { resetForm }) => {
    const rubro = rubros.find(rubro => rubro.id === values.rubroId);

  if (rubro && values.montoTotal > rubro.presupuestoTotal - rubro.presupuestoEjecutado) {
    // Mostrar la alerta de error antes de enviar el formulario
    alert("El monto total excede el valor disponible del rubro");
    return; // Evitar el envío del formulario
  }
    try {
      const response = await fetch("http://158.247.122.111:8080/api/asignaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        alert("Asignación agregada correctamente");
        resetForm(); // Limpia los datos del formulario
        window.location.reload();
      } else {
        console.log(values);
        console.error("Error al agregar la asignación:", response.statusText);
        alert("Error al agregar la asignación. Intente nuevamente.");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión al servidor. Intente más tarde.");
    }
  };

  return (
    <Box m="20px">
      <Header title="AGREGAR ASIGNACIÓN" subtitle="Se asignan montos a los rubros" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        context={{ rubros }} 
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
                select
                fullWidth
                variant="filled"
                label="Rubro"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rubroId}
                name="rubroId"
                error={!!touched.rubroId && !!errors.rubroId}
                helperText={touched.rubroId && errors.rubroId}
                sx={{ gridColumn: "span 4" }}
              >
                {rubros.map((rubro) => (
                  <MenuItem key={rubro.id} value={rubro.id}>
                    {rubro.nombre}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Monto Total"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.montoTotal}
                name="montoTotal"
                error={!!touched.montoTotal && !!errors.montoTotal}
                helperText={touched.montoTotal && errors.montoTotal}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="number"
                label="Monto Utilizado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.montoUtilizado}
                name="montoUtilizado"
                error={!!touched.montoUtilizado && !!errors.montoUtilizado}
                helperText={touched.montoUtilizado && errors.montoUtilizado}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Fecha Inicio"
                onBlur={handleBlur}
                onChange={handleChange}
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
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.fechaFin}
                name="fechaFin"
                InputLabelProps={{ shrink: true }}
                error={!!touched.fechaFin && !!errors.fechaFin}
                helperText={touched.fechaFin && errors.fechaFin}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                select
                fullWidth
                variant="filled"
                label="Estado"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.estado}
                name="estado"
                error={!!touched.estado && !!errors.estado}
                helperText={touched.estado && errors.estado}
                sx={{ gridColumn: "span 4" }}
              >
                {estadoOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Agregar Asignación
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const estadoOptions = ["ACTIVA", "AGOTADA", "PROXIMA_A_VENCER", "COMPLETADA"];

const checkoutSchema = yup.object().shape({
  rubroId: yup.number().required("Campo obligatorio"),
  montoTotal: yup
    .number()
    .required("Campo obligatorio")
    .test(
      "is-valid-monto",
      "El monto total excede el valor disponible del rubro",
      function (value) {
        const rubro = this.options.context?.rubros?.find(
          (r) => r.id === this.parent.rubroId
        );
        return rubro ? value <= rubro.presupuestoTotal - rubro.presupuestoEjecutado : true;
      }
    ),
  montoUtilizado: yup
    .number()
    .required("Campo obligatorio")
    .min(0, "Debe ser mayor o igual a 0")
    .test(
      "is-valid-monto-utilizado",
      "El monto utilizado no puede ser mayor al monto total",
      function (value) {
        const montoTotal = this.parent.montoTotal;
        return value <= montoTotal;
      }
    ),
  fechaInicio: yup
    .date()
    .required("Campo obligatorio")
    .test(
      "is-valid-fecha-inicio",
      "La fecha de inicio debe estar dentro del rango del rubro",
      function (value) {
        const rubro = this.options.context?.rubros?.find(
          (r) => r.id === this.parent.rubroId
        );
        return rubro ? value >= new Date(rubro.fechaInicio) && value <= new Date(rubro.fechaFin) : true;
      }
    ),
  fechaFin: yup
    .date()
    .required("Campo obligatorio")
    .min(yup.ref("fechaInicio"), "La fecha de fin debe ser mayor que la fecha de inicio")
    .test(
      "is-valid-fecha-fin",
      "La fecha de fin debe estar dentro del rango del rubro",
      function (value) {
        const rubro = this.options.context?.rubros?.find(
          (r) => r.id === this.parent.rubroId
        );
        return rubro ? value <= new Date(rubro.fechaFin) : true;
      }
    ),
  estado: yup.string().required("Campo obligatorio"),
});


const initialValues = {
  rubroId: "",
  montoTotal: "",
  montoUtilizado: "",
  fechaInicio: "",
  fechaFin: "",
  estado: "ACTIVA",
};

export default Form;
