import { Component, OnInit } from '@angular/core';
import {NgUploaderOptions} from "ngx-uploader";

import * as XLSX from 'xlsx';
import {toInteger} from "@ng-bootstrap/ng-bootstrap/util/util";

type AOA = Array<Array<any>>;

interface Bloom {
    position: number;
    isin: string;
}


@Component({
  selector: 'excel-tables',
  templateUrl: 'excelTables.html',
  styleUrls: ['dataTables.scss']
})
export class ExcelTables {

    filterQuery = "";
    rowsOnPage = 10;
    sortBy = "email";
    sortOrder = "asc";

    data: AOA = [[1,2],[3,4]];

    source: Bloom[] = [];

    public checkboxModel = [];

    public checkboxPropertiesMapping = {
        model: 'checked',
        value: 'name',
        label: 'name',
        baCheckboxClass: 'class'
    };

    public fileUploaderOptions:NgUploaderOptions = {
        // url: 'http://website.com/upload'
        url: '',
    };

    constructor() {

  }

    toInt(num: string) {
        return +num;
    }

    sortByWordLength = (a: any) => {
        return a.city.length;
    }

    onFileChange(evt) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if(target.files.length != 1) { throw new Error("Cannot upload multiple files on the entry") };
        const reader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});

            /* grab first sheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* save data */
            this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header:1}));

            console.log(this.data);

            let keys = this.data[0];

            keys.forEach(value => this.checkboxModel.push({
                checked: false,
                name: value,
                class: 'col-md-4'
            }))

            let isin = keys.findIndex((value => value === 'ISIN'));
            let position = keys.findIndex((value => value === 'Position'));


            console.log(keys, isin);

            this.data = this.data.slice(1).filter((item) => item[isin]);

            this.data.forEach(item => {
                let bloom:Bloom = <Bloom>{};
                bloom.isin = item[isin];
                bloom.position =  toInteger(item[position]) ;
                let i = this.source.find(value => value.isin === bloom.isin);
                if(i) {
                    i.position += bloom.position;
                }else {
                    this.source.push(bloom);
                };
            });

            this.data.sort((a, b) => (a[isin] <  b[isin] ? -1 : 1) )

            console.log(this.data);
        };
        reader.readAsBinaryString(target.files[0]);
    }

    onFileChange2(evt) {
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if(target.files.length != 1) { throw new Error("Cannot upload multiple files on the entry") };
        const reader = new FileReader();
        reader.onload = (e: any) => {
            /* read workbook */
            const bstr = e.target.result;
            const wb = XLSX.read(bstr, {type:'binary'});

            /* grab first sheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* save data */
            this.data = <AOA>(XLSX.utils.sheet_to_json(ws, {header:1}));

            console.log(this.data);
        };
        reader.readAsBinaryString(target.files[0]);
    }
}
