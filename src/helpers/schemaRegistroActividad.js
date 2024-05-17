import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaRegistroActividad = Joi.object({
  nombreApellido: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El nombre y apellido es requerido';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El nombre y apellido no debe estar vació';
        }
      });
      return errors;
    }),
  destino: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El destino es requerido';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El destino no debe estar vació';
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

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'La fecha de inicio no debe estar vació';
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

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'La fecha de fin no debe estar vació';
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

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El objeto de comisión no debe estar vació';
        }
      });
      return errors;
    }),
  detalleActividad: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El detalle es requerido';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El detalle no debe estar vació';
        }
      });
      return errors;
    }),
  otros: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'Los aspectos administrativos es requerido';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permite ingresar números';
        }

        if (data.code === 'string.empty') {
          data.message = 'Los aspectos administrativos no debe estar vació';
        }
      });
      return errors;
    }),
});

const validateRegistroActividad = validator(schemaRegistroActividad);
export { validateRegistroActividad };
