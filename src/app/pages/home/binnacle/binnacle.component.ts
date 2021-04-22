import { takeUntil } from 'rxjs/operators';
import { BinnacleService } from './../services/binnacle.service';
import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { ModalTaskComponent } from './../components/modal-task/modal-task.component';

import { Subject } from 'rxjs';
import { UserResponse } from '@app/shared/models/user.interface';
import { Task } from '@app/shared/models/task.interface';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-binnacle',
  templateUrl: './binnacle.component.html',
  styleUrls: ['./binnacle.component.scss'],
})
export class BinnacleComponent implements AfterViewInit, OnInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'description',
    'time',
    'userId',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  userId:number = null;
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private binnaclevc: BinnacleService,
    private dialog: MatDialog,
    private authSvc: AuthService,
    ) {}

  ngOnInit(): void {

    this.authSvc.user$.subscribe((user: UserResponse) => {
      this.userId = user?.userId;
    });
    this.binnaclevc.getById(this.userId).subscribe((binnacle:any) => {
      this.dataSource.data = binnacle;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  onDelete(id: number): void {
    if (window.confirm('Do you really want remove this task')) {
      this.binnaclevc
        .delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          window.alert(res);
          // Update result after deleting the task.
          this.binnaclevc.getAll().subscribe((binnacle) => {
            this.dataSource.data = binnacle;
          });
        });
    }
  }

  onOpenModal(task = {}): void {
    console.log('Task->', task);
    const dialogRef = this.dialog.open(ModalTaskComponent, {
      height: '400px',
      width: '600px',
      hasBackdrop: false,
      data: { title: 'Nueva Tarea', task },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`, typeof result);
      // Update result after adding new task.
      this.binnaclevc.getAll().subscribe((binnacle) => {
        this.dataSource.data = binnacle;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
