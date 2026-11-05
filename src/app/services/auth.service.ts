import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly users: User[] = [
    { username: 'admin', password: '123', roles: ['ADMIN'] },
    { username: 'Ahmed', password: '123', roles: ['USER'] },
  ];

  loggedUser: string | null = null;
  isloggedIn = false;
  roles: string[] = [];

  constructor(private router: Router) {
    const storedUsername = localStorage.getItem('loggedUser');
    if (localStorage.getItem('isloggedIn') === 'true' && storedUsername) {
      this.setLoggedUserFromLocalStorage(storedUsername);
    }
  }

  signIn(credentials: Pick<User, 'username' | 'password'>): boolean {
    const username = credentials.username.trim().toLocaleLowerCase();
    const user = this.users.find(
      candidate =>
        candidate.username.toLocaleLowerCase() === username &&
        candidate.password === credentials.password,
    );

    if (!user) {
      return false;
    }

    this.loggedUser = user.username;
    this.isloggedIn = true;
    this.roles = [...user.roles];
    localStorage.setItem('loggedUser', user.username);
    localStorage.setItem('isloggedIn', 'true');
    return true;
  }

  logout(): void {
    this.loggedUser = null;
    this.isloggedIn = false;
    this.roles = [];
    localStorage.removeItem('loggedUser');
    localStorage.removeItem('isloggedIn');
    void this.router.navigateByUrl('/login');
  }

  isAdmin(): boolean {
    return this.roles.includes('ADMIN');
  }

  setLoggedUserFromLocalStorage(username: string): void {
    const user = this.users.find(
      candidate => candidate.username.toLocaleLowerCase() === username.toLocaleLowerCase(),
    );

    if (!user) {
      this.loggedUser = null;
      this.isloggedIn = false;
      this.roles = [];
      localStorage.removeItem('loggedUser');
      localStorage.removeItem('isloggedIn');
      return;
    }

    this.loggedUser = user.username;
    this.isloggedIn = true;
    this.roles = [...user.roles];
  }
}
