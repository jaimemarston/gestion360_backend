import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaRegistroDocumento = Joi.object({
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
  tipoDocumento: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El documento es requerido';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El documento no debe estar vació';
        }
      });
      return errors;
    }),
});

const validateRegistroDocumento = validator(schemaRegistroDocumento);
export { validateRegistroDocumento };
