import { UtilsService } from './../../services/utils.service';
import { AuthService } from '@auth/auth.service';
import { UserResponse } from './../../models/user.interface';
import { Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  isSus = null;
  isLogged = false;
  private destroy$ = new Subject<any>();

  constructor(private authSvc: AuthService, private utilsSvc: UtilsService) {}

  ngOnInit(): void {
    this.authSvc.user$
    .pipe(takeUntil(this.destroy$))
    .subscribe((user: UserResponse) => {
      this.isLogged = true;
      this.isSus = user?.role;
  });
}

  ngOnDestroy(): void {
    this.destroy$.next({});
    this.destroy$.complete();
  }



  onExit(): void {
    this.authSvc.logout();
    this.utilsSvc.openSidebar(false);
  }


}
