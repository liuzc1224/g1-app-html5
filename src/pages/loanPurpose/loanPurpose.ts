import { Component , OnInit } from '@angular/core';
import { NavController, LoadingController, IonicPage } from 'ionic-angular';
import { LoanService } from '../../app/service/loan';
import { SesssionStorageService } from '../../app/service/common/storage' ;
import { filter } from 'rxjs/operators' ;
import { TipService } from '../../app/service/common' ;
import { Response } from '../../app/share/model';
import { TranslateService } from '@ngx-translate/core' ;

@IonicPage({
    name : "LoanPurpose"
})
@Component({
    selector: 'loan-purpose',
    templateUrl: 'loanPurpose.html' ,
})
export class LoanPurposePage implements OnInit{

    constructor(
        private navCtrl: NavController ,
        private sgo : SesssionStorageService ,
        private loanSer : LoanService ,
        private tipSer : TipService ,
        private transSer : TranslateService ,
        private loadingSer : LoadingController,
    ){};

    ngOnInit(){
        this.loanInfo = this.sgo.get("loanInfo") ;

        this.getPurpose() ;

        this.getLang() ;

        this.getApkUrl() ;

        if (window['JsInterface'] && window['JsInterface']['uploadfaceNow']) {
            this.showapkmask = false ;
        }else{
            this.showapkmask = true ;
        }

    };

    showapkmask : boolean = false ;

    loanInfo : Object ;

    purposeList : Array < Object > ;

    currentId : number ;

    getPurpose(){
        this.loanSer.getPurpose()
            .pipe(
                filter( (res : Response) => {

                    if(res.success === false){
                        this.tipSer.fetchFail(res.message);
                    };

                    return res.success === true ;
                })
            )
            .subscribe(
                ( res : Response ) => {

                    (res.data && res.data[0]) && (this.currentId = res.data[0]['id']) ;


                    this.purposeList = (< Array< Object > >res.data) ;
                }
            )
    }
    selectItem(id : number){

        this.currentId = id ;

    };


    submitRealName(){

        // if (this.showapkmask) {
        //     return false ;
        // }



        if(this.currentId){
            this.showLoading();
            //统计点击次数
            this.loanSer.countNewUserClick()
                .subscribe()

            let loanInfo = null ;
            if(window['JsInterface']){
                loanInfo = JSON.parse(window['JsInterface']['getLoanInfo']());
            };

            const borrowAmount = loanInfo['money'] ;

            const daysType = loanInfo['days'] ;

            const loanPurpose = this.currentId ;

            const PostData = {
                "borrowAmount":borrowAmount ,
                "daysType": daysType,
                "loanPurpose": loanPurpose
            };

            this.sgo.set("loanInfo" , PostData) ;

            this.navCtrl.push("LoanInvestigation") ;

            this.commonLoading.dismiss();

        }else{
            const msg = this.languagePack['loanPurpose']['chosePurpose'] ;
            this.tipSer.operateWarn(msg) ;
        };
    };

    languagePack : Object ;
    getLang(){

        this.transSer.stream(['common' , 'loanPurpose'])
            .subscribe(
                res => {
                    this.languagePack = res ;
                    document.title = 'Elegir uso de préstamo' ;
                }
            )
    };

    commonLoading: any;

    showLoading() {

        this.commonLoading = this.loadingSer.create({
            content: "loading..."
        });

        this.commonLoading.present();
    };
    apkUrl : string ;

    getApkUrl(){
        this.loanSer.getUploadApp()
            .subscribe(
                ( res:Response ) => {
                    if (res.success) {
                        this.apkUrl = res.data['apkUrl'] ;
                    }
                }
            )
    }

    uploadnewapp(){

        window.location.href = this.apkUrl ;

    }

    backHistory(){
        this.navCtrl.pop() ;
    };
};