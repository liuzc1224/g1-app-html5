import { Injectable } from '@angular/core';
import { GLOBAL } from '../global_setting';
// import { ObjToQuery } from '../ObjToQuery' ;
// import { ObjToQueryString } from '../ObjToQueryString' ;
import { HttpClient } from '@angular/common/http';


@Injectable()
export class FeedService {
    constructor(
        private http: HttpClient
    ) { };


    get() {
        let url = GLOBAL.API.feedBack.getCof;
        return this.http.get(url);
    };

    put(data: object) {
        let url = GLOBAL.API.feedBack.opinion;

        return this.http.post(url, data);
    };
};