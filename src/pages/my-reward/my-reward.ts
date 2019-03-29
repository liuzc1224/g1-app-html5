import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { RewardSerive } from '../../app/service/reward';
import { Response } from '../../app/share/model/response.model';
import { TipService } from '../../app/service/common';

import { SearchModel } from './search.model';

/**
 * Generated class for the MyRewardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */



@IonicPage({
  name: "myReward"
})
@Component({
  selector: 'my-reward',
  templateUrl: 'my-reward.html',
  providers: [RewardSerive]
})
export class MyRewardPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private rewardSer: RewardSerive,
    private msg: TipService,
    private loadingSer: LoadingController,
  ) { }

  commonLoading: any;
  rewardList: Array<object> = [];
  totalPage: number = 1;
  infiniteScroll: any ;

  regx: RegExp = /-/g;

  dw: Array<string> = ['','MXN','%','días']
  searchModel: SearchModel = new SearchModel();



  ionViewDidLoad() {

    document.title = "Mi cupón";
    this.getList();
    if (window['JsInterface']) {
      window['JsInterface']['showTicket']('1');
    }
    console.log('ionViewDidLoad');
  }

  ngOnDestroy(){
    if (window['JsInterface']) {
      window['JsInterface']['showTicket']('0');
    }
    console.log('ngOnDestroy');
  }

  getList(infiniteScroll? : any) {
    this.showLoading();
    let __this = this;

    this.rewardSer.getReward(this.searchModel)
      .subscribe(
        (res: Response) => {

          __this.commonLoading.dismiss();
          if (res.page) {
            this.totalPage = res.page['totalPage'] ;
            console.log(this.totalPage);
          }
          if (res.success) {
            // this.rewardList = <Array<object>>res.data;
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
            this.msg.fetchFail(res.message);
          }
        }
      )
  }

  //tab切换
  choose(type) {
    this.searchModel.status = type ;
    this.rewardList = [];
    this.searchModel.currentPage = 1 ;
    this.getList();
    if (this.infiniteScroll) {
      this.infiniteScroll.enable(true);
    }
  }

  showLoading() {

    this.commonLoading = this.loadingSer.create({
      content: 'loading...'
    });

    this.commonLoading.present();
  };

  goDetail(item){
    this.navCtrl.push('rewardDetail', {
      info: item
    })
  }

  //下滑动加载数据
  doInfinite(infiniteScroll) {
    this.searchModel.currentPage += 1;
    this.infiniteScroll = infiniteScroll;
    this.getList(infiniteScroll)
  }

}
