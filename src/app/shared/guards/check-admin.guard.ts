import { AuthService } from './../../pages/auth/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CheckAdminGuard implements CanActivate {

constructor(private authSvc: AuthService){
}

  canActivate(): boolean {
    const role = this.authSvc.getRole();
    return role;
  }

}
