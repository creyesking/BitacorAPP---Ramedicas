import { AuthService } from './../../auth/auth.service';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { Task } from '@app/shared/models/task.interface';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root',
})
export class BinnacleService {
  constructor(private http: HttpClient,  private toastr: ToastrService) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;

  getAll(): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${environment.API_URL}/tasks`)
      .pipe(catchError(this.handlerError));
      }

  getById(id: number): Observable<Task> {
    return this.http
      .get<any>(`${environment.API_URL}/tasks/${id}`)
      .pipe(catchError(this.handlerError));
  }

  new(task: Task): Observable<Task> {
    return this.http
      .post<Task>(`${environment.API_URL}/tasks`, task)
      .pipe(
        catchError(this.handlerError));
  }

  update(id: number, task: Task): Observable<Task> {
    return this.http
      .patch<Task>(`${environment.API_URL}/tasks/${id}`, task)
      .pipe(catchError(this.handlerError));
  }

  delete(id: number): Observable<{}> {
    return this.http
      .delete<Task>(`${environment.API_URL}/tasks/${id}`)
      .pipe(catchError(this.handlerError));
  }

  handlerError(error): Observable<never> {
    let errorMessage = 'An errror occured retrienving data';
    if (error) {
      errorMessage = `Error: code ${error.message}`;
    }
    const err = this.toastr.error(
      `Ah ocurrido un error!!`,
      'BitacorAPP'
    );
    console.log(errorMessage);
    return throwError(err);
  }
}
