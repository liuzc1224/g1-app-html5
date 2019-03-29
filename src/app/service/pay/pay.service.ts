import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpHeaders } from '@angular/common/http' ;


@Injectable()
export class PayService{
    constructor(
        private http : HttpClient
    ){} ;

    repay( data : Object ){
        const url = GLOBAL.API.pay.repay;

        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;
        return this.http.post(url , data , {
            headers : header
        }) ;
    }

    getRePayStatus(id : number) {
        let url = GLOBAL.API.pay.getRePayStatus + `/${id}`;
        return this.http.get(url);
    };
    // put(formData : FormData){
    //     let url = GLOBAL.API.homePage.income ;
    //     return this.http.post(url , formData) ;
    // };
};