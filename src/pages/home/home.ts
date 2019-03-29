import { Component, AfterViewInit, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { NavController, Option, IonicPage } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { HomeService, OrderService } from '../../app/service/homeService';
import { Response } from '../../app/share/model';
import { TipService } from '../../app/service/common';
import { filter } from 'rxjs/operators';
import { LoanPurposePage } from '../../pages/loanPurpose/loanPurpose';
import { SesssionStorageService } from '../../app/service/common/storage';
import { LoanService } from '../../app/service/loan/loan.service';
import { Move } from '../../app/share/tool';

@IonicPage({
  name: 'HomePage'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HomeService, OrderService]
})
export class HomePage{

  // lbCof: Array<string> = ["El usuario de 132****0849 consiguió 2000 pesos", "El usuario de 132****0849 consiguió 2000 pesos", "El usuario de 132****0849 consiguió 2000 pesos", "El usuario de 132****0849 consiguió 2000 pesos"];
  
  // @ViewChild('outWrap') outWrap;
  // timer : any;//定时器

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    private HomeService: HomeService,
    private OrderService: OrderService,
    private TipService: TipService,
    private sgo: SesssionStorageService,
    private loanSer: LoanService
  ) {
    this.fakeNumber() ;
  };
  
  textList : Array< String > = [] ;

  ionViewDidLoad() {

    this._initPage();

    // window['navCtrl'] = this.navCtrl;

    // window['historyBack'] = this.back;

    // this.moveStart();

  };

  private fakeNumber(times : number = 5 ){
    
    const randomNum = function(n : number){
        var t=''; 
        for(var i=0;i<n;i++){ 
          t+=Math.floor(Math.random()*10); 
        };
        return t; 
    } ;

    let arr = [] ;

    for(let i = 0 ; i < times ; i++ ){

      let text = `El usuario de ****${randomNum(4)} consiguió 2000 pesos` ;

      arr.push(text) ;
    };

    this.textList = arr ;

  };

  initCarousel(){

    var speed = 100; 

    var $marquee = document.querySelector('.marquee');

    var $marqueeContent = $marquee.querySelector('.content');
    
    $marqueeContent.innerHTML = $marqueeContent.innerHTML + $marqueeContent.innerHTML + $marqueeContent.innerHTML ;

    var contentWidth = $marqueeContent.getBoundingClientRect().width;

    if (contentWidth <= 0) {
      return;
    };

    contentWidth = contentWidth / 3
  
    var onceTime = contentWidth / speed * 1000 ;
  
    $marqueeContent['style'].animationDuration = onceTime + "ms";

  };

  pageStep: any ;

  orderInfo: Object;

  _initPage() {

    this.OrderService.get()
      .pipe(
        filter((res: Response) => {

          if (res.success !== true) {
            this.TipService.fetchFail(res.message);
          };

          if(res.data === null){
            this.pageStep = 'frist' ;
          };
          return res.success === true && res.data != null;

        })
      )
      .subscribe(
        (res: Response) => {

          //status 1 审核中  9 审批拒绝 4 待还款 6 已完成  3 审核通过
          const orderStatus = res.data['status'] || "frist" ;

          this.pageStep = "frist" ;

          this.orderInfo = res.data;

          this.sgo.set("orderInfo", res.data);

          if (this.pageStep == 4) {
            this.getRepayPlan();
          };

        }
      );
  };

  loanInfo: { money: any, days: any } = {
    money: 500,
    days: 7
  };

  valueChanged($event, type) {
    type === 'money' && (this.loanInfo.money = parseInt($event));
    type === 'days' && (this.loanInfo.days = parseInt($event));
  };

  makeLoan() {
    if (!this.loanInfo.days || !this.loanInfo.money) {
      this.translate.stream('homePage.tips')
        .subscribe(
          res => {
            this.TipService.operateWarn(res['invalidValue'])
          }
        )
      return;
    };

    const para = this.loanInfo;

    this.sgo.set("loanInfo", para);

    this.navCtrl.push(LoanPurposePage);
  };

  btnEvent() {

    if (this.pageStep === 6 || this.pageStep === 'frist') {
      this.makeLoan();
    };

    if (this.pageStep == 9) {
      this.makeLoan();
    };

    if (this.pageStep == 3) {
      this.navCtrl.push("EnchashmentPage");
    };

  };

  repayPlan: Object;
  getRepayPlan() {
    const orderId = this.orderInfo['id'];
    this.loanSer.queryPlan(orderId)
      .pipe(
        filter(
          (res: Response) => {
            if (res.success === false) {
              this.TipService.fetchFail(res.message);
            };
            return res.success === true;
          }
        )
      )
      .subscribe(
        (res: Response) => {
          this.repayPlan = res.data;
        }
      )
  };
  
  // back() {
  //   window['navCtrl'].pop();
  // }
};