import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, userRegistration, userRegistrationRes, userReq, userRes } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  public login(data: userReq): Observable<userRes> {
    return this.http.post<userRes>(environment.MAIN_URL + 'login', data);
  }

  public register(data: userRegistration): Observable<userRegistrationRes> {
    return this.http.post<userRegistrationRes>(environment.MAIN_URL + 'register', data);
  }

  public getToken(): string {
    return localStorage.getItem('token') || '';
  }

}