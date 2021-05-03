import { UsersService } from './../../services/users.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BaseFormUser } from '@shared/utils/base-form-user';
import { ToastrService } from 'ngx-toastr';
enum Action {
  EDIT = 'edit',
  NEW = 'new',
}
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  actionTODO = Action.NEW;
  showPasswordField = true;
  hide = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userForm: BaseFormUser,
    private userSvc: UsersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.data?.user.hasOwnProperty('id')) {
      this.actionTODO = Action.EDIT;
      this.showPasswordField = true;
      this.userForm.baseForm.get('password').setValidators(null);
      this.userForm.baseForm.updateValueAndValidity();
      this.data.title = 'Editar usuario';
      this.pathFormData();
    }
  }

  showSuccess(): void {
    this.toastr.success(
      `Creaste este usuario`,
      'BitacorAPP'
    );
  }

  onSave(): void {
    const formValue = this.userForm.baseForm.value;
    const userId = this.data?.user?.id;
    if (this.actionTODO === Action.NEW) {
      this.userSvc.new(formValue).subscribe((res) => {
        this.toastr.success(
          `Creaste este usuario`,
          'BitacorAPP'
        );
        console.log('New ', res);
      });
    } else {
      this.userSvc.update(userId, formValue).subscribe((res) => {
        this.toastr.success(
          `Actualizaste este usuario`,
          'BitacorAPP'
        );
        console.log('Update', res);
      });
    }
  }

  checkField(field: string): boolean {
    return this.userForm.isValidField(field);
  }

  private pathFormData(): void {
    this.userForm.baseForm.patchValue({
      username: this.data?.user?.username,
      password: this.data?.user?.password,
      role: this.data?.user?.role,
      area: this.data?.user?.area,
    });
  }
}
