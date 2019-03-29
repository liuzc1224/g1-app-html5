import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http' ;


@Injectable()
export class HelpService{
    constructor(
        private http : HttpClient
    ){} ;


    get(){
        let url = GLOBAL.API.helpCenter.tabsGroup;
        return this.http.get(url) ;
    } ;
};