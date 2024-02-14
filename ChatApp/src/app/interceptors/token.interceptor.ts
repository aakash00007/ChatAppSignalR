import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api'


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService:AuthService,private router:Router,private messageService:MessageService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    var foundToken = this.authService.getToken();
    if(foundToken){
      request = request.clone({
        setHeaders: {Authorization:`Bearer ${foundToken}`}
      })
    }
    return next.handle(request);
  }
}
