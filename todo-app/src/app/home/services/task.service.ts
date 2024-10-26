import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTaskReq, Task, UpdateTaskReq } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient) { }
  TASKS_URL = 'tasks'

  public getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(environment.MAIN_URL + this.TASKS_URL)
  }

  public getTask(id: number): Observable<Task> {
    return this.http.get<Task>(environment.MAIN_URL + this.TASKS_URL + `/${id}`)
  }

  public createTask(data: CreateTaskReq): Observable<Task> {
    return this.http.post<Task>(environment.MAIN_URL + this.TASKS_URL, data)
  }

  public deleteTask(id: number): Observable<null> {
    return this.http.delete<null>(environment.MAIN_URL + this.TASKS_URL + `/${id}`)
  }

  public updateTask(data: UpdateTaskReq): Observable<Task> {
    return this.http.put<Task>(environment.MAIN_URL + this.TASKS_URL + `/${data.id}`, data);
  }
}
