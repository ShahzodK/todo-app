import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as TaskActions from '../actions/tasks.actions';
import { TaskService } from '../../home/services/task.service';


@Injectable()
export class TaskEffects {
  public actions$ = inject(Actions);
  constructor(
    private taskService: TaskService,
    ){
    }

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() => 
        this.taskService.getTasks().pipe(
          map(tasks => TaskActions.loadTasksSuccess({ tasks })),
          catchError(error => of(TaskActions.loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  loadTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTask),
      mergeMap(({ id }) => 
        this.taskService.getTask(id).pipe(
          map(task => TaskActions.loadTaskSuccess({ task })),
          catchError(error => of(TaskActions.loadTaskFailure({ error: error.message })))
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      mergeMap(({ task }) => 
        this.taskService.createTask(task).pipe(
          map(newTask => TaskActions.createTaskSuccess({ task: newTask })),
          catchError(error => of(TaskActions.createTaskFailure({ error: error.message })))
        )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap(({ task }) => 
        this.taskService.updateTask(task).pipe(
          map(updatedTask => TaskActions.updateTaskSuccess({ task: updatedTask })),
          catchError(error => of(TaskActions.updateTaskFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap(({ id }) => 
        this.taskService.deleteTask(id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id })),
          catchError(error => of(TaskActions.deleteTaskFailure({ error: error.message })))
        )
      )
    )
  );
}
