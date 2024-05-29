const fileOwnerOrFolderOwner = async (req, res, next) => {

  // Check if user is the owner of the folder
  const userIsFolderOwner = req.folder.usuarioId === req.usuario.id

  // Check if user is the onwer of the file
  const userIsFileOwner = req.file.usuarioId === req.usuario.id

  console.log({userIsFolderOwner}, {userIsFileOwner})

  if (userIsFolderOwner || userIsFileOwner){
    next();
  }else {
    return res.status(403).send({ message: 'No tienes permisos para realizar esta acción' })
  }

}


export { fileOwnerOrFolderOwner }
