import { takeUntil } from 'rxjs/operators';

import { UsersService } from './../services/users.service';
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
import { ModalComponent } from './../components/modal/modal.component';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements AfterViewInit, OnInit, OnDestroy {

  userId = null;
  displayedColumns: string[] = ['id', 'role', 'area', 'username', 'actions'];
  dataSource = new MatTableDataSource();

  private destroy$ = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private userSvc: UsersService, private dialog: MatDialog, private toastr: ToastrService) {}

  ngOnInit(): void {

    this.userSvc.getAll().subscribe((users) => {
      console.log('mis datos ->', users);
      this.dataSource.data = users;
    });

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }



  onDelete(userId: number): void {
    if (window.confirm('Estás seguro que quieres borrar este usuario?')) {
      this.userSvc
        .delete(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          // Update result after deleting the user.
          this.toastr.success(
            `Eliminaste este usuario`,
            'BitacorAPP'
          );
          this.userSvc.getAll().subscribe((users) => {
            this.dataSource.data = users;
          });
        });
    }
  }

  onOpenModal(user = {}): void {
    console.log('User->', user);
    const dialogRef = this.dialog.open(ModalComponent, {
      height: '400px',
      width: '600px',
      hasBackdrop: false,
      data: { title: 'Nuevo Usuario', user },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`, typeof result);
      // Update result after adding new user.
      this.userSvc.getAll().subscribe((users) => {
        this.toastr.success(
          `Lista de usuarios actualizada`,
          'BitacorAPP'
        );
        this.dataSource.data = users;

      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }
}
