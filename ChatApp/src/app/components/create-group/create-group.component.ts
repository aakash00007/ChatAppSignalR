import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { environment } from 'src/app/Environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { GroupService } from 'src/app/services/group.service';

export const createGroup = new Subject<any>();

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css'],
})
export class CreateGroupComponent implements OnInit {
  senderId!: string;
  createGroupForm!: FormGroup;
  constructor(
    private groupService: GroupService,
    private authService: AuthService,
    private chatService: ChatService,
    public bsModalRef: BsModalRef,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.chatService.getIdFromStorage().subscribe((val) => {
      let idFromToken = this.authService.getIdFromToken();
      this.senderId = val || idFromToken;
    });

    this.createGroupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      createdBy: [this.senderId],
    });
  }


  createNewGroup() 
  {
     if(this.createGroupForm.valid){
      createGroup.next(this.createGroupForm.value);
     }
    else{
      this.chatService.validateAllFormFields(this.createGroupForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Validations Failed',
      });
     }
  }
}
