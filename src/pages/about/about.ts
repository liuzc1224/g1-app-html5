import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';


@IonicPage({
  name: 'AboutPage'
})
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController) {

  }

  listConf: Array<string> = ['InvestListPage', 'HelpCenter', 'FeedBack', 'AboutMoney', 'AboutUs']

  goToPage(page) {
    // console.log(page);
    this.navCtrl.push(page)
  }
  userPhone: string;
  ngOnInit() {
    let rootUserInfo = JSON.parse(window.sessionStorage.usrInfo);
    let tel = rootUserInfo.phoneNumber;
    // let mtel = tel.substr(0, 3) + '****' + tel.substr(7);
    this.userPhone = tel;
  }

}
