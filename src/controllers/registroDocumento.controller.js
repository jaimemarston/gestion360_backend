import { request, response } from 'express';
import  { sequelize }  from '../database/db.js';
import { validateRegistroDocumento } from '../helpers/schemaRegistroDocumento.js';
import { RegistroDocumento, Usuario, registroEmpleado } from '../models/index.js';
import fs from "fs";
import multer from "multer";
import {PDFDocument}  from 'pdf-lib';
import  MinioService from '../minio/minio.service.js';

import {  Op, Sequelize } from "sequelize";

import path from "path";
import archiver from 'archiver';

import { checkFolderStructureCreated } from '../helpers/uploadSignedBoletaToFileManager.js';

const fileService = new MinioService();
const FOLDER_FIRMAS = 'firmas';
const FOLDER_DOCUMENTS = 'documents';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const getBoletasMay = async (req = request, res = response) => {
  try {
    const rowsUsers = await RegistroDocumento.findAll({
      where: Sequelize.literal("TO_DATE(fechaenvio, 'DD-MM-YYYY') >= DATE '2023-04-01' AND TO_DATE(fechaenvio, 'DD-MM-YYYY') < DATE '2023-05-01'"),
    });

      for (const row of rowsUsers) {
      await Document.update(
        { estado: false, fechafirma: null },
        { where: { id: row.id } }
      );
    }

    const carpeta = './public/uploads';
    const prefijo = 'firmado';
    const sufijo = '202304.pdf';

    const getBoletasMayByBoleta = async () => {
      try {
        const rowsUsers = await RegistroDocumento.findAll();
    
        const data = rowsUsers.filter((res) => {
          const boletaName = res.nombredoc.split('_')[2].split('.')[0];
          return boletaName === '202304';
        });
    
        for (const row of data) {
          await RegistroDocumento.update(
            { estado: false, fechafirma: null },
            { where: { id: row.id } }
          );
        }
    
        console.log('Registros actualizados correctamente.', data);
      } catch (error) {
        console.error('Error:', error);
      }
    };


   

    const eliminarDocumentosPorPatron = (carpeta, prefijo, sufijo) => {
      
      fs.readdir(carpeta, (error, archivos) => {
        if (error) {
          console.error('Error al leer la carpeta:', error);
          return;
        }
    
        archivos.forEach((archivo) => {
          if (archivo.startsWith(prefijo) && archivo.endsWith(sufijo)) {
            const rutaArchivo = path.join(carpeta, archivo);
            fs.unlink(rutaArchivo, (error) => {
              if (error) {
                console.error('Error al eliminar el archivo:', archivo, error);
              } else {
                console.log('Archivo eliminado:', archivo);
              }
            });
          }
        });
      });
    };

    const getBoletas2022 = async () => {
      try {
        const rowsUsers = await RegistroDocumento.findAll({
          where: Sequelize.literal("TO_DATE(fechaenvio, 'DD-MM-YYYY') >= DATE '2021-01-01' AND TO_DATE(fechaenvio, 'DD-MM-YYYY') < DATE '2023-01-01'"),
        });
    
        for (const row of rowsUsers) {
          await RegistroDocumento.destroy({ where: { id: row.id } });
        }
    
        console.log('Registros eliminados correctamente.', rowsUsers);
        return rowsUsers
      } catch (error) {
        console.error('Error:', error);
      }
    };


    const eliminarDocumentosPorPatron2022 = (carpeta) => {
      fs.readdir(carpeta, (error, archivos) => {
        if (error) {
          console.error('Error al leer la carpeta:', error);
          return;
        }
    
        archivos.forEach((archivo) => {
          if (
            (archivo.startsWith('Boleta') || archivo.startsWith('firmado_')) &&
            (archivo.includes('2022') || archivo.includes('2021'))
          ) {
            const rutaArchivo = path.join(carpeta, archivo);
            fs.unlink(rutaArchivo, (error) => {
              if (error) {
                console.error('Error al eliminar el archivo:', archivo, error);
              } else {
                console.log('Archivo eliminado:', archivo);
              }
            });
          }
        });
      });
    };


     getBoletasMayByBoleta() 
     eliminarDocumentosPorPatron(carpeta,prefijo, sufijo) 
     getBoletas2022()
     eliminarDocumentosPorPatron2022(carpeta)
 

    res.status(200).json('Exito')
  } catch (error) {
    console.error('Error:', error);
  }
};

