import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting' ;
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient , HttpHeaders } from '@angular/common/http' ;
import { ObjToQuery } from '../ObjToQuery';

@Injectable()
export class BankService{
    constructor(
        private http : HttpClient
    ){} ;

    getList(){
        const url = GLOBAL.API.loan.bank.list ;

        return this.http.get(url)

    };

    bind( data : Object ){
        const url = GLOBAL.API.loan.bank.bindBank ;

        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;
        return this.http.post(url , data , {
            headers : header
        }) ;
    }

    usrBankList(){
        const url = GLOBAL.API.loan.bank.usrBank ;

        return this.http.get(url) ;
    };

    update(data : Object){
        const url = GLOBAL.API.loan.bank.update ;

        const header = new HttpHeaders()
            .set("Content-type" , "application/json") ;

        return this.http.put(url, data  ,{
            headers : header
        })
    }
    //提现时获取优惠券
    getRewardList( param : object ){
        const url = GLOBAL.API.loan.bank.chooseCoupon;
        const parms = ObjToQuery(param);
        return this.http.get(url, {
            params : parms
        })
    }
    //绑卡点击统计
    countNewUserClickCashDetail(){
        const url = GLOBAL.API.loan.bank.countNewUserClickCashDetail ;

        return this.http.get(url) ;
    };

};