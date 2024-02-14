import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './components/chat/chat.component';
import { ToastModule } from 'primeng/toast';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { GroupMembersComponent } from './components/group-members/group-members.component';
import { UserListingComponent } from './components/user-listing/user-listing.component';
import { RequestsComponent } from './components/requests/requests.component';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    ChatComponent,
    CreateGroupComponent,
    GroupMembersComponent,
    UserListingComponent,
    RequestsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastModule,
    PickerModule,
    ModalModule,
    FileUploadModule
  ],
  providers: [
    MessageService,
    BsModalService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
