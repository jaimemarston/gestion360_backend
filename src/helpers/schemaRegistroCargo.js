import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaRegistroCargo = Joi.object({
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
  descripcion: Joi.string()
    .required()
    .error((errors) => {
      console.log(errors);
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'La descripción es requerida';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'La descripción no debe estar vació';
        }
      });
      return errors;
    }),
});

const validateRegistroCargo = validator(schemaRegistroCargo);
export { validateRegistroCargo };
