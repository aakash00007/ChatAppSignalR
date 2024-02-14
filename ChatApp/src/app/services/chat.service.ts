import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../Environments/environment';
import { ApiResponse } from '../Models/apiresponse';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private name$ = new BehaviorSubject<string>("");
  private role$ = new BehaviorSubject<string>("");
  private id$ = new BehaviorSubject<string>("");
  constructor(private httpClient:HttpClient,private router:Router) { }

  public getRoleFromStorage(){
    return this.role$.asObservable();
  }

  public getIdFromStorage(){
    return this.id$.asObservable();
  }

  public setIdToStorage(id:string){
    this.id$.next(id);
  }

  public setRoleToStorage(role:string){
    this.role$.next(role);
  }

  public getNameFromStorage(){
    return this.name$.asObservable();
  }

  public setNameToStorage(name:string){
    this.name$.next(name);
  }

  

  public getAllUsers(){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/User/GetAllUsers`);
  }

  public getUserById(userId:string){
    return this.httpClient.get(`${environment.baseUrl}/api/User/GetUserById?userId=${userId}`);
  }
  public getUserContacts(userId : string){
    return this.httpClient.get(`${environment.baseUrl}/api/Contact/GetUserContacts?userId=${userId}`);
  }

  public getPreviousMessages(userId1:string,userId2:string){
    return this.httpClient.get<ApiResponse>(`${environment.baseUrl}/api/Chat/GetPreviousChat?userId1=${userId1}&userId2=${userId2}`);
  }

  public getAllUnreadMessages(){
    return this.httpClient.get(`${environment.baseUrl}/api/Chat/GetAllUnreadMessages`);
  }

  public removeContact(contact : any){
    return this.httpClient.post(`${environment.baseUrl}/api/Contact/RemoveFromContacts`,contact);
  }

  public validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field =>{
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({onlySelf:true})
      }
      else if(control instanceof FormGroup){
        this.validateAllFormFields(control);
      }
    })
  }
}
