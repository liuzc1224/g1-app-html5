import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FeedService } from '../../app/service/feedBack';
import { Response } from '../../app/share/model';
import { TipService } from '../../app/service/common';
import { filter } from 'rxjs/operator/filter';
/**
 * Generated class for the FeedBackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'FeedBack'
})
@Component({
  selector: 'page-feed-back',
  templateUrl: 'feed-back.html',
  providers: [FeedService]
})
export class FeedBackPage {

  tabsInfo: Array<object>;
  selectId: number;
  content : string ;
  parent : Object ;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private FeedService: FeedService,
    private TipService: TipService
  ) {
    this.parent = this ;
  }

  ionViewDidLoad() {
    this.FeedService.get()
      .subscribe(
        (res: Response) => {
          this.tabsInfo = (<Array<object>>res.data);
        }
      )

      document.title = 'Comentarios' ;
  }
  choose(e, id) {
    this.selectId = id;
    // let ele = e.target;
    // let sibEle = this.siblings(ele);
    // this.addClass(ele, 'active');
    // this.removeClass(sibEle, 'active');
  }

  putInfo(parent) {
    // if(window['JsInterface']){

    //   window['JsInterface']['backToIndex'](JSON.stringify({
    //     "reload" : true
    //   }));
    // };

    let info = this.content ;
    let id = this.selectId ;
    if(!info || !id){
      return
    } ;

    const data = {
      content: info,
      opinionConfigId: id
    };
    this.FeedService.put(data)
      .subscribe(
        (res : Response) => {
          if (res.success) {

            this.content = '' ;

            this.selectId = null ;

            this.TipService.operateSuccess() ;
          }else{
            this.TipService.fetchFail(res.message);
          }
        }
      );
  };

  siblings(elm) {
    let a = [];
    let p = elm.parentNode.children;
    for (let i = 0, pl = p.length; i < pl; i++) {
      if (p[i] !== elm) a.push(p[i]);
    }
    return a;
  }
  hasClass(obj, cls) {
    let reg = new RegExp('(^|\\s)' + cls + '(\\s|$)');
    return reg.test(obj.className)
  };
  addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
  }
  removeClass(obj, cls) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');

    if (obj.length) {
      for (let i = 0; i < obj.length; i++) {
        if (this.hasClass(obj[i], cls)) {
          obj[i].className = obj[i].className.replace(reg, ' ');
        }
      }
    } else {
      if (this.hasClass(obj, cls)) {
        obj.className = obj.className.replace(reg, ' ');
      }
    }
  };

}
