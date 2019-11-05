import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emailName'
})
export class EmailNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value.substr(0, value.indexOf('@')); ;
  }

}
