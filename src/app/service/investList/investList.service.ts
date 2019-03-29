import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting';
import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http';


@Injectable()
export class recordService {
    constructor(
        private http: HttpClient
    ) { };


    get(data : Object) {
        let url = GLOBAL.API.investList.record;
        const para = ObjToQuery(data);
        return this.http.get(url,{
            params : para
        });
    };
    // put(formData : FormData){
    //     let url = GLOBAL.API.homePage.income ;
    //     return this.http.post(url , formData) ;
    // };
};