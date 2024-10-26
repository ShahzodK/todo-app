import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject} from 'rxjs';
import { CreateTaskReq } from '../../models/task.model';
import { NgIf, DatePipe, AsyncPipe, NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoadingService } from '../../../shared/services/loading.service';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { createTask } from '../../../store/actions/tasks.actions';
import { checkTaskTitleForDuplicate } from '../../validators/checkTaskTitleForDuplicate';

@Component({
  selector: 'app-create-task-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    DatePipe,
    AsyncPipe,
    NgFor,
    MatCheckboxModule,
    MatButtonModule,
    MatLabel,
    TranslateModule
  ],
  templateUrl: './create-task-modal.component.html',
  styleUrl: './create-task-modal.component.scss'
})
export class CreateTaskModalComponent implements OnInit {

  constructor(
              private dialogRef: MatDialogRef<CreateTaskModalComponent>,
              public loadingService: LoadingService,
              private store: Store
            ) {}
  
  public unsub$: Subject<boolean> = new Subject<boolean>();

  public taskForm = new FormGroup({
    title: new FormControl<string>('',[ Validators.required, Validators.maxLength(15)]),
    description: new FormControl<string>('', [ Validators.required ]),
  });

  ngOnInit(): void {
    const titleControl = this.taskForm.get('title');
    if(titleControl) {
      titleControl.addAsyncValidators(checkTaskTitleForDuplicate(this.store));
    }
  }

  public createTask(): void {
    if(this.taskForm.valid){
      const formValues: CreateTaskReq = {
        title: this.taskForm.get('title')?.value!,
        description: this.taskForm.get('description')?.value!,
      };
      this.loadingService.startLoading();
      this.store.dispatch(createTask({task: formValues}));
      this.dialogRef.close(true);
    }
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
