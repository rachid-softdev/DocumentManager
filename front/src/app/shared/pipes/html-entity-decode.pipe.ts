import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable()
@Pipe({
  name: 'HTMLEntityDecode',
})
export class HTMLEntityDecode implements PipeTransform {
  transform(value: string | null | undefined) {
    if (!value) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }
}
