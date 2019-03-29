import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { detaildService } from '../../app/service/investList';
import { TipService } from '../../app/service/common';
import { PayService } from '../../app/service/pay';
import { TranslateService } from '@ngx-translate/core';
import { RepayQrComponent } from "../../components/repay-qr/repay-qr";
import { Response } from '../../app/share/model';
import { dataFormat } from '../../app/share/tool/date/date.tool';


/**
 * Generated class for the InvestDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'InvestDetail'
})
@Component({
  selector: 'page-invest-detail',
  templateUrl: 'invest-detail.html',
  providers: [detaildService, PayService]
})
export class InvestDetailPage {

  orderId: number;
  pageInfo: object;
  constructor(
    public navCtrl: NavController,
    private translate: TranslateService,
    public navParams: NavParams,
    public PaySer: PayService,
    private emit: Events,
    private detaildService: detaildService,
    private TipService: TipService,

  ) {
    this.orderId = navParams.get('orderId');
  }

  ngOnInit() {
    this.getLang();
    this._initPage();
    this.emit.subscribe("repay", data => {
      this.showBtn();
    });
  }

  ionViewDidLoad() {
    document.title = 'detalle'
  }

  btnStatus:string = '0';

  _initPage() {
    let param = this.orderId;

    if ( !param  ) {
      if (window['JsInterface']) {
        let data = window['JsInterface']['getOrderDetail']();
        data = data && data !== '{}' ? JSON.parse(data)['id'] : null;
        param = data;
        this.orderId = data;
      }
    }
    this.detaildService.get(param)
      .subscribe(
        (res: Response) => {
          if (res.success) {
            res.data['overDueRateMoney'] = res.data['overDueRateMoney'] || "0.00";
            res.data['couponAmount'] = res.data['couponAmount'] ? "-" + res.data['couponAmount'] : "0";
            res.data['currentRepay'] ? res.data['currentRepay'] : '0.00';
            res.data['beforeCouponRepayAmount'] ? res.data['beforeCouponRepayAmount'] : '0.00';
            res.data['borrowTime'] = dataFormat(res.data['borrowTime']);
            res.data['repayTime'] = dataFormat(res.data['repayTime']);
            this.pageInfo = (<object>res.data);
            this.showBtn();
          } else {
            this.TipService.fetchFail(res.message);
          }
        }
      )
  }

  showBtn(){
    let param = this.pageInfo['orderNo'];
    this.PaySer.getRePayStatus(param)
      .subscribe(
        (res: Response) => {
          if (res.success) {
            this.btnStatus = <string>res.data;
          } else {
            this.TipService.fetchFail(res.message);
          }
        }
      )
  }

  infoGroup: any;
  getLang() {
    this.translate.stream(['detail'])
        .subscribe(
            res => {
                this.infoGroup = res['detail']['infoGroup'];
                console.log(res)
            }
        )
  };
  
  goaboutmoney(){
    this.navCtrl.push('AboutMoney');
  }

  copy(txt){
    if (window['JsInterface']) {
      window['JsInterface']['cutText'](txt);
    }
  }
  realRepay(){
    let param = this.pageInfo;
    param['orderId'] = this.orderId;
    this.navCtrl.push('repayReal' , {
      orderInfo : param
  });
    
  }
  onlineRepay(){
    let borrowInfo = this.pageInfo
    borrowInfo['orderId'] = this.orderId;
    this.navCtrl.push('repayOnline',{
      borrowInfo: borrowInfo
    });
  }
}
