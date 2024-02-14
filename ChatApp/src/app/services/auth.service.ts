import { Injectable } from '@angular/core';
import { environment } from '../Environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RegisterModel } from '../Models/registermodel';
import { ApiResponse } from '../Models/apiresponse';
import { LoginModel } from '../Models/loginmodel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private payload:any;

  constructor(private httpClient: HttpClient, private router: Router) { 
    this.payload = this.getPayLoadFromToken();
  }

  signUp(registerObj: FormData) {
    return this.httpClient.post<ApiResponse>(`${environment.baseUrl}/api/Auth/Register`, registerObj);
  }

  login(loginObj: LoginModel) {
    debugger
    return this.httpClient.post<ApiResponse>(`${environment.baseUrl}/api/Auth/Login`, loginObj);
  }

  logout() {
    localStorage.clear()
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getPayLoadFromToken() {
    const jwtHelper = new JwtHelperService();
    const storedToken = this.getToken()!;
    return jwtHelper.decodeToken(storedToken);
  }

  getNameFromToken() {
    if (this.payload) {
      return this.payload.name;
    }
  }

  getIdFromToken(){
    if(this.payload){
      return this.payload.id;
    }
  }

  getRoleFromToken() {
    if (this.payload) {
      return this.payload.role;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
