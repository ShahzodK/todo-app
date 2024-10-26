import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {  map, take } from 'rxjs/operators';
import { selectAllTasks } from '../../store/selectors/tasks.selectors';

export function checkTaskTitleForDuplicate(store: Store): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return store.select(selectAllTasks).pipe(
      take(1),
      map(tasks => {
        if (tasks.length === 0) {
          return null;
        }
        const titleExists = tasks.some(task => task.title === control.value);
        return titleExists ? { duplicateTitle: true } : null;
      })
    );
  };
}
