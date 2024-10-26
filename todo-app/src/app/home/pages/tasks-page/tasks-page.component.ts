import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, BehaviorSubject, debounceTime, takeUntil, filter, Observable, tap, take, skip } from 'rxjs';
import { DeleteTaskModalComponent } from '../../components/delete-task-modal/delete-task-modal.component';
import { EditTaskModalComponent } from '../../components/edit-task-modal/edit-task-modal.component';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Task } from '../../models/task.model';
import { MatButtonModule } from '@angular/material/button';
import { CreateTaskModalComponent } from '../../components/create-task-modal/create-task-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { selectAllTasks } from '../../../store/selectors/tasks.selectors';
import { loadTasks, updateTask } from '../../../store/actions/tasks.actions';
import { LoadingService } from '../../../shared/services/loading.service';
import { TaskCompletenessDirective } from '../../directives/task-completeness.directive';
import { TrucateTextPipe } from '../../../shared/pipes/trucate-text.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    NgIf,
    MatDialogModule,
    MatIconModule,
    DatePipe,
    AsyncPipe,
    NgFor,
    MatCheckboxModule,
    MatButtonModule,
    TranslateModule,
    TaskCompletenessDirective,
    TrucateTextPipe,
    MatTooltipModule
  ],
  templateUrl: './tasks-page.component.html',
  styleUrls: ['./tasks-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksPageComponent implements OnInit, OnDestroy {
  public tasksLoading = false;
  public unsub$: Subject<boolean> = new Subject<boolean>();
  public updateCompleteness$ = new Subject<Task>();
  public tasks$!: Observable<Task[]>

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store: Store,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.startLoading()
    this.tasks$ = this.store.select(selectAllTasks).pipe(
      skip(1),
      tap((tasks) => {
        this.loadingService.stopLoading();
      }),
    );
    this.store.dispatch(loadTasks());
    this.updateCompleteness$.pipe(
      debounceTime(300),
      takeUntil(this.unsub$)
    ).subscribe((task: Task) => {
      task = {...task, completed: task.completed ? 0 : 1};
      this.store.dispatch(updateTask({ task }));
      this.cd.markForCheck();
    });
  }

  public updateTasks<T>(dialog: MatDialogRef<T>): void {
    dialog.afterClosed().pipe(
      takeUntil(this.unsub$),
      filter(result => result === true)
    ).subscribe(() => {
      this.store.dispatch(loadTasks());
      this.loadingService.stopLoading;
      this.cd.markForCheck();
    });
  }

  public openCreateTaskDialog(): void {
    const dialog: MatDialogRef<CreateTaskModalComponent> = this.dialog.open(CreateTaskModalComponent, {
      width: '350px',
    });
    this.updateTasks(dialog);
  }

  public openDeleteTaskDialog(task: Task): void {
    const dialog: MatDialogRef<DeleteTaskModalComponent> = this.dialog.open(DeleteTaskModalComponent, {
      width: '350px',
      data: { task }
    });
    this.updateTasks(dialog);
  }

  public openEditTaskDialog(task: Task): void {
    const dialog: MatDialogRef<EditTaskModalComponent> = this.dialog.open(EditTaskModalComponent, {
      width: '350px',
      data: { task }
    });
    this.updateTasks(dialog);
  }

  public updateTaskCompleteness(task: Task): void {
    this.updateCompleteness$.next(task);
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
