import xlsx from "xlsx";
import fs from "fs";
import { RegistroTipoDocumento,  } from "../models/index.js";


const importTipoDoc = async (filePath) => {
  

    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Eliminar la primera fila (encabezados de columna)
    rows.shift();
   
    
 

    // Crear un array de objetos para bulkCreate
  const data = rows.map((row) => {
    const registro = {
      codigo: row[0].toString().trim(),
      nombre: row[1].toString().trim(),

    };
    return registro
  });


  // Guardar los datos en la tabla
  const result = await RegistroTipoDocumento.bulkCreate(data, {
    ignoreDuplicates: true
  }); 




  fs.unlinkSync(filePath);
  return {data};
}
  
export default {
  importTipoDoc
}