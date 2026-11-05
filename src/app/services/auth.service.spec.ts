import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AuthService, provideRouter([])],
    });
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('authenticates Ahmed as a regular user', () => {
    expect(authService.signIn({ username: 'Ahmed', password: '123' })).toBe(true);
    expect(authService.loggedUser).toBe('Ahmed');
    expect(authService.isloggedIn).toBe(true);
    expect(authService.isAdmin()).toBe(false);
    expect(localStorage.getItem('loggedUser')).toBe('Ahmed');
  });

  it('authenticates admin with administrator permissions', () => {
    expect(authService.signIn({ username: 'admin', password: '123' })).toBe(true);
    expect(authService.isAdmin()).toBe(true);
  });

  it('rejects invalid credentials', () => {
    expect(authService.signIn({ username: 'Nadhem', password: '123' })).toBe(false);
    expect(authService.isloggedIn).toBe(false);
  });
});
