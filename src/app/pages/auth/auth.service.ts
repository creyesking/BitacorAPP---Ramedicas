import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { UserResponse, User, Roles } from '@shared/models/user.interface';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = new BehaviorSubject<UserResponse>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.checkToken();
  }
  get user$(): Observable<UserResponse> {
    return this.user.asObservable();
  }

  get userValue(): UserResponse {
    return this.user.getValue();
  }

  login(authData: User): Observable<UserResponse | void> {
    return this.http
      .post<UserResponse>(`${environment.API_URL}/auth/login`, authData)
      .pipe(
        map((user: UserResponse) => {
          this.saveLocalStorage(user);
          this.toastr.success(
            `${authData.username} Iniciaste sesion`,
            'BitacorAPP'
          );
          this.user.next(user);
          return user;
        }),
        catchError((err) => this.handlerError(err)
      ));
  }

  logout(): void {
    localStorage.removeItem('user');
    this.user.next(null);
    this.router.navigate(['/login']);
    this.toastr.success(
      `Cerraste sesion`,
      'BitacorAPP'
    );
  }

  private checkToken(): void {
    const user = JSON.parse(localStorage.getItem('user')) || null;

    if (user) {
      const isExpired = helper.isTokenExpired(user.token);

      if (isExpired) {
        this.logout();
      } else {
        this.user.next(user);
      }
    }
  }

  private saveLocalStorage(user: UserResponse): void {
    const { message, ...rest } = user;
    localStorage.setItem('user', JSON.stringify(rest));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }

  getToken(): string {
    return JSON.parse(localStorage.getItem('user')).token;
  }


  showSuccess() {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }

  getRole(): boolean {
    const role = JSON.parse(localStorage.getItem('user')).role;
    if (role === 'admin') {
      return true;
    } else {
      return false;
    }
  }

  private handlerError(error: any): Observable<never> {
    let errorMessage = 'An errror occured retrienving data';
    if (error) {
      errorMessage = `Error: code ${error.message}`;
    }
    const err = this.toastr.error(
      `usuario o contraseña incorrecta`,
      'BitacorAPP'
    );
    console.log(errorMessage);
    return throwError(err);
  }
}
