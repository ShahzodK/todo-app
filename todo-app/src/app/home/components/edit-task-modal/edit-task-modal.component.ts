import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { Task, UpdateTaskReq } from '../../models/task.model';
import { Store } from '@ngrx/store';
import { loadTask, loadTaskSuccess, updateTask } from '../../../store/actions/tasks.actions';
import { selectCurrentTask } from '../../../store/selectors/tasks.selectors';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf } from '@angular/common';
import { LoadingService } from '../../../shared/services/loading.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-task-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    ReactiveFormsModule,
    NgIf,
    TranslateModule,
    AsyncPipe
  ],
  templateUrl: './edit-task-modal.component.html',
  styleUrl: './edit-task-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditTaskModalComponent {

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: { task: Task },
              private dialogRef: MatDialogRef<EditTaskModalComponent>,
              private store: Store,
              public loadingService: LoadingService,
              private translate: TranslateService,
              private toastr: ToastrService
            ) {}
  
  public unsub$: Subject<boolean> = new Subject<boolean>();
  public currentTask!: Task;

  public taskForm = new FormGroup({
    title: new FormControl<string>('', [ Validators.required ]),
    description: new FormControl<string>('', [ Validators.required ]),
    completed: new FormControl<boolean>(false, [ Validators.required ]),
  });

  ngOnInit(): void {
      this.loadingService.startLoading();
      this.store.dispatch(loadTask({id: this.data.task.id}));
      this.store.select(selectCurrentTask).pipe(
        takeUntil(this.unsub$),
        filter((data: Task | null) => data !== null)
      ).subscribe({
        next: (data) => {
          this.loadingService.stopLoading();
          this.currentTask = data;
          this.taskForm.patchValue({
            title: data.title,
            description: data.description,
            completed: data.completed === 1 ? true : false,
          })
        },
        error: (error) => {
          this.loadingService.stopLoading();
          this.translate.get('Errors.default').pipe(
            take(1)
          ).subscribe((text) => {
            this.toastr.error(error.message, text);
            this.dialogRef.close(false);
          });
        }
      })
  }

  public editTask(): void {
    if(this.taskForm.valid){
      const formValues: UpdateTaskReq = {
        id: this.currentTask.id,
        title: this.taskForm.get('title')?.value!,
        description: this.taskForm.get('description')?.value!,
        completed: this.taskForm.get('completed')?.value ? 1 : 0,
      };
      this.store.dispatch(updateTask({task: formValues}))
      this.dialogRef.close(true);
    };
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
    this.store.dispatch(loadTaskSuccess({task: null}))
  }
}
