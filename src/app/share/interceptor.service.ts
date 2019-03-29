import { Injectable } from '@angular/core';
import { HttpEvent,HttpInterceptor,HttpHandler,HttpRequest,HttpResponse ,HttpHeaders, HttpErrorResponse, JsonpClientBackend} from "@angular/common/http";
import { Observable  } from "rxjs";
import { catchError } from 'rxjs/operators' ;
import { TranslateService } from '@ngx-translate/core';
import { SesssionStorageService } from '../../app/service/common/storage/sessionStorage.service'
@Injectable()
export class LoginInterceptor implements HttpInterceptor {
  constructor(
    private translate : TranslateService ,
    private sgo : SesssionStorageService
  ){};


  postUrl : object = {} ;
  usrInfo : Object ;
  intercept(req: HttpRequest<any>, next: HttpHandler): any {

    const reg = /.*\/assets\/\d+/g ;

    let headerObj = {} ;

    let headers ;

    let obj = {
        'withCredentials': true ,
        setParams : {
          // "lang" : this.sgo.get("locale")
        }
    };

    if(window['JsInterface']){
      let usrInfo = window['JsInterface']['getUserInfo']();
      window.sessionStorage['usrInfo'] = usrInfo ;
    };


    if(reg.test(req.url)){

      req = req.clone(obj);

      return next.handle(req);
    }else{

      // headerObj['g2-uid'] = "122";

      // window.sessionStorage['usrInfo'] = JSON.stringify({
      //   "areaCode":"86",
      //   "birthday": null,
      //   "birthplace":"dftrse",
      //   "createTime":"1540611156000",
      //   "educationBackground":4,
      //   "email":"155444",
      //   "gender":0,
      //   "id":175,
      //   "latitude":"30.338489",
      //   "loanPurpose":0,
      //   "longitude":"120.108377",
      //   "mac":"262e7e8a9bf795e97104e34e066f6360",
      //   "maritalStatus":4,
      //   "modifyTime":"1542098476000",
      //   "phoneNumber":"17609885098",
      //   "token":"9536cc39-70f3-4ee4-9fd8-66bff89fea5a",
      //   "vest":"6"
      // });
      
      if(window.sessionStorage['usrInfo']){
        let usrInfo = JSON.parse(window.sessionStorage['usrInfo']);
        headerObj['g2-token'] = usrInfo['token'] ;
        headerObj['g2-latitude'] = usrInfo['latitude'] ;
        headerObj['g2-longitude'] = usrInfo['longitude'] ;
        headerObj['g2-deviceId'] = usrInfo['mac'] ;
        headerObj['g2-uid'] = usrInfo['id'].toString() ;
        if (usrInfo['vest']) {
          headerObj['g2-vest'] = usrInfo['vest'] ;
        }
      };

      if(window.sessionStorage['useLocInfo'] && window.sessionStorage['useLocInfo'] !== 'undefined'){

        let useLocInfo = JSON.parse(window.sessionStorage['useLocInfo']);
        headerObj['g2-latitude'] = useLocInfo['latitude'] ;
        headerObj['g2-longitude'] = useLocInfo['longitude'] ;
        this.sgo.remove(['useLocInfo']);
      };

      headers = new HttpHeaders(headerObj);

      obj['headers'] = headers ;

      req = req.clone(obj);

      return next.handle(req) ;
    };
      // .pipe(
      //   catchError( error => {a

      //     let code = error['status'] ;

      //     if(code == 401){
      //       this.router.navigate(['/login']) ;
      //     }else{
      //       this.router.navigate(['error' , code]);
      //     };

          // return throwError(error) ;
      //   })
      // )
  };
};