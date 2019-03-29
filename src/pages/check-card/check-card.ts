import { Component, OnInit } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { TranslateService } from '@ngx-translate/core';
import { TipService, SesssionStorageService } from '../../app/service/common';
import {BankService, LoanService} from "../../app/service/loan";
import {filter} from "rxjs/operators";
import {Response} from "../../app/share/model";
declare var OpenPay : any ;

/**
 * Generated class for the CheckCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'checkCard'
})
@Component({
  selector: 'page-check-card',
  templateUrl: 'check-card.html',
})
export class CheckCardPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    private emit : Events ,
    private tipSer : TipService ,
    private bankSer: BankService,
    private translate: TranslateService,
    public navParams: NavParams) {
  }
  ngOnInit(){
    this.initForm();
    this.getLang();
  }
  ionViewDidLoad() {
    document.title = 'Verificar la tarjeta'
  }

  cardInfo:any;
	deviceSessionId: string;

  initForm() {
    this.validateForm = this.fb.group({
      "account": [null, [Validators.required, Validators.maxLength(20)]],
      "cvv2": [null,  [Validators.required, Validators.maxLength(3)]],
      "month": [null, [Validators.required, Validators.maxLength(2)]],
      "year": [null, [Validators.required, Validators.maxLength(2)]],
      "userName": [null, Validators.required],
    });
		OpenPay.setSandboxMode(false);
		this.deviceSessionId = OpenPay.deviceData.setup();


    this.cardInfo = this.navParams.data
    console.log(this.cardInfo)
    this.validateForm.patchValue({
      // bankName: this.cardInfo.bankName,
      account: this.cardInfo.bankCardNum,
      userName: this.cardInfo.userName
    })




  };
  validateForm: FormGroup;
  languagePack: Object;

  getLang() {
    this.translate.stream(['account'])
      .subscribe(
        res => {
          this.languagePack = res;
          document.title = 'Editar la cuenta bancaria';
        }
      )
  };

  submit(){
    let postData = this.validateForm.value;
    console.log(this.languagePack)
    let accountValidate = OpenPay.card.validateCardNumber(postData.account);
    let cvv2Validate = OpenPay.card.validateCVC(postData.cvv2);
    let tip = this.languagePack['account']['ops'];
    if(!accountValidate){
      this.tipSer.operateFail(tip.bankCardNum) ;
    }else if(!cvv2Validate){
      this.tipSer.operateFail(tip.cvv2) ;
    }else{
      this.tipSer.operateSuccess(tip.success);
      this.cardInfo.isCheck = 0;
      this.cardInfo.deviceSessionId = this.deviceSessionId;
      this.cardInfo.bankCardNum = postData.account;
      this.cardInfo.cvv2 = postData.cvv2;
      this.cardInfo.expireMonth = postData.month;
      this.cardInfo.expireYear = postData.year;
      this.bankSer.update(this.cardInfo)
      .pipe(
        filter((res: Response) => {

          if (res.success === false) {
            this.tipSer.fetchFail(res.message);
          }

          return res.success === true && res.data != null;
        })
      )
      .subscribe(
        (res: Response) => {
          console.log(res)
          if (res.success) {
          } else {
              this.tipSer.fetchFail(res.message);
          }
        }
      )
      
      this.backHistory(true)
    }
  }

  backHistory(mark : boolean = false){
    this.navCtrl.pop()
      .then(
        () => {
          this.emit.publish("checkCard" , true)
        }
      )
  };
}
