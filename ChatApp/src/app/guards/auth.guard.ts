import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService)
  if(authService.isLoggedIn()){
    return true;
  }
  else{
    messageService.add({severity: 'warn', summary:  'Access Denied', detail: 'You are not authorised to access this page.' });
    router.navigate(['login']);
    return false;
  }
};
