import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SesssionStorageService } from '../../app/service/common/storage';
import { LoanService, BankService } from '../../app/service/loan/index';
import { filter } from 'rxjs/operators';
import { Response } from '../../app/share/model';
import { TipService } from '../../app/service/common';
import { TranslateService } from '@ngx-translate/core';
import { AccountComponent } from '../../components/account/account';
import { CashProPage } from '../../components/cashPro/cashPro';
import { detaildService } from '../../app/service/investList';

declare var md5: any;

@IonicPage({
    name: "EnchashmentPage"
})
@Component({
    selector: 'page-enchashment',
    templateUrl: 'enchashment.html',
    providers: [detaildService]
})
export class EnchashmentPage implements OnInit {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private fb: FormBuilder,
        private sgo: SesssionStorageService,
        private loanSer: LoanService,
        private tipSer: TipService,
        private bankSer: BankService,
        private modalCtrl: ModalController,
        private loadingSer: LoadingController,
        private translate: TranslateService,
        private emit: Events,
        private detaildService: detaildService,
    ) { };

    ngOnInit() {

        this.initForm();

        this.emit.subscribe("account", data => {
            let clabeNum = data['clabeNum'] + "";
            clabeNum = "***" + clabeNum.slice(-4);
            this.selectCard = data;
            this.validateForm.patchValue({
              bankCardId: data['id'],
              bankCardNum: clabeNum
            })
            // this.emit.unsubscribe("account");


        });
        this.emit.subscribe("couponId", data => {
            if (data['success']) {
                this.couponInfo = data['item'];
                this.couponId = data['couponId']
                this.getRepayPlan();
                // this.emit.unsubscribe("couponId");

            };
        });
    };

    couponId: any;

    couponInfo: object;

    validateForm: FormGroup;

    orderInfo: Object;

    pageInfo: Object;

    repayPlan: any;

    couponAmount: any;

    first: boolean = true;

    second: boolean = false;

    feeStatus: Boolean = true;

    showFee(){
        this.feeStatus = !this.feeStatus;
    }

    //查看合同
    gotoheml(url) {
        const cat = this.orderInfo && this.orderInfo['cat'];
        const orderId = this.orderInfo && this.orderInfo['id']
        const couponId = this.couponId;

        this.navCtrl.push(url, { orderId: orderId, cat: cat , couponId: couponId });
    }

    initForm() {

        this.validateForm = this.fb.group({
            "amount": [null, Validators.required],
            "bankCardId": [null, [Validators.required]],
            "payPassword": [null, [Validators.required]],
            "bankCardNum": [null]
        });

        let orderInfo = null;
        
        if (window['JsInterface']) {
            orderInfo = JSON.parse(window['JsInterface']['getOrderInfo']());

            this.orderInfo = orderInfo;
            
            this.getRepayPlan();

            // this.getBankList();

            this.checkPass();

            setTimeout(() => {

                this.getLang();
                this.getdetaild();

            }, 20);

        };

    };

    //获取详情数据
    getdetaild() {

        this.detaildService.get(this.orderInfo['id'])
            .subscribe(
                (res: Response) => {
                    if (res.success) {
                        res.data['overDueRateMoney'] = res.data['overDueRateMoney'] || "0.00";
                        res.data['couponAmount'] = res.data['couponAmount'] === 0 ? "0" : "-" + res.data['couponAmount'];
                        res.data['currentRepay'] ? res.data['currentRepay'] : '0.00';
                        this.pageInfo = (<object>res.data);
                    } else {
                        this.tipSer.fetchFail(res.message);
                    }
                }
            )
    }

    //获取页面展示信息
    getRepayPlan() {

        if (!this.orderInfo) {
            return false;
        }
        const orderId = this.orderInfo['id'];
        const amount = this.orderInfo['auditMoney'];
        let pra = {};
        pra['couponId'] = this.couponId;
        this.loanSer.queryRepayPlan(orderId, pra)
            .pipe(
                filter(
                    (res: Response) => {

                        if (res.success === false) {
                            this.tipSer.fetchFail(res.message);
                        };

                        return res.success === true;
                    }
                )
            )
            .subscribe(
                (res: Response) => {

                    this.validateForm.patchValue({

                        amount: amount
                    });

                    this.repayPlan = res.data['afterCouponAmount'];
                    this.couponAmount = res.data['couponAmount'];
                }
            );
    };

    enum_bank: Array<{ name: string, value: number }> = [];

    //获取用户银行卡
    getBankList() {
        this.bankSer.usrBankList()
            .pipe(
                filter((res: Response) => {

                    if (res.success === false) {
                        this.tipSer.fetchFail(res.message);
                    };

                    return res.success === true && res.data != null;
                })
            )
            .subscribe(
                res => {
                    const data = [];

                    if ((<Array<Object>>res.data['bankCardInfoVOS']).length > 0) {
                        (<Array<Object>>res.data['bankCardInfoVOS']).forEach(item => {
                            data.push({
                                value: item['id'],
                                name: item['bankName']
                            })
                        });

                        let cardId = res.data['bankCardInfoVOS'][0]['id'] + "";
                        let bankCardNum = res.data['bankCardInfoVOS'][0]['clabeNum'] + "";
                        if(bankCardNum){
                            bankCardNum = "***" + bankCardNum.slice(-4);
                        }


                        this.validateForm.patchValue({
                            bankCardId: cardId,
                            bankCardNum: bankCardNum
                        })
                    };

                    this.sgo.set("bankInfo", res.data['bankCardInfoVOS'][0]);
                    this.sgo.set("userAllName", res.data['userFullName']);
                    this.enum_bank = data;
                }
            )
    };

    gotoChoose() {
        this.navCtrl.push('chooseReward', { auditMoney: this.orderInfo['auditMoney'], couponId: this.couponId })
    }

    //改变勾选框
    accept(type: string) {
        // this.enum_bank = [ {name : 'bank', value : 11}, {name : 'bank', value : 11} ];
        this[type] = !this[type];
    };

    //弹出密码框
    submitInfoForm() {
        //提现点击统计
        this.loanSer.cashNewUserClick()
            .subscribe()

        if (this.hasPayPass === true) {
            this.strategy.hasPass();
        };

        if (this.hasPayPass === false) {
            this.strategy.noPass();
        };
    };

    private strategy: { hasPass: Function, noPass: Function } = {
        hasPass: () => {
            this.padTitle = this.languagePack['common']['tips']['inputPass'];

            this.showForget = true;

            this.padShow = true;

        },
        noPass: () => {
            this.padShow = true;
        }
    };

    commonLoading: any;

    showLoading() {

        this.commonLoading = this.loadingSer.create({
            content: 'loading..'
        });

        this.commonLoading.present();

    };

    languagePack: Object;

    currentStep: number = 0;


    getLang() {
        this.translate.stream(['review', 'common'])
            .subscribe(
                res => {
                    this.languagePack = res;
                    console.log(res)
                    document.title = 'Solicitud de retirar';

                    this.padTitle = res['common']['tips']['setPass'];

                }
            )
    };

    hasPayPass: boolean = false;

    //检测是否有支付密码
    checkPass() {
        this.loanSer.hasPass()
            .pipe(
                filter((res: Response) => {
                    if (res.success === false) {
                        this.tipSer.fetchFail(res.message);
                    };

                    return res.success === true;
                })
            )
            .subscribe(
                res => {
                    this.hasPayPass = (<boolean>res.data);
                }
            );
    };

    //查询用户个人银行列表
    makeAccount() {

        let len = this.enum_bank.length;

        // if(len > 0){

        // }else{

        // this.navCtrl.push(AccountComponent);
        this.navCtrl.push("UserAccountPage", {
            selectCard: this.selectCard,
            from: 1
          });
        // };

    };

    //校验密码提现
    makeCash() {
        this.showLoading();
        const id = this.orderInfo['id'];

        this.padShow = false;
        let postData = this.selectCard;

        postData['couponId'] = this.couponId;
        postData['amount'] = this.orderInfo['auditMoney'];
        postData['bankCardId'] = this.selectCard['id'];
        postData['orderId'] = this.orderInfo['id']

        postData.payPassword = md5(this.validateForm.value.payPassword.toString());
        

        this.loanSer.enchashment(postData, id)
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
                    this.navCtrl.push(CashProPage, { id: id });
                }
            );
    };

    numCancel($evnet) {
        this.padShow = false;
    };

    numComplete($evnet) {

        let pass = $evnet.data;

        if (this.hasPayPass) {
            this.validateForm.patchValue({
                payPassword: pass
            });
            this.makeCash();
        } else {
            this.setPass(pass);
        };
    }

    padShow: boolean = false;

    padTitle: string;

    selectCard: any;

    showForget: boolean = false;

    setPass(pass: number) {

        this.showLoading();

        let md5Pass = md5(pass.toString());

        let postData = {
            payPassword: md5Pass
        };
        this.loanSer.setPass(postData)
            .pipe(
                filter((res: Response) => {

                    if (res.success === false) {
                        this.tipSer.operateFail(res.message);
                    };

                    this.commonLoading.dismiss();

                    return res.success === true;
                })
            )
            .subscribe(
                (res: Response) => {

                    let tip = this.languagePack['common']['tips']['setPassSuccess'];

                    this.tipSer.operateSuccess(tip);

                    this.padShow = false;

                    this.hasPayPass = true;
                }
            )
    };
};