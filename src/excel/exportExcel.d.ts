// declare module 'exportExcel' {}
export interface ExportExcelData {
  titles: string[]
  data: any[][]
  name: string
}
export declare function exportExcel(
  allTable: ExportExcelData[],
  excelName: string,
)
