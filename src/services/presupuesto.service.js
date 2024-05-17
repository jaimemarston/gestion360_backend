import xlsx from "xlsx";
import fs from "fs";
import { registroPresupuesto } from "../models/index.js";

const importBudgets = async (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    // Eliminar la primera fila (encabezados de columna)
    rows.shift();
    
    
  
    // Crear un array de objetos para bulkCreate
  const data = rows.map((row) => {
    const registro = {
      codigo: row[0].toString().trim(),
      nombreAbreviado: row[1].toString().trim(),
      nombreCompleto: row[2].toString().trim(),
      estado: true ?? row[0],
    };
    return registro
  });
  
  
  // Guardar los datos en la tabla
  const result = await registroPresupuesto.bulkCreate(data, {
    ignoreDuplicates: true,
  });

  fs.unlinkSync(filePath);
  return result;
}
  
export default {
  importBudgets
}