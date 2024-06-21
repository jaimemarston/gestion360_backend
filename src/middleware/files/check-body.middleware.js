const checkFilesBody = (req, res, next) => {
    if (req.body.filename === undefined || req.body.filename === '') {
      return res.status(400).send({ message: 'El nombre de archivo es requerido' })
    }

    if (req.body.mimetype === undefined || req.body.mimetype === '') {
      return res.status(400).send({ message: 'El mimetype es requerido' })
    }

    if (req.body.base64Content === undefined || req.body.base64Content === '') {
      return res.status(400).send({ message: 'El contenido en base64 es requerido' })
    }

  req.body.filename = req.body.filename.trim()
  req.body.mimetype = req.body.mimetype.trim()
  next()
}

export { checkFilesBody }
