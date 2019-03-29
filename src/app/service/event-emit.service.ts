import { Injectable, EventEmitter } from "@angular/core";
@Injectable()
export class EmitService{
    
    public eventEmit = new EventEmitter();

    constructor() {
        // this.eventEmit = new EventEmitter();
    };

    ngOnInit() {

    };
};