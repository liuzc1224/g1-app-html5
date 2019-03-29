import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'NumPipe'
})
export class NumberPipe implements PipeTransform {
  transform( value: any , fixed : number = 2 ): any {

      if ( !value ) {

        return 0.00;

      }

      let number = value + '.' ;

      for(let i = 0 ; i < fixed ; i ++ ){

          number += "0"

      };

      return number ;
  };
}