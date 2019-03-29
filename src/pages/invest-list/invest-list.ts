import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { recordService } from '../../app/service/investList';
import { TipService } from '../../app/service/common';
import { Response } from '../../app/share/model';
import { unixTime } from '../../app/share/tool';
import { SearchModel } from './search.model';
import { Observable } from 'rxjs';
// import { filter } from 'rxjs/operators';

/**
 * Generated class for the InvestListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'InvestListPage'
})

@Component({
  selector: 'page-invest-list',
  templateUrl: 'invest-list.html',
  providers: [recordService]
})
export class InvestListPage {

  cnt: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    private TipService: TipService,
    private recordService: recordService,
  ) { }

  ngOnInit() {

    this.getData()
      .subscribe(
        res => {
          if (res['page']) {
            this.totalPage = res['page']['totalPage'];
          }
          this._initPage(res['data']);
        }
      )
  }

  ionViewDidLoad() {
    document.title = 'lista' ;
  }

  listInfo: Array<object> = [];
  totalPage: number = 1;
  searchModel: SearchModel = new SearchModel();

  _initPage(data: Array<Object>) {
    this.listInfo = this.listInfo.concat(data);

  }

  getData(): Observable<Array<object>> {
    return new Observable(obsr => {
      const para = this.searchModel;
      this.recordService.get(para)
        .subscribe(
          (res: Response) => {
            if (res.success) {
              obsr.next((<Array<object>>res));
            } else {
              this.TipService.fetchFail(res.message);
            }
          }
        )
    });
  }

  //下滑动加载数据
  doInfinite(infiniteScroll) {
    this.searchModel.currentPage += 1;
    this.getData()
      .subscribe(
        res => {
          this._initPage(res['data']);
          infiniteScroll.complete();
          //toast提示
          if (this.searchModel.currentPage >= this.totalPage) {
            //如果都加载完成的情况，就直接 disable ，移除下拉加载
            infiniteScroll.enable(false);
            //toast提示
            console.log("已加载所有");
          }
        }
      )
  }

  //下拉刷型界面
  // doRefresh(refresher) {

  //   this.getData()
  //     .subscribe(
  //       res => {
  //         this.totalPage = res['page']['totalPage'];
  //         this.searchModel.currentPage = 1;
  //         this.listInfo = res['data'];
  //         console.log('加载完成后，关闭刷新');
  //         refresher.complete();
  //       }
  //     )
  // };

  backToindex(){
    if(window['JsInterface']){

      window['JsInterface']['backToIndex']("false");
    };
  };

  goToDetail(orderId) {

    this.navCtrl.push('InvestDetail', { orderId: orderId }) ;

  };
}
