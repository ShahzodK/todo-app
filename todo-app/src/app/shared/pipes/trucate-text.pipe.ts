import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trucateText',
  standalone: true,
  pure: true
})
export class TrucateTextPipe implements PipeTransform {

  transform(value: string, limit: number = 30): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }

}
