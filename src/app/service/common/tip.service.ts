import { ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';


@Injectable()
export class TipService{
    constructor(
        private toast : ToastController ,
        private translate : TranslateService
    ){};

    private languagePack : Object ;

    private msgPosition : string = 'top' ;

    private msgDuration : number = 3000 ;

    private getLang(){
        return new Observable( resolve => {
            if(this.languagePack){
                resolve.next(this.languagePack) ;
            }else{
                this.translate.stream("common")
                    .subscribe(
                        res => {
                            resolve.next(res) ;
                        }
                    )
            }
        });

    };

    operateSuccess(msgStr : string = ''){
        const msgCss = 'c-msgToast-success' ;

        this.getLang()
            .subscribe(
                (res : Object ) => {

                    const msg = res['tips'] ;

                    this.toast.create({
                        message : msg['operateSuccess'] + msgStr ,
                        duration : this.msgDuration ,
                        position : this.msgPosition ,
                        cssClass : msgCss
                    }).present() ;

                }
            );
    };

    operateFail(msgStr : string = ''){
        const msgCss = 'c-msgToast-fail' ;

        this.getLang()
            .subscribe(
                (res : Object) => {
                    const msg = res['tips'] ;

                    this.toast.create({
                        message : msg['operateFailWithReason'] + msgStr ,
                        duration : this.msgDuration ,
                        position : this.msgPosition ,
                        cssClass : msgCss
                    }).present();
                }
            )
    };

    fetchFail(msgStr : string = ''){
        const msgCss = 'c-msgToast-fail' ;
        this.getLang()
            .subscribe(
                (res : Object) => {
                    const msg = res['tips'] ;
                    this.toast.create({
                        message : msg['fetchFailReason'] + msgStr ,
                        duration : this.msgDuration ,
                        position : this.msgPosition ,
                        cssClass : msgCss
                    }).present() ;
                }
            )
    };

    operateWarn(msgStr : string){
        const msgCss = 'c-msgToast-warn' ;
        this.toast.create({
            message : msgStr ,
            duration : this.msgDuration ,
            position : this.msgPosition ,
            cssClass : msgCss
        }).present() ;
        // this.getLang(){

        // }
    }
};