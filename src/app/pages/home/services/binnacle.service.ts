import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Task } from '@app/shared/models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class BinnacleService {
  constructor(private http: HttpClient) {}

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
      .pipe(catchError(this.handlerError));
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
    let errorMessage = 'Error unknown';
    if (error) {
      errorMessage = `Error ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
