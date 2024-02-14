import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../Environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  constructor(private httpClient:HttpClient,private router:Router) { }

  createNewGroup(group:any){
    return this.httpClient.post(`${environment.baseUrl}/api/Group/CreateGroup`,group);
  }

  getAllGroups(){
    return this.httpClient.get(`${environment.baseUrl}/api/Group/GetAllGroups`);
  }

  hasUserJoinedGroup(userId:string,groupId:number){
    return this.httpClient.get(`${environment.baseUrl}/api/Group/HasUserJoinedGroup?userId=${userId}&groupId=${groupId}`);
  }

  joinNewGroup(userGroupObj:any){
    return this.httpClient.post(`${environment.baseUrl}/api/Group/JoinGroup`,userGroupObj);
  }

  getPreviousGroupMessages(groupId:number){
    return this.httpClient.get(`${environment.baseUrl}/api/Chat/GetGroupMessages?groupId=${groupId}`);
  }

  getGroupMembers(groupId:number){
    return this.httpClient.get(`${environment.baseUrl}/api/Group/GetAllGroupMembers?groupId=${groupId}`);
  }

  removeUserFromGroup(groupId:number,userId:string){
    return this.httpClient.delete(`${environment.baseUrl}/api/Group/RemoveUserFromGroup?groupId=${groupId}&userId=${userId}`);
  }
}
