
const checkName = (req, res, next) => {

  if (req.body.name === undefined || req.body.name === '') {
    return res.status(400).send({ message: 'El nombre es requerido' })
  }

  next();
}

export { checkName };
