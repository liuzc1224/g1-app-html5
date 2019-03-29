import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { BankService } from '../../app/service/loan/index';
import { Response } from '../../app/share/model';
import { TipService } from '../../app/service/common';

import { SearchModel } from './search.model';

/**
 * Generated class for the ChooseRewardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'chooseReward'
})
@Component({
  selector: 'choose-reward',
  templateUrl: 'choose-reward.html',
})
export class ChooseRewardPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bankSer: BankService,
    private tipSer: TipService,
    private emit : Events ,
  ) {
    this.auditMoney = navParams.get('auditMoney');
    this.chooseId = navParams.get('couponId') || null;
    console.log(this.chooseId);
  }

  auditMoney: any;
  chooseId: any = null;
  dw: Array<string> = ['','MXN','%','días'];//单位配置
  regx: RegExp = /-/g;
  totalPage: number = 1;
  searchModel: SearchModel = new SearchModel();

  rewardList: Array<object> = [];
  ionViewDidLoad() {
    // document.title = "选择优惠券";
    this.getRewardList();
  }

  // 提现获取优惠券列表
  getRewardList(infiniteScroll? : any) {

    this.searchModel['borrowedMoney'] = this.auditMoney ;

    this.bankSer.getRewardList(this.searchModel)
      .subscribe(
        (res: Response) => {
          if (res.page) {
            this.totalPage = res.page['totalPage'] ;
          }
          if (res.success) {

            this.rewardList = this.rewardList.concat(<Array<object>>res.data)
            if (infiniteScroll) {
              infiniteScroll.complete();
              //toast提示
              if (this.searchModel.currentPage >= this.totalPage) {
                //如果都加载完成的情况，就直接 disable ，移除下拉加载
                infiniteScroll.enable(false);
                //toast提示
                console.log("已加载所有");
              }
            }

          } else {
            this.tipSer.fetchFail(res.message);
          }
        }
      )
  }
  //下滑动加载数据
  doInfinite(infiniteScroll) {
    this.searchModel.currentPage += 1;
    this.getRewardList(infiniteScroll)
  }



  choose(chooseId,data) {
    this.chooseId = chooseId;
    this.navCtrl.pop()
      .then(
        () => {
            this.emit.publish('couponId' , {
              success: true,
              item: data,
              couponId: chooseId
            })
        }
    )
  }

}
