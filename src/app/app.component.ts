import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

interface IPasswordForm {
  password: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  passwordForm = new FormGroup({
    password: new FormControl(''),
  });

  passwordStrength$;
  progressClass$;

  constructor() {
    this.passwordStrength$ = this.passwordForm.valueChanges.pipe(
      switchMap((passwordForm: IPasswordForm) => {
        return this.calculatePasswordStrength(passwordForm);
      })
      // tap((passwordStrength) => {
      //   console.log(passwordStrength);
      // })
    );
    this.progressClass$ = this.passwordStrength$.pipe(
      switchMap((passwordStrength: number) => {
        return this.determineProgressBarClassName(passwordStrength);
      })
      // tap((progressBarClassName) => {
      //   console.log(progressBarClassName);
      // })
    );
  }

  calculatePasswordStrength = (
    passwordForm: IPasswordForm
  ): Observable<number> => {
    let passwordStrength = 0;
    //calculate strength
    if (passwordForm.password.length > 3) {
      passwordStrength = passwordStrength + 25;
    }
    if (passwordForm.password.length > 6) {
      passwordStrength = passwordStrength + 25;
    }
    if (
      passwordForm.password.includes('#') ||
      passwordForm.password.includes('$')
    ) {
      passwordStrength = passwordStrength + 25;
    }
    if (/\d/.test(passwordForm.password)) {
      passwordStrength = passwordStrength + 25;
    }
    return of(passwordStrength);
  };

  determineProgressBarClassName = (
    passwordStrength: number
  ): Observable<string> => {
    if (passwordStrength >= 0 && passwordStrength <= 25) {
      return of('sub25');
    }
    if (passwordStrength > 25 && passwordStrength <= 50) {
      return of('sub50');
    }
    if (passwordStrength > 50 && passwordStrength <= 75) {
      return of('sub75');
    }
    if (passwordStrength > 75 && passwordStrength <= 100) {
      return of('sub100');
    }
  };
}
