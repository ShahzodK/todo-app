import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from '../reducers/tasks.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state: TaskState) => state.tasks
);

export const selectCurrentTask = createSelector(
  selectTaskState,
  (state: TaskState) => state.currentTask
);
