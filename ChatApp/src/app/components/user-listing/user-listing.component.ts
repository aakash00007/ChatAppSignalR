import { Component, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { RequestStatus } from 'src/app/Enums/RequestStatus';
import { environment } from 'src/app/Environments/environment';
import { FriendRequest } from 'src/app/Models/friendrequest';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'primeng/api';
import { contact } from '../requests/requests.component'
import { newMessage, removedContact } from '../chat/chat.component';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css'],
})
export class UserListingComponent implements OnInit {
  userList: any[] = [];
  loggedInUserId!: string;
  hubConnection!: HubConnection;
  token: any;
  connectedUsers: any[] = [];

  constructor(
    public bsModalRef: BsModalRef,
    private chatService: ChatService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.chatService.getIdFromStorage().subscribe((val) => {
      let idFromToken = this.authService.getIdFromToken();
      this.loggedInUserId = val || idFromToken;
    });

    this.chatService.getAllUsers().subscribe((res) => {
      this.userList = res.data.filter((x: any) => x.id != this.loggedInUserId);
    });

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.baseUrl}/chatHub?access-token=${this.token}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.startHubConnection();

    this.hubConnection.on('GetNewContact', (newContact)=>{
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

  sendRequest(friend: any) {
    friend.hasTakenAction = true;
    var friendRequest: FriendRequest = {
      id: null,
      senderId: this.loggedInUserId,
      receiverId: friend.id,
      requestStatus: RequestStatus.Pending,
    };
    this.hubConnection.invoke('SendRequest', friendRequest).then((res) => {
      this.chatService.getAllUsers().subscribe((res) => {
        this.userList = res.data.filter(
          (x: any) => x.id != this.loggedInUserId
        );
      });
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Request Sent Successfully!',
    });
  }
}
