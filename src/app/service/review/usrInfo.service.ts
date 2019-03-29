import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient, HttpHeaders } from '@angular/common/http' ;

@Injectable()
export class UsrInfoService{
    constructor(
        private http : HttpClient
    ){} ;


    get(){
        let url = GLOBAL.API.review.usrInfo ;
        return this.http.get(url) ;
    } ;

    put(data : Object){
        let url = GLOBAL.API.review.usrInfo ; 

        const header = new HttpHeaders()
            .set("Content-type" , "application/json");
            
        return this.http.put(url , data , {
            headers : header
        }) ;
    };

    stayTime( data : Object ){
        const url = GLOBAL.API.review.stayTime ;

        const header = new HttpHeaders()
            .set("Content-type" , "application/json");
        
        return this.http.post(url , data ,{
            headers : header
        });
    }
};