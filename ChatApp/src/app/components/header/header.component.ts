import { Component, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatComponent } from '../chat/chat.component';
import { Subject } from 'rxjs';
import { HubConnection } from '@microsoft/signalr';
import { environment } from 'src/app/Environments/environment';
export const logout = new Subject<any>();
 

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  public name: string = '';
  loggedInUser:any;
  loggedInUserId!: string;
  @ViewChild(ChatComponent) chat!: ChatComponent;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.chatService.getNameFromStorage().subscribe((val) => {
      let nameFromToken = this.authService.getNameFromToken();
      this.name = val || nameFromToken;
    });
    this.chatService.getIdFromStorage().subscribe((val) => {
      let idFromToken = this.authService.getIdFromToken();
      this.loggedInUserId = val || idFromToken;
    });

    this.chatService.getUserById(this.loggedInUserId).subscribe((val:any)=>{
      this.loggedInUser = val.user;
    })
  }

  getRelativeUrl(absolutePath : string){
    if(absolutePath == null || undefined || ''){
      return 'https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0=';
    }
    const relativepath = absolutePath.replace('D:\\ChatApp\\ChatAppSolution\\ChatAppApi\\wwwroot\\Resources/Images\\','/Resources/Images/');
    const imageUrl = `${environment.baseUrl}${relativepath}`;
    return imageUrl;
  }

  signOut() {
    logout.next({});
    // this.chat.onLogout();
    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Success',
    //   detail: 'Logged Out Successfully',
    // });
  }
}
