import { createReducer, on } from '@ngrx/store';
import { Task } from '../../home/models/task.model';
import * as TaskActions from '../actions/tasks.actions';

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
}

export const initialState: TaskState = {
  tasks: [],
  currentTask: null
};

export const taskReducer = createReducer(
    initialState,
  
    on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
      ...state,
      tasks
    })),
  
    on(TaskActions.loadTaskSuccess, (state, { task }) => ({
      ...state,
      currentTask: task
    })),
  
    on(TaskActions.createTaskSuccess, (state, { task }) => ({
      ...state,
      tasks: [...state.tasks, task]
    })),
  
    on(TaskActions.updateTaskSuccess, (state, { task }) => ({
      ...state,
      tasks: state.tasks.map(t => t.id === task.id ? task : t),
      currentTask: task
    })),
  
    on(TaskActions.deleteTaskSuccess, (state, { id }) => ({
      ...state,
      tasks: state.tasks.filter(task => task.id !== +id),
      currentTask: null
    }))
  );