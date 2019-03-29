import { Injectable } from '@angular/core';
import { Observable } from 'rxjs' ;

declare var ImageCompressor : any ;
@Injectable()
export class ImgService{
    constructor(){} ;

    imgToDataUri(file : any ) : Observable<any>{
        return new Observable(obsr => {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(file) ; 

            fileReader.onload = (url) => {
                obsr.next(url['target']['result']) ;
            };

        });
    };

    imgFileBySelector( selector : string) : File{
        const el = document.querySelector(selector) ; 
        if(el)
            return el['files'][0] ;
    };

    imgComporessor(file : File , quality = 0.6 ) : Observable< File | boolean >{
        return new Observable( obsr => {
            if(file){
                new ImageCompressor(file , {
                    quality : quality ,
                    success : ( result ) => {
                        obsr.next(result) ; 
                        obsr.complete() ;
                    }
                });
            }else{
                obsr.next(false) ;
                obsr.complete() ;
            };
        });
    };
}