const setFirmas = async(req = request, res = response) => {
  const carpeta = './public/uploads/firmas';
  fs.readdir(carpeta, (error, archivos) => {
    if (error) {
      console.error('Error al leer la carpeta:', error);
      return;
    }

    archivos.forEach(async (archivo) => {



      const dni1 = archivo.split('_')[1]
      if(!dni1)return
      const dni = dni1.split('.')[0]
      const firma = archivo.split('.')[0]

      const usuario = await Usuario.findOne({where: {dni: dni}})
      if (!usuario) {
        return ;
      }

      await Usuario.update(
        { imgfirma: firma},
        {
          where: {
            dni: dni
          },
        }
      );

      console.log(dni, firma)
      console.log(usuario)


    });
  });
res.status(200).json('Exito')
}


const upload = multer({ storage: storage });

const lugarOne = async (req = request, res = response) => {
  const { id } = req.params;
  try {
    const registroDocumento = await RegistroDocumento.findOne({
      where: { id, estado: true },
    });
    if (!registroDocumento) {
      return res
        .status(404)
        .json({ message: 'Registro de documento no encontrado' });
    }
    res
      .status(200)
      .json({ message: 'Registro de documento encontrado', registroDocumento });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const lugarAll = async (req = request, res = response) => {
  try {
    const [registroDocumento, count] = await Promise.all([
      RegistroDocumento.findAll({
        order: ['id'],
        where: { estado: true },
      }),
      RegistroDocumento.count({
        where: { estado: true },
      }),
    ]);
    res.status(200).json({
      message: 'Lista de registro de documento',
      registroDocumento,
      count,
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const lugarAdd = async (req = request, res = response) => {
  const { body } = req;
  const { error } = validateRegistroDocumento(req.body);

  if (error) {
    const err = error.details[0].message;
    return res.status(400).json({ message: err });
  }
  try {
    const existCode = await RegistroDocumento.findOne({
      where: { codigo: body.codigo },
    });

    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }

    const registroDocumento = await RegistroDocumento.create({ ...body });

    res
      .status(201)
      .json({ message: 'Se ha creado con éxito', registroDocumento });
  } catch (err) {
    res.status(400).json({ message: 'hable con el administrador', err });
  }
};


const cargamasivaDeBoletas = async (req = request, res = response) => {

const fechaActualString = () => {

	const ahora = new Date();

	const año = ahora.getFullYear();
	const mes = String(ahora.getMonth() + 1).padStart(2, '0');
	const día = String(ahora.getDate()).padStart(2, '0');

	const horas = String(ahora.getHours()).padStart(2, '0');
	const minutos = String(ahora.getMinutes()).padStart(2, '0');
	const segundos = String(ahora.getSeconds()).padStart(2, '0');
	const milisegundos = String(ahora.getMilliseconds()).padStart(3, '0');

	const zonaHoraria = new Date().toTimeString().slice(9, 15);

	const fechaHoraString = `${año}-${mes}-${día} ${horas}:${minutos}:${segundos}.${milisegundos}${zonaHoraria}`;
	return fechaHoraString;

}


  try {
    const files = req.files;
    const updloadDate = req.body?.date ?? null;

    const promises = files.map(async (file) => {
      const fileContent = fs.readFileSync(file.path);
      const base64Image = Buffer.from(fileContent).toString('base64');
      const newFile = await fileService.saveBase64ToMinio(base64Image, file.originalname, FOLDER_DOCUMENTS);
      fs.unlinkSync(file.path);
      return newFile;
    });

    const docs = await Promise.all(promises);

    const documentsData = docs.map((docData) => {
      const docName = docData.name.replace('documents/', '');
      const fechaBoleta = docName.split('_')[2].split('.')[0];
      const year = fechaBoleta.slice(0, 4);
      const month = fechaBoleta.slice(4, 6);    
      // Obtener el día actual si no está en el nombre del archivo
      const currentDate = new Date();
      const day = fechaBoleta.length > 6 ? fechaBoleta.slice(6, 8) : String(currentDate.getDate()).padStart(2, '0');
    
      // Crear la fecha de envío
      const fechaEnvio = updloadDate ? updloadDate : `${day}-${month}-${year}`;
    

      const doc = {
        tipodoc: docName.split("_")[0],
        nombredoc: docName,
        ndocumento: docName.split("_")[1],
        fechaenvio: fechaEnvio,
        createdAt: fechaActualString(),
        updatedAt: fechaActualString()
      };
      return doc;
    });

const repeatedElements = [];
const docsToInsert = [];

for (const element of documentsData) {
  if (!repeatedElements.includes(element.nombredoc)) {
    repeatedElements.push(element.nombredoc);

    // Validar que ndocumento existe en la tabla registroEmpleados
    const empleadoExistsQuery = `
      SELECT * FROM "public"."registroEmpleados" WHERE ndocumento = '${element.ndocumento}';
    `;
    const empleadoExistsResult = await sequelize.query(empleadoExistsQuery);

    if (empleadoExistsResult && empleadoExistsResult[0] && empleadoExistsResult[0].length > 0) {
      // El ndocumento existe en la tabla registroEmpleados, ahora verificamos en registroDocumentos
      const documentoExistsQuery = `
        SELECT * FROM "public"."registroDocumentos" WHERE nombredoc = '${element.nombredoc}' AND ndocumento = '${element.ndocumento}';
      `;
      const documentoExistsResult = await sequelize.query(documentoExistsQuery);

      if (!(documentoExistsResult && documentoExistsResult[0] && documentoExistsResult[0].length > 0)) {
        // El elemento no existe en la tabla registroDocumentos, lo agregamos a docsToInsert
        docsToInsert.push(element);
      }
    } else {
      console.error(`El ndocumento ${element.ndocumento} no existe en la tabla registroEmpleados.`);
    }
  }
}


// Ahora docsToInsert contiene solo los elementos que no están en la base de datos
if (docsToInsert.length > 0) {
  const query = `
    INSERT INTO "public"."registroDocumentos" (nombredoc, ndocumento, tipodoc, fechaenvio, "createdAt", "updatedAt")
    VALUES ${docsToInsert.map(item => `('${item.nombredoc}', '${item.ndocumento}', '${item.tipodoc}', '${item.fechaenvio}', '${item.createdAt}', '${item.updatedAt}')`).join(', ')};
  `;

  const result = await sequelize.query(query);
}

    res.status(201).json({ message: 'Se ha subido con éxito'});

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};



const addAllFirm = async (req = request, res = response) => {
  try {

    const files = req.files
    const uploadDate = req.body?.date ?? null;

    const documentsData = files.map((docData) => {
      if(docData.originalname.split("_")[0] === 'firmado'){
        const fechaBoleta = docData.originalname.split('_')[3].split('.')[0];
        const year = fechaBoleta.slice(0, 4);
        const month = fechaBoleta.slice(4, 6);
        const dayInDocument = fechaBoleta.slice(6, 8);
        const currentDay = new Date().getDate().toString().padStart(2, '0');
        const day = dayInDocument || currentDay;
        const date = new Date(year, parseInt(month) - 1, parseInt(day));
        let fechaEnvio = date.toLocaleDateString("es-ES").replace(/\//g, '-');
        fechaEnvio = fechaEnvio.split('-').map(part => part.padStart(2, '0')).join('-');
        const doc = {
          tipodoc: docData.originalname.split("_")[1],
          nombredoc:docData.originalname.replace('firmado_', ''),
          ndocumento: docData.originalname.split("_")[2],
          fechaenvio: uploadDate ? uploadDate : fechaEnvio,
          fechafirma: uploadDate ? uploadDate : fechaEnvio,
          estado: true
    
        }
        return doc
      }else {
        const fechaBoleta = docData.originalname.split('_')[2].split('.')[0];
        const year = fechaBoleta.slice(0, 4);
        const month = fechaBoleta.slice(4, 6);
        const day = "01"; 
        const date = new Date(year, parseInt(month) - 1, day);
        let fechaEnvio = date.toLocaleDateString("es-ES").replace(/\//g, '-');
        fechaEnvio = fechaEnvio.split('-').map(part => part.padStart(2, '0')).join('-');
        const doc = {
          tipodoc: docData.originalname.split("_")[0],
          nombredoc:docData.originalname,
          ndocumento: docData.originalname.split("_")[1],
          fechaenvio: uploadDate ? uploadDate : fechaEnvio,
          fechafirma: uploadDate ? uploadDate : fechaEnvio,
          estado: true
    
        }
        return doc
      }

    } )

  console.log(documentsData)

  const empleado = await registroEmpleado.findAll();



const documentosValidos = documentsData.filter((documento) =>
empleado.some((empleado) => empleado.docIdentidad === documento.ndocumento)
);

const regDoc = await RegistroDocumento.bulkCreate(documentosValidos, {
  updateOnDuplicate: ['nombredoc', 'tipodoc', 'ndocumento', 'fechafirma', 'estado'],
  upsert: true,
  fields: ['nombredoc', 'tipodoc', 'ndocumento', 'fechafirma', 'estado'] // Los campos relevantes
});

  res
  .status(201)
  .json({ message: 'Se ha subido con éxito', regDoc });
    
  } catch (error) {
    res.status(400).json({ message: 'hable con el administrador', error });
  }
  

};

const firmarDoc = async (req, res) => {
  const {user,doc} = req.body
  const { type } = req.query;
  const coordenates = {
    x: 180,
    y: 135,
    width: 100,
    height: 45,
  }

  if (type && type === 'Cts') {
    coordenates.x = 390;
    coordenates.y = 150;
  }

try {

  const pdfBytes = await fileService.getFileBytes(`documents/${doc.nombredoc}`)
  const pdfDoc = await PDFDocument.load(pdfBytes);    // Encuentra las coordenadas donde se colocará la imagen de la firma
  const page = pdfDoc.getPages()[0]; // Obtén la primera página del PDF

  // Agrega la imagen como un sello en la página
  const imageBytes = await fileService.getFileBytes(`firmas/${user?.imgfirma}.jpg`)
  const image = await pdfDoc.embedJpg(imageBytes);
  page.drawImage(image, coordenates);

   const newPdf = await  pdfDoc.save()    

  const pdfBuffer = Buffer.from(newPdf);
  const base64Pdf = pdfBuffer.toString('base64');

  await fileService.saveBase64ToMinio( base64Pdf , `firmado_${doc.nombredoc}`, 'documents');

  // Copy signed boleta to file manager
  await checkFolderStructureCreated(doc);

const fecha = new Date();
const anio = fecha.getFullYear();
const mes = fecha.getMonth() + 1;
const dia = fecha.getDate();
const fechaPlana = `${dia.toString().padStart(2, '0')}-${mes.toString().padStart(2, '0')}-${anio}`;
const documento = await RegistroDocumento.findOne({where:{id:doc.id}})
 await documento.update({estado:true, fechafirma: fechaPlana})
 res.status(200).send({ message: 'Firmado Correctamente', newdoc: documento});
} catch (error) {
  console.log(error)
  return res.status(400).json({ message: 'Error al firmar el documento', error });
}
  


  
 
}

const uploadfile = async (req, res, next) => {
  const file = req.file;
  const dni = req.params.dni;

  const extension = file.path.split('.');
  console.log('path=>', extension[1].toLowerCase());
  // if (extension[1].toLowerCase() !== 'jpg') {
  //   return res.status(404).json({ message: 'Formato no permitido' });
  // }

  const firmaImc = 'firma_';
  const firmaComp = `${firmaImc}${dni}`;
  file.originalname = firmaComp;
  file.filename = firmaComp;

  if (!file) {
    const error = new Error('Seleccione un archivo');
    error.httpStatusCode = 400;
    return next(error);
  }

  const fileContent = fs.readFileSync(file.path);
  const base64Image = Buffer.from(fileContent).toString('base64');
  await fileService.saveBase64ToMinio(base64Image,  `${file.originalname}.jpg`, FOLDER_FIRMAS);
  fs.unlinkSync(file.path);

  try {

    const result = await Usuario.findOne({where: {dni: dni}});


    if (!result)
      return res.status(404).json({ message: 'Empleado no Encontrado' });

   result.update({imgfirma: firmaComp})   

    return res.json(result);
  } catch (error) {
    throw new Error(error);
  }
};

const lugarUpdate = async (req = request, res = response) => {
  const { id } = req.params;
  const { body } = req;
  try {
    const registroDocumento = await RegistroDocumento.findByPk(id);
    const existCode = await RegistroDocumento.findOne({
      where: { codigo: body.codigo },
    });
    if (existCode) {
      return res.status(404).json({ message: 'El código ya existe' });
    }
    if (!registroDocumento) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    await RegistroDocumento.update(
      { ...body },
      {
        where: {
          id,
        },
      }
    );
    res.json({
      message: 'Registro documento actualizado',
      registro: { ...body },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const lugarDelete = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const registroDocumento = await RegistroDocumento.findByPk(id);
    const nombreDoc = registroDocumento.nombredoc;
    if (!registroDocumento) {
      return res.status(404).json({ message: 'El dato ingresado no existe' });
    }
    // console.log(registroDocumento);
    await registroDocumento.destroy();
    fs.unlink(`public/uploads/${nombreDoc}`, (error) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Archivo eliminado correctamente');
        
      }
    });
    res
      .status(200)
      .json({ message: 'Se elimino con éxito', registroDocumento });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const lugarBlockDelete = (req = request, res = response) => {
  const { body } = req;
  try {
    body.map(async (element, index) => {
      const registroDocumento = await RegistroDocumento.findByPk(element);
      // if (!registroDocumento) {
      //   return res.status(404).json({ message: 'El dato ingresado no existe' });
      // }
      await registroDocumento.update({ estado: false });
      if (body.length - 1 === index) {
        res.status(200).json({ message: 'Se han eliminado con éxito' });
      }
    });
  } catch (err) {
    return res.status(400).json({ message: 'Hable con el administrador', err });
  }
};

const descargarDocumentosPorIds = async (req, res) => {
  const { body: ids } = req;

  try {

    const documentos = await RegistroDocumento.findAll({
      attributes: ['nombredoc'],
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    const uploadsFolder = path.join(process.cwd(), 'public', 'uploads'); // Ruta a la carpeta de subidas

    res.setHeader('Content-Disposition', 'attachment; filename=documentos.zip');
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver  ('zip', { zlib: { level: 9 } });

    archive.pipe(res);

    for (const documento of documentos) {
      const filePath = path.join(uploadsFolder, documento.nombredoc);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, { name: documento.nombredoc });
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error('Error al buscar o crear archivos zip:', error);
    res.status(500).send('Error al buscar o crear archivos zip');
  }
};

const certifyDocument = async (req, res) => {
  const { docId } = req.params;
  try {
    const registroDocumento = await RegistroDocumento.findByPk(docId);
    if (!registroDocumento) {
      return res.status(404).json({ 
        success: false, 
        message: 'El documento no existe' 
      });
    }
    const updatedDoc = await registroDocumento.update({ certified: true });
    
    return res.status(200).json({ 
      success: true,
      message: 'Documento certificado correctamente', 
      data: updatedDoc 
    });
  } catch (error) {
    console.error('Error al certificar el documento:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error al certificar el documento',
      error: error.message 
    });
  }
};



export {
  lugarOne,
  lugarAll,
  lugarAdd,
  lugarUpdate,
  lugarDelete,
  lugarBlockDelete,
  cargamasivaDeBoletas,
  addAllFirm,
  uploadfile,
  firmarDoc,
  getBoletasMay,
  setFirmas,
  descargarDocumentosPorIds,
  certifyDocument,
};
