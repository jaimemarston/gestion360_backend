import Joi from 'joi';
const validator = (schema) => (payload) =>
  schema.validate(payload, { abortEarly: false });

const schemaUser = Joi.object({
  codigo: Joi.string(),
  dni: Joi.string(),
  imgfirma: Joi.string(),
  estado: Joi.boolean()
  .required()
  .error((errors) => {
    errors.forEach((data) => {
      if (data.code === 'string.empty') {
        console.log('=>', (data.message = 'El estado no debe estar vació'));
      }
    });
    return errors;
  }),
  nombre: Joi.string()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'string.empty') {
          console.log('=>', (data.message = 'El nombre no debe estar vació'));
        }
      });
      return errors;
    }),
  email: Joi.string()
    .email()
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'string.empty') {
          console.log('=>', (data.message = 'El correo no debe estar vació'));
        }

        if (data.code === 'string.email') {
          console.log('=>', (data.message = 'Debe ingresar un correo valido'));
        }
      });
      return errors;
    }),
  password: Joi.string()
    .min(8)
    .required()
    .error((errors) => {
      errors.forEach((data) => {
        if (data.code === 'string.min') {
          console.log(
            '=>',
            (data.message = 'La contraseña debe tener mas de 7 caracteres')
          );
        }
        if (data.code === 'string.empty') {
          console.log(
            '=>',
            (data.message = 'La contraseña no debe estar vació')
          );
        }
      });
      return errors;
    }),
  image: Joi.string(),
  rol: Joi.string(),
});

const validateUserSchema = validator(schemaUser);

export { validateUserSchema };
