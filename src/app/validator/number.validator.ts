import { FormControl } from "@angular/forms"
export const Number = {
    isNumber(value : FormControl){

        const val = value.value ;

        const reg = /\d+/g ;

        return (reg.test(val)) ? null :  { "invalid" : true } ;

    }
}; 