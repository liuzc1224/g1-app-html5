import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http' ;

@Injectable()
export class IncomeService{
    constructor(
        private http : HttpClient
    ){} ;


    get(){
        let url = GLOBAL.API.review.income ;
        return this.http.get(url) ;
    } ;

    put(formData : FormData){
        let url = GLOBAL.API.review.income ; 
        return this.http.post(url , formData) ;
    };
};