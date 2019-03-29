import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http' ;


@Injectable()
export class HomeService{
    constructor(
        private http : HttpClient
    ){} ;


    get(){
        let url = GLOBAL.API.homePage.accountInfo;
        return this.http.get(url) ;
    } ;
    // put(formData : FormData){
    //     let url = GLOBAL.API.homePage.income ;
    //     return this.http.post(url , formData) ;
    // };
};
@Injectable()
export class OrderService {
    constructor(
        private http: HttpClient
    ) { };


    get() {
        let url = GLOBAL.API.homePage.orderStatus;
        return this.http.get(url);
    };
};