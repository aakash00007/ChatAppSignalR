import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../Environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private httpClient:HttpClient,private router:Router) { }

  getAllRequests(){
    return this.httpClient.get(`${environment.baseUrl}/api/Request/GetAllRequests`);
  }
}
