import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { FormsErrorDisplay } from '@shared/components/forms-error-display/forms-error-display';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha-2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-auth-login-page',
  imports: [RouterLink, ReactiveFormsModule, FormsErrorDisplay, NgClass, RecaptchaV3Module],
  templateUrl: './auth-login-page.html',
  styleUrl: './auth-login-page.scss',
})
export class AuthLoginPage {
  private readonly _fb = inject(FormBuilder);
  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _recaptchaService = inject(ReCaptchaV3Service);

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  formLogin = this._fb.group({
    username: this.username,
    password: this.password,
  });

  async onSubmit() {
    this.formLogin.markAllAsTouched();

    if (this.formLogin.valid) {
      // Vérification du reCAPTCHA
      const token = await firstValueFrom(this._recaptchaService.execute('login'));

      console.log('google recaptcha token', token);
      console.log(this.formLogin.value);
      this._authService
        .login(this.formLogin.value.username!, this.formLogin.value.password!, token)
        .then(() => {
          this._router.navigate(['/']);
        })
        .catch((err: Error) => {
          console.log('auth login', err);
        });
    }
  }
}
