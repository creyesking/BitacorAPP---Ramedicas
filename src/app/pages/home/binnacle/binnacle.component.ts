import { takeUntil } from 'rxjs/operators';
import { BinnacleService } from './../services/binnacle.service';
import { ChangeDetectorRef } from '@angular/core';
import { JsonExporterService, TxtExporterService } from 'mat-table-exporter';
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
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas'

@Component({
  selector: 'app-binnacle',
  templateUrl: './binnacle.component.html',
  styleUrls: ['./binnacle.component.scss'],
})


export class BinnacleComponent implements AfterViewInit, OnInit, OnDestroy {
  userId = null;
  displayedColumns: string[] = [
    'id',
    'description',
    'time',
    'userId',
    'TaskDate',
    'createdAt',
    'updatedAt',
    'actions',
  ];

  dataSource = new MatTableDataSource<Task[]>();

  private destroy$ = new Subject<any>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private binnaclevc: BinnacleService,
    private dialog: MatDialog,
    public authSvc: AuthService,
    private toastr: ToastrService,

  ) {}





  downloadPdf(){
    var element = document.getElementById('table')

    html2canvas(element).then((canvas) =>{
      console.log(canvas);

    var imgData = canvas.toDataURL('image/png')

    var doc = new jsPDF()

    var imgHeight = canvas.height * 90 / canvas.width;

    doc.addImage(imgData,25,0,100,imgHeight)

    doc.save('bitacora.pdf')

    })
  }


  ngOnInit(): void {
    this.authSvc.user$.subscribe((user: UserResponse) => {
      this.userId = user?.userId;
    });
    this.binnaclevc.getById(this.userId).subscribe((binnacle: any) => {
      this.dataSource.data = binnacle;
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


  onDelete(id: number): void {
    if (window.confirm('Quieres eliminar este Registro?')) {
      this.binnaclevc
        .delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.toastr.success(`Eliminaste esta tarea`, 'BitacorAPP');
          // Update result after deleting the task.
          this.binnaclevc.getById(this.userId).subscribe((binnacle: any) => {
            this.dataSource = binnacle;
          });
        });
    }
  }

  onOpenModal(task = {}): void {
    console.log('Task->', task);
    const dialogRef = this.dialog.open(ModalTaskComponent, {
      height: '400px',
      width: '800px',
      hasBackdrop: true,
      data: { title: 'Nueva Tarea', task },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`, typeof result);
      // Update result after adding new task.
      this.binnaclevc.getById(this.userId).subscribe((binnacle: any) => {
        this.dataSource = binnacle;
        this.toastr.success(`Lista de tareas actualizada`, 'BitacorAPP');
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }

}
