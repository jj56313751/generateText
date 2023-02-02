import FileSaver from 'file-saver'
import * as XLSX from 'xlsx' //这是vue3导入XLSX的方法
import XLSXS from 'xlsx-js-style'

// 導出Excel文件的方法
export function exportExcel(allTable, excelName) {
  // const xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换 如果不设置该属性80%可能导出的是0.8 可自行测试

  let wb = XLSX.utils.book_new()
  // 循环添加每一个表格/sheet
  allTable.forEach((table) => {
    const { titles, data, name } = table
    const json = data.map((item) => {
      const res = {}
      item.forEach((val, idx) => {
        res[titles[idx] || '描述-' + String(idx)] = val
      })
      return res
    })
    let ws = XLSX.utils.json_to_sheet(json) //通过工具将json转表对象
    XLSX.utils.book_append_sheet(wb, ws, name)
  })

  console.log(wb) //打印查看wb的结构

  // 循环找到对应的单元格修改样式
  // for (const key in wb.Sheets) {
  //   if (key === '損益表') {
  //     for (const k in wb.Sheets[key]) {
  //       // 非!开头的属性都是单元格
  //       if (!k.startsWith('!')) {
  //         const td = wb.Sheets[key][k]
  //         //td每一个是单元格对象 v：单元格内容 t：单元格内容类型如string s：单元格样式
  //         if (td.v.includes('(')) {
  //           // 設置字體顔色 帶括號的數字比如(1,000.00)改成紅色
  //           td.s = {
  //             font: {
  //               color: { rgb: 'ff0000' },
  //               // name: '仿宋',
  //               // sz: 20,
  //               // bold: true,
  //             },
  //             // border: {
  //             // top: {
  //             // style: 'thin',
  //             // color: { rgb: '000000' }
  //             // }
  //             // }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  const wbout = XLSXS.write(wb, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array',
  })
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `${excelName}.xlsx`,
    )
  } catch (e) {
    if (typeof console !== 'undefined') {
      console.log(e, wbout)
    }
  }
  return wbout
}
