import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TipService } from '../../app/service/common'
import { LoanService } from '../../app/service/loan/index';
import { filter } from 'rxjs/operators' ;
import { Response } from '../../app/share/model';
declare var JsBarcode : any ;

/**
 * Generated class for the RepayRealPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'repayReal'
})
@Component({
  selector: 'page-repay-real',
  templateUrl: 'repay-real.html',
})
export class RepayRealPage implements OnInit {

  constructor(
    private nav : NavController ,
    private msg : TipService ,
    private loanSer : LoanService ,
    private navParams : NavParams
  ){} ;

  ngOnInit(){
    let orderInfo = this.navParams.get("orderInfo");
    console.log(orderInfo)
    this.orderNo = orderInfo.orderNo;

    let postData:any = {};
    postData.orderNo = this.orderNo;
    postData.orderId = orderInfo.orderId;
    postData.reAmount = orderInfo.currentRepay;

    this.loanSer.getQrCode(postData)
      .pipe(
        filter(
          ( res : Response ) => {

            if(res.success === false){
                this.msg.operateFail(res.message) ;
            };

            return res.success === true && res.data != null;
          }
        )
      )
      .subscribe(
        (res : Response ) => {

          let data = <string>res.data ;

          this.qrCode = data ;

          // JsBarcode("#repayQr_qr", data , {
          //     format: "CODE128" ,
          //     displayValue : true ,
          //     text: ""
          // });

          this.resMark = true ;

          let img = <HTMLImageElement>document.querySelector("#repayQr_qr") ;

          img.src = data
          let img_sacle = <HTMLDivElement>document.querySelector("#repayQr_img") ;

          img_sacle.style.width = window.innerHeight - 20 +'px' ;
          img_sacle.style.height = window.innerWidth - 20 +'px' ;

          img_sacle.style.webkitTransformOrigin = "0px" + " 0px" ;

          img_sacle.style.background = `url(${img.src})`;
        }
      )
  };

  orderNo : string ;

  qrCode : any ;

  resMark : boolean = false ;

  back(){
      this.nav.pop() ;
  };

  showModal(){
      let el = <HTMLDivElement>document.querySelector(".repayQr_modal") ;
      el.style.opacity = '1' ;
      el.style.display = "block" ;
  };

  hideModal(){
      let el = <HTMLDivElement>document.querySelector(".repayQr_modal") ;
      el.style.display = "none" ;
  };

  clipText(){
    const text  = '123' ;
    this.msg.operateSuccess() ;
    // this.clip.copy(text);

  };

  ionViewDidLoad() {
    document.title = 'Ir a tienda para reembolsar'
  }

}
