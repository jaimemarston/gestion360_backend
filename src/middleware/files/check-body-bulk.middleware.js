const checkFilesBodyBulk = (req, res, next) => {

  if (req.body.files === undefined || req.body.files.length === 0 ) {
    return res.status(400).send({ message: 'La variable files es requerida y no puede estar vacia' })
  }

  // if (req.body.length === 0) {
  //   return res.status(400).send({ message: 'No hay archivos para subir' })
  // }

  req.body.files.forEach(file => {

    if (file.filename === undefined || file.filename === '') {
      return res.status(400).send({ message: 'El nombre de archivo es requerido' })
    }

    if (file.mimetype === undefined || file.mimetype === '') {
      return res.status(400).send({ message: 'El mimetype es requerido' })
    }

    if (file.base64Content === undefined || file.base64Content === '') {
      return res.status(400).send({ message: 'El contenido en base64 es requerido' })
    }

  });

  next()
}

export { checkFilesBodyBulk }
