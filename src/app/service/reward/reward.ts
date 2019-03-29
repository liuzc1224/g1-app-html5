import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient, HttpHeaders } from '@angular/common/http' ;
import { ObjToQuery } from '../ObjToQuery';
@Injectable()
export class RewardSerive{
    constructor(
        private http : HttpClient
    ){} ;

    getReward(obj : object){
        let url = GLOBAL.API.reward.getCoupons ;
        let params = ObjToQuery(obj);
        return this.http.get(url, {
            params : params
        }) ;
    } ;

    getCenterReward(obj : object){
        let url = GLOBAL.API.reward.getCenterReward ;
        let params = ObjToQuery(obj);
        return this.http.get(url, {
            params : params
        }) ;
    }

    postCenterReward(obj : object){
        let url = GLOBAL.API.reward.postCenterReward ;
        let header = new HttpHeaders()
                        .set("Content-type" , "application/json");
        return this.http.post(url, obj, {
            headers: header
        }) ;
    }

};