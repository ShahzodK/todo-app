import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { userReq } from '../../models/user.model';
import { LoadingService } from '../../../shared/services/loading.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnDestroy {
  public unsub$: Subject<boolean> = new Subject<boolean>();

  public loginForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required])
  });

  constructor(
    private loginService: LoginService,
    private router: Router,
    public loadingService: LoadingService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  public login(): void {
    if (this.loginForm.valid) {
      const profileValues: userReq = {
        email: this.loginForm.get('email')?.value!,
        password: this.loginForm.get('password')?.value!
      };
      
      this.loadingService.startLoading();

      this.loginService.login(profileValues).pipe(
        takeUntil(this.unsub$),
      ).subscribe({
        next: (data) => {
          this.loadingService.stopLoading();
          localStorage.setItem('token', data.access_token);
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.loadingService.stopLoading();
          if(error.status === 401) {
            this.translate.get('Errors.401').pipe(
              take(1)
            ).subscribe((text) => {
              this.toastr.error(text)
            })
          }
          else {
            this.translate.get('Errors.default').pipe(
              take(1)
            ).subscribe((text) => {
              this.toastr.error(error.message, text)
            })
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
