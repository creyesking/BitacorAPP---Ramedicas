import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { BinnacleService } from '@app/pages/home/services/binnacle.service';
import { UserResponse } from '../models/user.interface';

@Injectable({ providedIn: 'root' })
export class BaseFormTask {
  errorMessage = null;
  dato = localStorage.getItem('userId');
  constructor(private fb: FormBuilder, private authSvc: AuthService) {}

  baseForm = this.fb.group({
    description: ['', [Validators.required]],
    // userId: ['', [Validators.required]],
    time: ['', [Validators.required]],
    TaskDate: [''],

  });

  isValidField(field: string): boolean {
    this.getErrorMessage(field);
    return (
      (this.baseForm.get(field).touched || this.baseForm.get(field).dirty) &&
      !this.baseForm.get(field).valid
    );
  }

  private getErrorMessage(field: string): void {
    const { errors } = this.baseForm.get(field);

    if (errors) {
      const messages = {
        required: 'You must enter a value.',
      };

      const errorKey = Object.keys(errors).find(Boolean);
      this.errorMessage = messages[errorKey];
    }
  }

}
