import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, take, takeUntil } from 'rxjs';
import { Task } from '../../models/task.model';
import { Store } from '@ngrx/store';
import { deleteTask } from '../../../store/actions/tasks.actions';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoadingService } from '../../../shared/services/loading.service';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-task-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    AsyncPipe,
    TranslateModule,
    MatButtonModule
  ],
  templateUrl: './delete-task-modal.component.html',
  styleUrl: './delete-task-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteTaskModalComponent {

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: { task: Task },
              public dialogRef: MatDialogRef<DeleteTaskModalComponent>,
              private store: Store,
              public loadingService: LoadingService
            ) {}
            
  public unsub$: Subject<boolean> = new Subject<boolean>();

  public deleteTask(id: number) {
      this.store.dispatch(deleteTask({ id: id }));
      this.dialogRef.close(true);
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
