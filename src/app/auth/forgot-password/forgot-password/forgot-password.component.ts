import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../core/core.index';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss',
    imports: [RouterLink,FormsModule]
})
export class ForgotPasswordComponent {
  public routes = routes;
  constructor(private router: Router) {}

  navigation() {
    this.router.navigate([routes.emailVerification])
  }
}
