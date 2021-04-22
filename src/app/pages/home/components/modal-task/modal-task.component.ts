import { BinnacleService } from './../../services/binnacle.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BaseFormTask } from '@shared/utils/base-form-task';
enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

@Component({
  selector: 'app-modal-task',
  templateUrl: './modal-task.component.html',
  styleUrls: ['./modal-task.component.scss']
})
export class ModalTaskComponent implements OnInit {
  actionTODO = Action.NEW;

  hide = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data2: any,
    public taskForm: BaseFormTask,
    private taskSvc: BinnacleService
  ) {}

  ngOnInit(): void {
    if (this.data2?.task.hasOwnProperty('id')) {
      this.actionTODO = Action.EDIT;
      this.taskForm.baseForm.get('description').setValidators(null);
      this.taskForm.baseForm.get('time').setValidators(null);
      this.taskForm.baseForm.updateValueAndValidity();
      this.data2.title = 'Editar tarea';
      this.pathFormData();
    }
  }

  onSave(): void {
    const formValue = this.taskForm.baseForm.value;
    if (this.actionTODO === Action.NEW) {
      this.taskSvc.new(formValue).subscribe((res) => {
        console.log('New ', res);
      });
    } else {
      const id = this.data2?.task?.id;
      this.taskSvc.update(id, formValue).subscribe((res) => {
        console.log('Update', res);
      });
    }
  }

  checkField(field: string): boolean {
    return this.taskForm.isValidField(field);
  }

  private pathFormData(): void {
    this.taskForm.baseForm.patchValue({
      description: this.data2?.task?.description,
      userId: this.data2?.task?.userId,
      time: this.data2?.time?.task?.time,

      });
  }


    // private formatLabel(time: number) {
    //   if (time >= 1000) {
    //     return Math.round(time / 1000) + 'mins';
    //   }

    //   return time;
    // }

}
