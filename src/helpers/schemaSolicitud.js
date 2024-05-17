import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaSolicitud = Joi.object({
  fechaRegistro: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'La fecha de registro es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'La fecha de registro no debe estar vació';
        }
      });
      return errors;
    }),
  nombre: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El nombres es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El nombres no debe estar vació';
        }
        if (data.code === 'string.base') {
          data.message = 'No se permiten números';
        }
      });
      return errors;
    }),
  nombreProyecto: Joi.number()
    .required()
    .positive()
    .integer()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El nombre del proyecto es requerido';
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
  lugarComision: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El lugar de comisión es requerido';
        }
        if (data.code === 'string.base') {
          data.message = 'El lugar de comisión no debe estar vació';
        }
        if (data.code === 'string.base') {
          data.message = 'No se permiten números';
        }
      });
      return errors;
    }),
  itinerarioTransporte: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El itinerario de transporte es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El itinerario de transporte no debe estar vació';
        }
        if (data.code === 'string.base') {
          data.message = 'No se permiten números';
        }
      });
      return errors;
    }),
  objetoComision: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El objeto de comisión es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El objeto de comisión no debe estar vació';
        }
        if (data.code === 'string.base') {
          data.message = 'No se permiten números';
        }
      });
      return errors;
    }),
  fechaInicio: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'La fecha de inicio es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'La fecha de inicio no debe estar vació';
        }
      });
      return errors;
    }),
    user_id: Joi.number()
    .required()
    .positive()
    .integer()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El user_ides requerido';
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
  fechaFin: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'La fecha de fin es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'La fecha de fin no debe estar vació';
        }
      });
      return errors;
    }),
  estado: Joi.boolean(),
});

const validateSolicitud = validator(schemaSolicitud);

export { validateSolicitud };
