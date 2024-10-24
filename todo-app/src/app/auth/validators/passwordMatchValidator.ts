import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    if(password?.value === confirmPassword?.value) {
        confirmPassword?.setErrors(null);
        return null
    } 
    else {
        confirmPassword?.setErrors({ passwordsMismatch: true });
        return { passwordsMismatch: true };
    }
  };
}
