import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BinnacleRoutingModule } from './binnacle-routing.module';
import { BinnacleComponent } from './binnacle.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ModalTaskComponent } from '../components/modal-task/modal-task.component';
@NgModule({
  declarations: [
    BinnacleComponent, ModalTaskComponent
  ],
  imports: [
    CommonModule,
    BinnacleRoutingModule,
    MaterialModule,
    MatDialogModule,
    ReactiveFormsModule, FormsModule

  ]
})
export class BinnacleModule { }
