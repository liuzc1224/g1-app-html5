import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting';
import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http';


@Injectable()
export class contrOneService {
    constructor(
        private http: HttpClient,

    ) { };


    getCovers(id : number, data: object) {
        let url = GLOBAL.API.contractAll.covers + `/${id}`;
        const parm = ObjToQuery(data);
        return this.http.get(url, {
            params: parm
        });
    };

    getPayback(id : number, data: object) {
        let url = GLOBAL.API.contractAll.payback + `/${id}`;
        let param = ObjToQuery(data);
        return this.http.get(url, {
            params: param
        });
    };

    getAgreement(id : number) {
        let url = GLOBAL.API.contractAll.agreement + `/${id}`;
        return this.http.get(url);
    };
};