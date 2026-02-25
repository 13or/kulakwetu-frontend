import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { routes } from '../../../core/core.index';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-forgot-password-2',
    templateUrl: './forgot-password-2.component.html',
    styleUrl: './forgot-password-2.component.scss',
    imports: [RouterLink,FormsModule]
})
export class ForgotPassword2Component {
  public routes = routes;
  constructor(private router: Router) {}

  navigation() {
    this.router.navigate([routes.emailVerification2])
  }
}
