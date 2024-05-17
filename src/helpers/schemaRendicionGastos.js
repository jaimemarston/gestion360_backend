import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaRendicionGastos = Joi.object({
  nombreApellido: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El nombre y apellido es requerido';
        }

        if (data.code === 'string.base') {
          data.message = 'No se permiten números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El nombre y apellido no debe estar vació';
        }
      });
      return errors;
    }),
  proyecto: Joi.number()
    .required()
    .positive()
    .integer()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El proyecto es requerido';
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
        if (data.code === 'string.empty') {
          data.message = 'El lugar de comisión no debe estar vació';
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
          data.message = 'No se permiten números';
        }

        if (data.code === 'string.empty') {
          data.message = 'El objeto de comisión no debe estar vació';
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

  recibido: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'any.required') {
          data.message = 'El recibido es requerido';
        }
        if (data.code === 'string.empty') {
          data.message = 'El recibido no debe estar vació';
        }
      });
      return errors;
    }),
  // rendido: Joi.number()
  //   .required()
  //   .positive()
  //   .integer()
  //   .error((errors) => {
  //     errors.forEach((data) => {
  //       if (data.code === 'any.required') {
  //         data.message = 'El rendido es requerido';
  //       }
  //       if (data.code === 'number.base') {
  //         data.message = 'Solo se permiten números';
  //       }
  //       if (data.code === 'number.positive') {
  //         data.message = 'Ingrese números positivos';
  //       }
  //     });
  //     return errors;
  //   }),
  // saldo: Joi.number()
  //   .required()
  //   .positive()
  //   .integer()
  //   .error((errors) => {
  //     errors.forEach((data) => {
  //       if (data.code === 'any.required') {
  //         data.message = 'El saldo es requerido';
  //       }
  //       if (data.code === 'number.base') {
  //         data.message = 'Solo se permiten números';
  //       }
  //       if (data.code === 'number.positive') {
  //         data.message = 'Ingrese números positivos';
  //       }
  //     });
  //     return errors;
  //   }),
});

const validateRendicionGastos = validator(schemaRendicionGastos);
export { validateRendicionGastos };
