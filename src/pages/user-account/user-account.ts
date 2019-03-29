import { Component } from '@angular/core';
import {Events, IonicPage, LoadingController, NavController, NavParams, AlertController} from 'ionic-angular';
import {AnimateRefAst} from "@angular/animations/browser/src/dsl/animation_ast";
import {BankService, LoanService} from "../../app/service/loan";
import {filter} from "rxjs/operators";
import {Response} from "../../app/share/model";
import {SesssionStorageService, TipService} from "../../app/service/common";
import {AccountComponent} from "../../components/account/account";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the UserAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name : "UserAccountPage"
})
@Component({
  selector: 'page-user-account',
  templateUrl: 'user-account.html'
})
export class UserAccountPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams ,
    public alertCtrl: AlertController,
    private emit : Events ,
    private sgo: SesssionStorageService,
    private bankSer: BankService,
    private tipSer: TipService,
    private loanSer : LoanService,
    private translate: TranslateService,
    private loadingSer : LoadingController,
    private TipService: TipService,
  ){}

  ionViewDidEnter(){
    this.from = this.navParams.data['from'] || 0
    if(this.from == 1 || this.from == 2){
      this.showLoading();
      this.getBankList();
    }else{
      this.checkAuth();
    }
  };
  ionViewDidLoad() {
    document.title = 'cuenta bancaria'
  }
  getBankList() {
    this.bankSer.usrBankList()
      .pipe(
        filter((res: Response) => {

          if (res.success === false) {
            this.TipService.fetchFail(res.message);
          }

          return res.success === true && res.data != null;
        })
      )
      .subscribe(
        res => {
          this.commonLoading.dismiss();
          let cardData = [];

          if ((<Array<Object>>res.data['bankCardInfoVOS']).length > 0) {
            (<Array<Object>>res.data['bankCardInfoVOS']).forEach( (item,index) => {
              cardData.push({
                id: item['id'],
                bankCardNum:  item['bankCardNum'],
                bankName: item['bankName'],
                bankId: item['bankId'],
                clabeNum: item['clabeNum'],
                userName: item['userName'],
                isCheck: item['isCheck'],
                cvv2: item['cvv2'],
                expireMonth: item['expireMonth'],
                expireYear: item['expireYear']
              });
              if(this.navParams.data['selectCard'] && (item['id'] == this.navParams.data['selectCard']['id'])){
                this.selectCard = cardData[index];
              }
            });

          }

          this.sgo.set("userAllName", res.data['userFullName']);
          this.userAccountList = cardData;
        }
      )
  };

  changeChoose(userAccount){
    this.selectCard = userAccount ;
    if(this.from != 0){
      this.backHistory(true) ;
    }
  }
  checkCard(userAccount,$event){
    $event.stopPropagation();
    this.navCtrl.push("checkCard",userAccount) ;
  }

  addNewCard(){
      // this.navCtrl.push(AccountComponent);
      this.navCtrl.push("addAccount") ;
  };

  checkAuth(){
    this.loanSer.checkAuth()
      .subscribe(
        (res: Response) => {
          if (res.code == 0) {
            this.showLoading();
            this.getBankList();
          } else {
            this.showConfirm();
          }
        }
      )
  }
  showConfirm() {
    const confirm = this.alertCtrl.create({
      title: 'Préstamo ahora?',
      // message: '',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ir a préstamo',
          handler: () => {
            this.navCtrl.push('LoanPurpose') ;
          }
        }
      ]
    });
    confirm.present();
  }
  
  commonLoading : any ;

  showLoading(){
  
      this.commonLoading = this.loadingSer.create({
          content: 'loading...'
      });
  
      this.commonLoading.present() ;
  
  };

  backHistory(mark : boolean = false){
    this.navCtrl.pop()
      .then(
        () => {
          this.emit.publish("account" , this.selectCard)
        }
      )
  };

  userAccountList : Array < {bankName:string, bankCardNum:number}> ;
  selectCard: any;
  from: number = 0;
  // 1.借款选择账户 2.还款选择账户

}
