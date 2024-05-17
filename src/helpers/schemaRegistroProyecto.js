import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaRegistroProyecto = Joi.object({
  codigo: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El código es requerido';
        }

        if (data.code === 'string.empty') {
          data.message = 'El código no debe estar vació';
        }
      });
      return errors;
    }),
  nombreAbreviado: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El nombre abr es requerido';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El nombre no debe estar vació';
        }
      });
      return errors;
    }),
  nombreCompleto: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El nombre es requerida';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El nombre no debe estar vació';
        }
      });
      return errors;
    }),
});

const validateRegistroProyecto = validator(schemaRegistroProyecto);
export { validateRegistroProyecto };
