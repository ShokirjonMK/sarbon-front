import * as XLSX from "xlsx";
import FileSaver from "file-saver";

export const excelExport = (data: any, fileName: string) => {
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataN = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataN, fileName + '.xlsx');
} 