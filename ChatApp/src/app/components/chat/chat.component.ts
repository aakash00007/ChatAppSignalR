import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { environment } from 'src/app/Environments/environment';
import { Message } from 'src/app/Models/message';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { logout } from '../header/header.component';
import { createGroup } from '../create-group/create-group.component';
import { contact } from '../requests/requests.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CreateGroupComponent } from '../create-group/create-group.component';
import { GroupService } from 'src/app/services/group.service';
import { Subject, forkJoin } from 'rxjs';
import { GroupMembersComponent } from '../group-members/group-members.component';
import { UserListingComponent } from '../user-listing/user-listing.component';
import { RequestsComponent } from '../requests/requests.component';
import { RequestService } from 'src/app/services/request.service';
import { RequestType } from 'src/app/Enums/RequestType';
import { RequestStatus } from 'src/app/Enums/RequestStatus';

export const removedContact = new Subject<any>();
export const newMessage = new Subject<any>();


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  userList: any[] = [];
  contactList: any[] = [];
  currRecieverId!: string;
  senderId!: string;
  currRecieverName!: string;
  currReciever: any;
  currentMessage: string = '';
  hubConnection!: HubConnection;
  connectedUsers: any[] = [];
  previousChat: Message[] = [];
  token: any;
  currSenderName!: string;
  isEmojiPickerVisible: boolean = false;
  bsModalRef!: BsModalRef;
  groupList: any[] = [];
  showUserList: boolean = true;
  showGroupList: boolean = false;
  currGroup: any;
  previousGroupChat: Message[] = [];
  hasJoined: boolean = false;
  groupSelected: boolean = false;
  unreadMessages: Message[] = [];
  container!: HTMLElement | null;
  friend: any;
  reqCount!:number;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private requestService: RequestService,
    private router: Router,
    private messageService: MessageService,
    private bsModalService: BsModalService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    this.previousChat = [];
    this.token = localStorage.getItem('token');
    this.chatService.getIdFromStorage().subscribe((val) => {
      let idFromToken = this.authService.getIdFromToken();
      this.senderId = val || idFromToken;
    });

    this.chatService.getNameFromStorage().subscribe((val) => {
      let nameFromToken = this.authService.getNameFromToken();
      this.currSenderName = val || nameFromToken;
    });

    const hubOptions: signalR.IHttpConnectionOptions = {
      accessTokenFactory: () => this.token,
    };

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.baseUrl}/chatHub?access-token=${this.token}`)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const combinedResult = forkJoin([
      this.chatService.getAllUnreadMessages(),
      this.chatService.getUserContacts(this.senderId),
    ]);

    combinedResult.subscribe({
      next: (res: any) => {
        const newMessages = res[0].messages;
        const contacts = res[1];

        this.unreadMessages = newMessages;

        if (contacts.contacts) {
          this.contactList = contacts.contacts;
          this.contactList.forEach((contact: any) => {
            if (contact.userId == this.senderId) {
              contact.friend['count'] = this.unreadMessages.filter(
                (message) =>
                  message.senderId == contact.friendId &&
                  message.recieverId == this.senderId
              ).length;
              contact.friend['isActive'] = false;
            } else {
              contact.user['count'] = this.unreadMessages.filter(
                (message) =>
                  message.senderId == contact.userId &&
                  message.recieverId == this.senderId
              ).length;
              contact.user['isActive'] = false;
            }
          });
        }

        this.startHubConnection();
        if (
          this.hubConnection.state === signalR.HubConnectionState.Connecting
        ) {
          this.hubConnection.on('GetUsersOnConnect', (res) => {
            this.connectedUsers = res;
            this.makeUserOnline();
          });

          this.hubConnection.on('GetUsersOnDisconnect', (res) => {
            this.connectedUsers = res;
            this.contactList.forEach((contact) => {
              if (contact.userId == this.senderId) {
                contact.friend.isOnline = false;
              } else {
                contact.user.isOnline = false;
              }
            });
            this.makeUserOnline();
          });
        } else {
          console.log('Connection is not in Connected State!');
        }
      },
    });

    this.groupService.getAllGroups().subscribe((res: any) => {
      this.groupList = res;
      this.groupList.forEach((item: any) => {
        item['isActive'] = false;
      });
    });

    this.requestService.getAllRequests().subscribe((res: any) => {
      this.reqCount = res.requests.filter(
        (x: any) => x.receiverId == this.senderId && x.requestStatus == RequestStatus.Pending
      ).length;
    });

    this.hubConnection.on('ReceiveMessage', (message) => {
      newMessage.next(message);
    });

    this.hubConnection.on('GetNewContact', (newContact)=>{
      this.contactList.push(newContact);
    });

    this.hubConnection.on('GetRemovedContact', (contact)=>{
      removedContact.next(contact);
    });

    this.hubConnection.on('GetNewGroup', (newGroup) => {
      newGroup.isActive = false;
      this.groupList.push(newGroup);
    });

    createGroup.subscribe((val) => {
      this.createNewGroup(val);
    });

    removedContact.subscribe((newContact)=>{
      this.contactList = this.contactList.filter((x) =>
      x.id != newContact.id
    );
    this.currReciever = null;
    });

    
    contact.subscribe((contact)=>{
      if(this.contactList){
        contact.friend.isActive = false;
        contact.user.isActive = false;
        contact.friend.isOnline = true;
        contact.user.isOnline = true;
        this.contactList.push(contact);
      }
    });

    newMessage.subscribe((message)=>{
      message.type = 'received';
      this.previousChat.push(message);
      this.previousChat.forEach((message) => {
        message.timeStamp = new Date(
          moment(message.timeStamp).format('YYYY-MM-DD hh:mm A')
        );
      });
      this.contactList.forEach((contact) => {
        if (contact.userId == this.senderId) {
          if (
            !contact.friend['isActive'] &&
            message.senderId == contact.friendId &&
            message.recieverId == this.senderId
          ) {
            contact.friend['count'] = contact.friend.count + 1;
          }
        } else {
          if (
            !contact.user['isActive'] &&
            message.senderId == contact.userId &&
            message.recieverId == this.senderId
          ) {
            contact.user['count'] = contact.user.count + 1;
          }
        }
      });
    });


    logout.subscribe((x: any) => {
      this.onLogout();
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

  makeUserOnline() {
    if (this.connectedUsers && this.contactList) {
      this.connectedUsers.forEach((user) => {
        var foundContact = this.contactList.find((x) =>
          x.userId == this.senderId
            ? x.friendId == user.userId
            : x.userId == user.userId
        );
        if (foundContact) {
          foundContact.userId == this.senderId
            ? (foundContact.friend.isOnline = true)
            : (foundContact.user.isOnline = true);
        }
      });
    }
  }

  getRelativeUrl(absolutePath : string){
    if(absolutePath == null || undefined || ''){
      return 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=';
    }
    const relativepath = absolutePath.replace('D:\\ChatApp\\ChatAppSolution\\ChatAppApi\\wwwroot\\Resources/Images\\','/Resources/Images/');
    const imageUrl = `${environment.baseUrl}${relativepath}`;
    return imageUrl;
  }

  openModal() {
    this.bsModalRef = this.bsModalService.show(CreateGroupComponent, {
      backdrop: 'static',
    });
  }

  showGroupMembers(group: any) {
    const initialState = {
      groupObj: group,
    };
    this.bsModalRef = this.bsModalService.show(GroupMembersComponent, {
      initialState,
      class: 'modal-lg',
      backdrop: 'static',
    });
  }

  openAllUsers() {
    this.bsModalRef = this.bsModalService.show(UserListingComponent);
  }

  openAllRequests() {
    this.bsModalRef = this.bsModalService.show(RequestsComponent);
  }

  chatWithUser(contact: any) {
    if (contact.userId == this.senderId) {
      this.previousChat = [];
      this.currRecieverId = contact.friendId;
      this.currRecieverName = contact.friend.userName;
      this.contactList.forEach((contact) => {
        contact.friend['isActive'] = false;
        contact.user['isActive'] = false;
      });
      contact.friend['isActive'] = true;
      contact.friend['count'] = 0;
      this.currReciever = contact.friend;
      this.hubConnection
        .invoke('MarkMessagesAsRead', this.currReciever.id, this.senderId)
        .then(() => {
          console.log('Messages marked as read.');
        });
      this.chatService
        .getPreviousMessages(this.senderId, this.currReciever.id)
        .subscribe({
          next: (res) => {
            if (res.data.messages) {
              this.previousChat = res.data.messages;
              this.previousChat.forEach((message) => {
                message.type =
                  message.recieverId === this.senderId ? 'received' : 'sent';
                message.timeStamp = new Date(
                  moment(message.timeStamp)
                    .add(330, 'm')
                    .format('YYYY-MM-DD hh:mm A')
                );
              });
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.previousChat = [];
      this.currRecieverId = contact.userId;
      this.currRecieverName = contact.user.userName;
      this.contactList.forEach((contact) => {
        contact.user['isActive'] = false;
        contact.friend['isActive'] = false;
      });
      contact.user['isActive'] = true;
      contact.user['count'] = 0;
      this.currReciever = contact.user;
      this.hubConnection
        .invoke('MarkMessagesAsRead', this.currReciever.id, this.senderId)
        .then(() => {
          console.log('Messages marked as read.');
        });
      this.chatService
        .getPreviousMessages(this.senderId, this.currReciever.id)
        .subscribe({
          next: (res) => {
            if (res.data.messages) {
              this.previousChat = res.data.messages;
              this.previousChat.forEach((message) => {
                message.type =
                  message.recieverId === this.senderId ? 'received' : 'sent';
                message.timeStamp = new Date(
                  moment(message.timeStamp)
                    .add(330, 'm')
                    .format('YYYY-MM-DD hh:mm A')
                );
              });
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  chatInGroup(group: any) {
    this.groupSelected = true;
    debugger;
    this.currGroup = group;
    this.groupList.forEach((group) => {
      group['isActive'] = false;
    });
    group['isActive'] = true;
    this.hubConnection.invoke('JoinGroup', this.currGroup.id, this.senderId);
    this.groupService
      .hasUserJoinedGroup(this.senderId, group.id)
      .subscribe((res: any) => {
        if (res.hasJoined) {
          this.hasJoined = true;
        } else {
          this.hasJoined = false;
        }
      });
    this.groupService.getPreviousGroupMessages(this.currGroup.id).subscribe({
      next: (res: any) => {
        this.previousGroupChat = res.groupMessages;
        this.previousGroupChat.forEach((x) => {
          x.type = x.senderId === this.senderId ? 'sent' : 'received';
        });
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.hubConnection.on('ReceiveGroupMessage', (message) => {
      message.type = 'received';
      this.previousGroupChat.push(message);
      this.previousGroupChat.forEach((message) => {
        message.timeStamp = new Date(
          moment(message.timeStamp).format('YYYY-MM-DD hh:mm A')
        );
      });
    });
  }

  createNewGroup(formValue: any) {
    this.hubConnection.invoke('CreateNewGroup', formValue).then(() => {
      this.bsModalRef.hide();
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Group Created Successfully',
      });
    });
  }

  leaveGroup(groupId: number, userId: string) {
    this.groupService.removeUserFromGroup(groupId, userId).subscribe(() => {
      this.hasJoined = false;
    });
  }

  removeContact(contact: any) {
    // this.contactList = this.contactList.filter((x) =>
    //   x.id != contact.id
    // );
    // this.currReciever = null;
    // this.chatService.removeContact(contact).subscribe(() => {
    //   this.chatService.getUserContacts(this.senderId).subscribe((res: any) => {
    //     this.contactList = res.contacts;
    //   });
    // });
    this.hubConnection.invoke("RemoveFromContacts",contact).then(()=>{
      console.log("User Removed");
    });
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Contact Removed Successfully',
    });
  }

  sendMessage() {
    if (this.currentMessage != '' && this.currentMessage.trim() != '') {
      if (this.showGroupList && this.groupSelected) {
        var message: Message = {
          id: null,
          senderId: this.senderId,
          recieverId: null,
          timeStamp: new Date(),
          type: 'sent',
          messageContent: this.currentMessage,
          isRead: false,
          groupId: this.currGroup.id,
        };
        this.previousGroupChat.push(message);
      } else {
        var message: Message = {
          id: null,
          senderId: this.senderId,
          recieverId: this.currReciever.id,
          timeStamp: new Date(),
          type: 'sent',
          messageContent: this.currentMessage,
          isRead: false,
          groupId: null,
        };
        this.previousChat.push(message);
      }
      this.hubConnection
        .invoke('SendMessage', message)
        .then(() => console.log('Message to user Sent Successfully'))
        .catch((err) => console.error(err));
      this.currentMessage = '';
    }
  }

  public addEmoji(event: any) {
    this.currentMessage = `${this.currentMessage}${event.emoji.native}`;
  }

  joinGroup() {
    var userGroupObj = {
      userId: this.senderId,
      groupId: this.currGroup.id,
    };
    this.groupService.joinNewGroup(userGroupObj).subscribe((res) => {
      this.hasJoined = true;
    });
  }

  showUsers() {
    this.showUserList = true;
    this.showGroupList = false;
    this.groupSelected = false;
  }

  showGroups() {
    this.showUserList = false;
    this.showGroupList = true;
  }

  onLogout() {
    this.hubConnection
      .invoke('DisconnectUser', this.senderId)
      .then(() => {
        console.log('user disconnected');
      })
      .catch((err) => console.error(err));
    this.hubConnection.on('GetUsersOnDisconnect', (res) => {
      this.connectedUsers = res;
      console.log(this.connectedUsers);
      this.contactList.forEach((contact) => {
        contact.isOnline = false;
      });
      this.makeUserOnline();
    });
    localStorage.removeItem('token');
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Logged Out Successfully',
    });
    this.router.navigate(['login']);
  }
}
