import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.css'],
})
export class GroupMembersComponent implements OnInit {
  groupMembers: any[] = [];
  groupObj:any;
  isGroupAdmin:boolean=false;
  loggedInUserId!:string;

  constructor(
    public bsModalRef: BsModalRef,
    private groupService: GroupService,
    private chatService: ChatService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void 
  {
    this.chatService.getIdFromStorage().subscribe((val) => {
      let idFromToken = this.authService.getIdFromToken();
      this.loggedInUserId = val || idFromToken;
    });

    this.groupService.getGroupMembers(this.groupObj.id).subscribe((res:any)=>{
      this.groupMembers = res.members;
      this.groupMembers.forEach((member)=>{
        if(member.id == this.groupObj.createdBy){
          member['isAdmin'] = true;
        };
      });
    });

    if(this.loggedInUserId == this.groupObj.createdBy){
      this.isGroupAdmin = true;
    }

  }

  removeUser(userId:string){
    this.groupService.removeUserFromGroup(this.groupObj.id,userId).subscribe((res)=>{
      this.groupService.getGroupMembers(this.groupObj.id).subscribe((res:any)=>{
        this.groupMembers = res.members;
        this.groupMembers.forEach((member)=>{
          if(member.id == this.groupObj.createdBy){
            member['isAdmin'] = true;
          };
        });
      });
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'User Removed Successfully',
    });
  }
}
