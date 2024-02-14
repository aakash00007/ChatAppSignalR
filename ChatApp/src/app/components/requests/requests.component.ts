import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { RequestStatus } from 'src/app/Enums/RequestStatus';
import { environment } from 'src/app/Environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { RequestService } from 'src/app/services/request.service';
import { newMessage, removedContact } from '../chat/chat.component';

export const contact = new Subject<any>();

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  requestList: any[] = [];
  loggedInUserId!: string;
  hubConnection!: HubConnection;
  token: any;

  constructor(
    public bsModalRef: BsModalRef,
    private chatService: ChatService,
    private authService: AuthService,
    private messageService: MessageService,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.chatService.getIdFromStorage().subscribe((val) => {
      let idFromToken = this.authService.getIdFromToken();
      this.loggedInUserId = val || idFromToken;
    });

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.baseUrl}/chatHub?access-token=${this.token}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.startHubConnection();
    this.requestService.getAllRequests().subscribe((res: any) => {
      this.requestList = res.requests.filter(
        (x: any) => x.receiverId == this.loggedInUserId
      );
    });

    this.hubConnection.on('GetNewContact', (newContact) => {
      contact.next(newContact);
    });

    this.hubConnection.on('GetRemovedContact', (contact)=>{
      removedContact.next(contact);
    });

    this.hubConnection.on('ReceiveMessage', (message) => {
      newMessage.next(message);
    });

  }

  public async startHubConnection() {
    try {
      await this.hubConnection.start();
      console.log('Connection established successfully!');
    } catch (error) {
      console.log(error);
    }
  }

  
  acceptRequest(request: any) {
    var requestObj: any = {
      id: request.id,
      senderId: request.senderId,
      receiverId: request.receiverId,
      requestStatus: RequestStatus.Accepted,
    };
    this.hubConnection.invoke('TakeActionOnRequest', requestObj).then((res) => {
      this.requestService.getAllRequests().subscribe((res: any) => {
        this.requestList = res.requests.filter(
          (x: any) => x.receiverId == this.loggedInUserId
        );
      });
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Request Accepted Successfully!',
    });
  }

  rejectRequest(request: any) {
    var requestObj: any = {
      id: request.id,
      senderId: request.senderId,
      receiverId: request.receiverId,
      requestStatus: RequestStatus.Rejected,
    };
    this.hubConnection.invoke('TakeActionOnRequest', requestObj).then((res) => {
      this.requestService.getAllRequests().subscribe((res: any) => {
        this.requestList = res.requests.filter(
          (x: any) => x.receiverId == this.loggedInUserId
        );
      });
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Request Rejected Successfully!',
    });
  }
}
