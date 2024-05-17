import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaSolicitudProducto = Joi.object({
  descripcion: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El nombres es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El nombres no debe estar vació';
        }
      });
      return errors;
    }),
  partidaPresupuestal: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El nombres es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El nombres no debe estar vació';
        }
      });
      return errors;
    }),
  importe: Joi.number()
    .required()
    .positive()
    .integer()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El importe es requerido';
        }
        if (data.code === 'number.base') {
          data.message = 'Solo se permiten números';
        }
        if (data.code === 'number.positive') {
          data.message = 'Ingrese números positivos';
        }
      });
      return errors;
    }),
  estado: Joi.boolean(),
  solicitudId: Joi.number()
    .required()
    .error((errors) => {
      console.log('errors', errors);
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'Solicitud Id es requerida';
        }
        if (data.code === 'number.base') {
          data.message = 'Debe ingresar el Id de la solicitud';
        }
      });
      return errors;
    }),
});

const validateSolicitudProductoSchema = validator(schemaSolicitudProducto);

export { validateSolicitudProductoSchema };
