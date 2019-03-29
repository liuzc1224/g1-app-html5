import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http' ;


@Injectable()
export class AboutMoneyService{
    constructor(
        private http : HttpClient
    ){} ;


    get(){
        let url = GLOBAL.API.aboutMoney.repayment;
        return this.http.get(url) ;
    } ;
};