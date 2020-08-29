# React + TypeScript + Antd + Koa 实现Excel导入导出功能

最近在写业务的时候遇到了很多涉及Excel导入和导出表单的需求，这里就写一个Demo来记录一下相关的实现方法吧。前端使用的是React + TypeScript + Antd实现前端读取Excel，后端用的是TypeScript+Koa导出Excel。[Demo源码地址](https://github.com/xpsilvester/React-TypeScript-Antd-Koa)

## Excel的读取

Excel的读取主要是前端读取数据再向后端发请求，页面显示上用的是`Antd`中的`Upload `组件，前端读取功能用的是`xlsx`,相关的核心代码如下（具体代码可参考：[App.tsx](https://github.com/xpsilvester/React-TypeScript-Antd-Koa/blob/master/src/App.tsx)）：

```tsx
import React from 'react';
import XLSX from 'xlsx'
import { Button, Form,message,Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';

//读取excel数据
  const onImportExcel = (file: RcFile, FileList: RcFile[]) => {
    let resData = [{}];// 存储获取到的数据
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(file);  //二进制
    fileReader.onload = event => {
      try {
        const result = event.target?.result;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            resData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            break; // 如果只取第一张表，就取消注释这行
          }
        }
        //将读取到的数据传入后台
        imoprtExcelApi(resData).then(res => {
          message.success("导入成功")
          console.log('res',res.data)
        }).catch(e=>{
          message.error("导入失败")
        })
        console.log(resData)
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件类型不正确')
        console.log('文件类型不正确',e);
      }

    };
    return false
  }
```

## Excel的导出

Excel的导出主要就是后端返回相应数据，前端将`Blob`数据导出成Excel文件。后端主要是通过`excel-export`模块导出数据。相关核心代码如下（具体代码可参考：[demo](https://github.com/xpsilvester/React-TypeScript-Antd-Koa/tree/master/mock/src)）：

- 后端

```ts
const nodeExcel = require('excel-export');
export default class ImportService {
  export = ()=>{
    const conf : any = {};
    conf.stylesXmlFile = "styles.xml";
    conf.name = "mysheet";
    //定义表格列字段
    conf.cols = [{
      caption:'项目类型',
        type:'string'
    },{
      caption:'项目名称',
      type:'string'
    },{
      caption:'数量',
      type:'number'
    },{
      caption:'组别',
      type:'string'			
    },{
      caption:'日期',
      type:'string'				
    }]
    //填充数据（可根据需求自行导出相应数据）
    conf.rows = [
      ['重要项目','哈哈哈哈',1,'第一组','2020-08-27'],
      ['不重要项目','哈哈',10,'第二组','2020-08-28']
    ];
    let result = nodeExcel.execute(conf);
    return new Promise(resolve => resolve(Buffer.from(result, 'binary')));
  }
}
```

- 前端

```tsx
//导出excel
const exportExcelApi = () => {
  return service.request({
    url: "/exportexcel",
    method: "post",
    data: {},
    responseType: 'blob'
})
//导出excel
const onExportExcel = () => {
    exportExcelApi().then(res=>{
      //将后台返回的Blob数据导出excel
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', "项目列表.xlsx");
      document.body.appendChild(link);
      link.click();
    })
}
```

## 更多

[源码地址](https://github.com/xpsilvester/React-TypeScript-Antd-Koa)

## 参考文章

[react学习之js-xlsx导入和导出excel表格](https://www.cnblogs.com/yuyuan-bb/p/10965104.html)

[nodejs 中 excel-export 使用介绍](https://www.cnblogs.com/wxmdevelop/p/4451734.html)