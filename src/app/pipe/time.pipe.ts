import { Pipe, PipeTransform } from '@angular/core';
import { dataFormat } from '../share/tool';
@Pipe({
    name: 'TimePipe'
})
export class TimePipe implements PipeTransform {
    transform(value: any, format: string = 'y-m-d'): any {

        if (value) {
            return dataFormat(value, format);
        }else{
            return 'no';
        }
    };
}