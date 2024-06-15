const checkBody = async (req, res, next) => {

  if (req.body.label === undefined || req.body.label === '' || typeof req.body.label !== 'string') {
    return res.status(400).send({ message: 'El label es requerido y debe ser una cadena' })
  }

  next()

};

export { checkBody }
