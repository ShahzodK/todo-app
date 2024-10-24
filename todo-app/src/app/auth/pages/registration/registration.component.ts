import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { LoadingService } from '../../../shared/services/loading.service';
import { userRegistration, userReq } from '../../models/user.model';
import { LoginService } from '../../services/login.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { passwordMatchValidator } from '../../validators/passwordMatchValidator';
import { ToastrService } from 'ngx-toastr';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    RouterLink,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnDestroy {
  public unsub$: Subject<boolean> = new Subject<boolean>();

  public registrationForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    name: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', [Validators.required, passwordMatchValidator()])
  }, { validators: passwordMatchValidator() });

  constructor(
    private loginService: LoginService,
    private router: Router,
    public loadingService: LoadingService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  public register(): void {
    if (this.registrationForm.valid) {
      const profileValues: userRegistration = {
        email: this.registrationForm.value.email!,
        name: this.registrationForm.value.name!,
        password: this.registrationForm.value.password!,
        password_confirmation: this.registrationForm.value.confirmPassword!,
      };
      this.loadingService.startLoading();

      this.loginService.register(profileValues).pipe(
        takeUntil(this.unsub$),
      ).subscribe({
        next: (data) => {
          this.router.navigate(['/auth/login']);
          this.translate.get('Auth.registration.success').pipe(
            take(1)
          ).subscribe((text) => {
            this.toastr.success(text)
          })
          this.loadingService.stopLoading();
        },
        error: (error) => {
          this.translate.get('Errors.default').pipe(
            take(1)
          ).subscribe((text) => {
            this.toastr.error(error.message, text);
            this.loadingService.stopLoading();
          })
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
