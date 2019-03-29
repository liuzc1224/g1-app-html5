import { Component,OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams,Events,LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SesssionStorageService } from '../../app/service/common/storage';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { Response } from "../../app/share/model" ;
import { LoanService, BankService } from '../../app/service/loan/index';
import { TipService } from '../../app/service/common';
import { PayService } from '../../app/service/pay';
import { AboutMoneyPage } from 'pages/about-money/about-money';
import { ENV } from '@app/env';
declare var md5: any;
declare var OpenPay: any;

/**
 * Generated class for the RepayOnlinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'repayOnline'
})
@Component({
  selector: 'page-repay-online',
  templateUrl: 'repay-online.html',
  providers: [PayService]
})
export class RepayOnlinePage implements OnInit {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingSer: LoadingController,
    private tipSer: TipService,
    private paySer: PayService,
    private translate: TranslateService,
    private sgo: SesssionStorageService,
    private loanSer: LoanService,
    private emit: Events,
    ) {}
    ngOnInit() {
      let ngThis = this;
      this.initPage();

      this.emit.subscribe("account", data => {

        let clabeNum = data['clabeNum'] + "";
        // clabeNum = "***" + clabeNum.slice(-4);
        this.selectCard = data;
        this.clabeNum = clabeNum
        this.bankCardNum = data.bankCardNum
        // this.emit.unsubscribe("account");

        this.showLoading();
        const client_id = ENV.client_id;
        console.log('ENV.client_id: '+client_id)
        if ( client_id == 'value_dev' ) { // 开发、测试
          OpenPay.setSandboxMode(true);
          OpenPay.setId("mrwtpcxewjjnxky4azxy");
          OpenPay.setApiKey("pk_8e09e53683514f65a6c9495be358193c");
        } else { // 预发、生产
          OpenPay.setSandboxMode(false);
          OpenPay.setId("ms40cmtm3tbbxs06bnzd");
          OpenPay.setApiKey("pk_9975c23449cc48e9a6611da77b48dd3e");
        }
        OpenPay.token.create({
            "card_number": data.bankCardNum,
            "holder_name": data.userName,
            "expiration_year": data.expireYear,
            "expiration_month": data.expireMonth,
            "cvv2": data.cvv2
      }, function(response){
        ngThis.commonLoading.dismiss();
        console.log(response.data.id)
        window.sessionStorage.setItem('tokenId', response.data.id)
      }, function (error){
        ngThis.commonLoading.dismiss();
          var desc = error.data.description != undefined ?
          error.data.description : error.message;
          console.log("ERROR [" + error.status + "] " + desc);
          // ngThis.tipSer.operateFail('Error de cuenta,elija la cuenta de reembolso de nuevo.');
          ngThis.tipSer.operateFail('Error de cuenta: ' + desc);
          ngThis.bankCardNum = null;
      });

    });
    }

  selectCard: any;
  orderNo: string;
  orderId: string;
  clabeNum: string;
  bankCardNum: string;
  orderInfo: {realRepayMoney:string};
  repayMoney: string;
  tokenId: string;
  
  ionViewDidLoad() {
		document.title = 'Reembolsar ahora'
  }
  
  initPage() {
    this.orderInfo = this.navParams.data['borrowInfo'];
    console.log(this.orderInfo)
    if(this.orderInfo){
      this.orderNo = this.orderInfo['orderNo'];
      this.orderId = this.orderInfo['orderId'];
      this.repayMoney = this.orderInfo['currentRepay'];
    }
    this.getLang()
  };
  chooseCard(){
    this.navCtrl.push("UserAccountPage", {
      selectCard: this.selectCard,
      from: 2
    });
  }

  //弹出密码框
  submitInfoForm() {
    this.tokenId=this.sgo.get("tokenId") ;
    this.strategy.hasPass();
  };

  padTitle: string;
  languagePack: Object;
  showForget: boolean = false;
  padShow: boolean = false;
  commonLoading: any;
  validateForm: FormGroup;
  payPassword:number;

  private strategy: { hasPass: Function, noPass: Function } = {
    hasPass: () => {

        this.showForget = true;

        this.padShow = true;

    },
    noPass: () => {
        this.padShow = true;
    }
  };
  getLang() {
    this.translate.stream(['common','repayQr'])
      .subscribe(
        res => {
          this.languagePack = res;

          document.title = 'Reembolsar en línea';

          this.padTitle = res['common']['tips']['inputPass'];
        }
      )
  };

  showLoading() {

    this.commonLoading = this.loadingSer.create({
        content: 'loading..'
    });

    this.commonLoading.present();

  };

  //校验密码支付
  makeCash() {

    // this.padShow = false;
    let postData:any = {};

    postData.deviceSessionId = OpenPay.deviceData.setup();
    postData.orderNo = this.orderNo;
    postData.orderId = this.orderId;
    postData.reAmount = this.repayMoney;
    postData.cardNumber = this.bankCardNum;
    postData.tokenId = this.tokenId;
    console.log(this.tokenId)

    this.showLoading();

    postData.password = md5(this.payPassword.toString());
    console.log(postData)
    this.paySer.repay(postData)
      .pipe(
        filter((res: Response) => {

          this.commonLoading.dismiss();

          if (res.success === false) {
              this.tipSer.operateFail(res.message);
          };

          return res.success === true;

        })
      )
      .subscribe(
        res => {
          let tip = this.languagePack['repayQr']['success'];
          this.tipSer.operateSuccess(tip);
          this.backHistory(true) ;
        }
      );
  };
  numComplete($evnet) {

    let pass = $evnet.data;
    this.payPassword = pass
    this.makeCash();
  }

  numCancel($evnet) {
    this.padShow = false;
  };
  backHistory(mark : boolean = false){
    this.navCtrl.pop()
      .then(
        () => {
          this.emit.publish("repay" , this.selectCard)
        }
      )
  };
}
