import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataTable'
})
export class DataTablePipe implements PipeTransform {

  transform(array: any[],field:string, value: string): any {
    if (!array) return array;
    if(!value) return array;
    return array.filter(it => it[field].indexOf(value) != -1);
  }

}
