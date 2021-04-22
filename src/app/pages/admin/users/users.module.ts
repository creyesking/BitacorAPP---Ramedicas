import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { MaterialModule } from '@app/material.module';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, UsersRoutingModule, MaterialModule,MatDialogModule],
})
export class UsersModule {}
