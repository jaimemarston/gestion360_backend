import xlsx from "xlsx";
import fs from "fs";
import { LugarComision } from "../models/index.js";

const importPlacesCommission = async (filePath) => {
    const workbook = xlsx.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);


    for (let i = 0; i < rows.length; i++) {
        const keys = Object.keys(rows[i]);
        const newObj = {};
        for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            newObj[key.toLowerCase()] = rows[i][key];
            delete rows[i][key];
        }
        rows[i] = newObj;
    }


    const result = await LugarComision.bulkCreate(rows, {
        ignoreDuplicates: true
    });


    fs.unlinkSync(filePath);
    return result;
}

export default {
    importPlacesCommission
}