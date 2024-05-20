import * as Minio from 'minio';
import FileUtils from './file.utils.js';

class Logger {
  warn(data){
    console.log(data)
  }
  error(data){
    console.log(data)
  }
  debug(data){
    console.log(data)
  }
}

class MinioService {
  constructor() {
    this.MINIO_BUCKET = process.env.MINIO_BUCKET || 'mercado';
    this.logger = new Logger();
    this.minioClient = new Minio.Client({
      port: +process.env.MINIO_PORT || 9001,
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      useSSL: process.env.MINIO_USE_SSL === 'true' || false,
      accessKey: process.env.MINIO_USER || 'minio-user',
      secretKey: process.env.MINIO_PASSWORD || '123456789',
      region: process.env.MINIO_REGION || 'us-east-1',
    });
  }

  async getFileBytes(objectName) {
    try {
      // Crear un buffer para almacenar los bytes del archivo
      let chunks = [];

      // Crear un stream para leer el archivo
      let stream = await this.minioClient.getObject(this.MINIO_BUCKET, objectName);
      // console.log(stream)

      // Leer los datos del archivo y agregarlos al buffer
      stream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // Manejar cualquier error que pueda ocurrir al leer el archivo
      stream.on('error', (err) => {
        console.error(`Error al leer el archivo: ${err}`);
        return null;
      });

      // Devolver los bytes del archivo cuando se haya terminado de leer
      return new Promise((resolve, reject) => {
        stream.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
      });
    } catch (err) {
      console.error(`Error al obtener el archivo: ${err}`);
      return null;
    }
  }


  async fileExistsInMinio(filename, folder) {
    const stream = this.minioClient.listObjects(this.MINIO_BUCKET, folder, true);
    for await (const obj of stream) {
      console.log({obj})
      console.log('DEBUG:',`${folder}/${filename}`)
      if (obj.name === `${folder}/${filename}`) {
        return true;
      }
    }

    return false;
  }

  async saveBase64ToMinio(base64Data, filename, folder) {

    if (!base64Data || !folder) {
      return { response: null, name: null, error: 'Invalid base64 data or folder'}
    }

    // const fileExists = await this.fileExistsInMinio(filename, folder);
    // console.log({fileExists})
    // if (fileExists) {
    //   return { response: null, name: null, error: 'El archivo ya existe'}
    // }

    const fileBuffer = Buffer.from(base64Data, 'base64');
    const fileName = `${folder}/${filename}`;

    try {
      const minioResponse = await this.minioClient.putObject(
        this.MINIO_BUCKET,
        fileName,
        fileBuffer,
      );

      this.logger.debug(minioResponse);

      return { response: minioResponse, name: fileName, error: null}
    } catch (e) {
      console.error(e);
      // throw new Error('');
      return { response: null, name: null, error: 'Error al guardar el archivo en MinIO'}
    }
  }

  async getFileUrl(objectName) {
    try {
      const url = await this.minioClient.presignedGetObject(
        this.MINIO_BUCKET,
        objectName,
      );

      if (!url) {
        return null;
      }

      return url;
    } catch (e) {
      console.error(e);
      throw new Error('Error al obtener la URL del objeto de MinIO');
    }
  }



  async saveMultipleImagesToMinio(images, folder) {
    const promises = images.map(async (imageData) => {
      const { name } = await this.saveBase64ToMinio(
        imageData.file,
        imageData.extension,
        folder
      );

      return await name;
    });

    const results = await Promise.allSettled(promises);

    const savedImageurls = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    return { urls: savedImageurls };
  }

  async deleteProductImages(imageUrls, folder) {
    try {
      for (const imageUrl of imageUrls) {
        const objectName = this.getObjectNameFromUrl(imageUrl);
        if (!objectName) {
          this.logger.warn(`Invalid object name extracted from URL: ${imageUrl}`);
          continue;
        }
        await this.minioClient.removeObject(this.MINIO_BUCKET, `${folder}/${objectName}`);
        this.logger.debug(`Image deleted from MinIO: ${objectName}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting images from MinIO: ${error}`);
      throw new Error('Failed to delete product images from MinIO');
    }
  }

  getObjectNameFromUrl(imageUrl) {
    try {
      const urlParts = imageUrl.split('/');
      const objectName = urlParts[urlParts.length - 1];

      if (!objectName || objectName.trim() === '') {
        throw new Error('Invalid object name extracted from URL');
      }
      return objectName;
    } catch (error) {
      this.logger.error(`Error extracting object name from URL: ${error}`);
      return null;
    }
  }
}

export default  MinioService ;
