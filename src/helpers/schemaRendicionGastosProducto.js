import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaRendicionGastosProducto = Joi.object({
  fecha: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        errors.forEach((data) => {
          if (data.code === 'any.required') {
            data.message = 'La fecha es requerido';
          }
          if (data.code === 'string.empty') {
            data.message = 'La fecha es no debe estar vació';
          }
        });
      });
      return errors;
    }),
  serie: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        errors.forEach((data) => {
          if (data.code === 'any.required') {
            data.message = 'La serie es requerido';
          }
          if (data.code === 'string.empty') {
            data.message = 'La serie no debe estar vació';
          }
        });
      });
      return errors;
    }),
  numero: Joi.number()
    .required()
    .positive()
    .integer()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El numero es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El numero no debe estar vació';
        }
        if (data.code === 'number.positive') {
          data.message = 'Ingrese números positivos';
        }
      });
      return errors;
    }),
  rendicionGastosId: Joi.number()
    .required()
    .positive()
    .integer()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El id es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El id no debe estar vació';
        }
        if (data.code === 'number.positive') {
          data.message = 'Ingrese números positivos';
        }
      });
      return errors;
    }),
  tipo: Joi.number()
    .required()
    .positive()
    .integer()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El tipo es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El tipo no debe estar vació';
        }
        if (data.code === 'number.positive') {
          data.message = 'Ingrese números positivos';
        }
      });
      return errors;
    }),
  ruc: Joi.string()
    .required(),
  descripcion: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'La descripción es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'La descripción no debe estar vació';
        }
      });
      return errors;
    }),
  partidaPresupuestal: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'La partida presupuestal es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'La partida presupuestal no debe estar vació';
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
        if (data.code === 'string.empty') {
          data.message = 'El importe no debe estar vació';
        }
        if (data.code === 'number.positive') {
          data.message = 'Ingrese números positivos';
        }
      });
      return errors;
    }),
});

const validateRendicionProductSchema = validator(schemaRendicionGastosProducto);

export { validateRendicionProductSchema };
