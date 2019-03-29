import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting';
import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http';


@Injectable()
export class detaildService {
    constructor(
        private http: HttpClient,

    ) { };


    get(id : number) {
        let url = GLOBAL.API.investList.detail + `/${id}`;
        return this.http.get(url);
    };
};