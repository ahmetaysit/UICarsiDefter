import { saveAs } from "file-saver";
import XLSX from "xlsx";
import {
  strToArrBuffer,
  excelSheetFromAoA,
} from "../utils/DataUtils";

export function DownloadExcel(sheetName, columns, data) {
  const wb = {
    SheetNames: [sheetName],
    Sheets: {},
  };
  wb.Sheets[sheetName] = excelSheetFromAoA(createSheetData(columns, data));
  const fileExtension = getFileExtension();
  const fileName = getFileName(sheetName);
  const wbout = XLSX.write(wb, {
    bookType: fileExtension,
    bookSST: true,
    type: "binary",
  });
  saveAs(
    new Blob([strToArrBuffer(wbout)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    fileName
  );
}

const createSheetData = (columns, data) => {
  const sheetData = [columns.map((column) => column.title)];
  data.forEach((row) => {
    const sheetRow = [];
    columns.forEach((column) => {
      const itemValue = row[column.field];
      sheetRow.push(isNaN(itemValue) ? itemValue || "" : itemValue);
    });

    sheetData.push(sheetRow);
  });
  return sheetData;
};

const getFileName = (sheetName) => {
  return getFileNameWithExtension(sheetName, getFileExtension());
};

const getFileExtension = () => {
  return "xlsx";
};
const getFileNameWithExtension = (filename, extension) => {
  return `${filename}.${extension}`;
};