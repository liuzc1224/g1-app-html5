import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { TabsPage } from '../pages/tabs/tabs';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { TipService } from '../../src/app/service/common/tip.service'
import { SesssionStorageService } from './service/common';
import { KeyboardUtil } from './share/tool';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'LoanPurpose';
  // EnchashmentPage
  // ReviewPage
  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private translate: TranslateService,
    // private tipSer : TipService ,
    private sgo: SesssionStorageService
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // let suportLocale = this.enumSer.getLocale() ;

      let broswerLang = window.navigator.language;
      // let isSuport = broswerLang.replace("-" , "_") ;
      KeyboardUtil.FixAndroidKeyBoardHideInput();
      this.translate.setDefaultLang(broswerLang.match(/zh-CN|es-MX/) ? broswerLang : 'es-MX');
      this.translate.stream(["menus"])
        .subscribe(
          res => {
            this.sgo.set("menus", res);
          }
        )
    });
  };
};