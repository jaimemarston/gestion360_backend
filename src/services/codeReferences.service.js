import xlsx from "xlsx";
import fs from "fs";
import { RegistroCodigoReferencia } from "../models/index.js";

const importCodeReferences = async (filePath) => {


  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  rows.shift();

/*   for (let i = 0; i < rows.length; i++) {
    const keys = Object.keys(rows[i]);
    const newObj = {};
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      newObj[key.toLowerCase()] = rows[i][key];
      delete rows[i][key];
    }
    rows[i] = newObj;
  }
 */

  const data = rows.map((row) => {
    const registro = {
      codigo: row[0].toString().trim(),
      nombre: row[1].toString().trim(),
      exonerar: row[2].toString().trim(),
      categoria: row[3].toString().trim(),
      codidoc: row[4].toString().trim(),
      ruc: row[5].toString().trim(),
      telf: row[6].toString().trim(),
      direc: row[7].toString().trim(),
      apaterno: row[8].toString().trim(),
      amaterno: row[9].toString().trim(),
    };
    return registro
  });

  const result = await RegistroCodigoReferencia.bulkCreate(data, {
    ignoreDuplicates: true
  });


  fs.unlinkSync(filePath);
  return result;
}

export default {
  importCodeReferences
}