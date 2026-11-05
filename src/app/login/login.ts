import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
})
export class Login {
  user: User = { username: '', password: '', roles: [] };
  error = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLoggedin(): void {
    this.error = !this.authService.signIn(this.user);
    if (this.error) {
      this.user.password = '';
      return;
    }

    void this.router.navigateByUrl('/voitures');
  }
}
