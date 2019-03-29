import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpHeaders } from '@angular/common/http' ;
import { ObjToQuery } from '../ObjToQuery';

@Injectable()
export class LoanService{
    constructor(
        private http : HttpClient
    ){} ;

    getPurpose(){
        const url = GLOBAL.API.loan.purpose ;
        return this.http.get(url)
    };

    createOrder( data : Object){
        const url = GLOBAL.API.loan.create ;

        const header = new HttpHeaders()
            .set("Content-type" , 'application/json');

        return this.http.post(url , data , {
            headers : header
        })
    };

    queryPlan( orderId : number){

        const url = GLOBAL.API.loan.queryPlan + "/" + orderId ;

        return this.http.get(url);
    };

    queryRepayPlan( orderId : number, pra: object ){
        const url = GLOBAL.API.loan.queryRepayPlan + "/" + orderId ;

        const pram = ObjToQuery(pra);

        return this.http.get(url, {
            params: pram
        });
    }
    
    getQrCode(data : Object){
        const url = GLOBAL.API.loan.getRepayId;
        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;
        return this.http.post(url , data , {
            headers : header
        })
    };
    
    checkAuth(){
        const url = GLOBAL.API.loan.checkAuth ;
        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;
        return this.http.get(url,{
            headers: header
        });
    }

    enchashment(data : Object , orderId : number){
        const url = GLOBAL.API.loan.enchashment  + "/" + orderId;
        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;
        return this.http.patch(url , data , {
            headers : header
        })
    };

    hasPass(){
        const url = GLOBAL.API.loan.checkPass ;

        return this.http.get(url) ;
    };


    setPass( data : Object ){
        const url = GLOBAL.API.loan.setPass ;

        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;

        return this.http.patch(url , data , {
            headers : header
        });
    }

    postContract( data : object ){
        const url = GLOBAL.API.loan.contract;
        const header = new HttpHeaders()
            .set("Content-type" , 'application/json');

        return this.http.post(url , data , {
            headers : header,
            responseType: 'text'
        })
    }
    //借款用途点击统计
    countNewUserClick(){
        const url = GLOBAL.API.loan.countNewUserClick;
        return this.http.get(url) ;
    }
    //提现点击统计
    cashNewUserClick(){
        const url = GLOBAL.API.loan.cashNewUserClick;
        return this.http.get(url) ;
    }

    getUploadApp(){
        const url = GLOBAL.API.loan.apkVersion;

        return this.http.get(url) ;
    }
    //保存借款调研2
    getPurposeTwo(data){
        const url = GLOBAL.API.loan.condition;

        let header = new HttpHeaders()
        .set("Content-type" , 'application/json');

        return this.http.put(url, data, {
            headers: header
        }) ;
    }


};