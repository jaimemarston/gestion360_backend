import * as crypto from 'crypto';

class FileUtils {
  static generateRandomFileName(originalName) {
    const randomString = crypto.randomBytes(16).toString('hex');
    const fileExtension = originalName.split('.').pop(); // Obtener la extensión del archivo

    return `${randomString}.${fileExtension}`;
  }

  static generateRandomString(length = 10) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);

      result += characters.charAt(randomIndex);
    }

    return result;
  }

  static extractFirstEightCharacters(input) {
    const response = input.split('-')[0];
    return response;
  }
}

export default FileUtils;
