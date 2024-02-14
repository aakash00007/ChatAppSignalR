import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private chatService: ChatService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      debugger
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.loginForm.reset();
          this.authService.storeToken(res.data);
          const payload = this.authService.getPayLoadFromToken();

          this.chatService.setNameToStorage(payload.name);
          this.chatService.setRoleToStorage(payload.role);
          this.chatService.setIdToStorage(payload.id);

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logged In Successfully',
          });
          this.router.navigate(['chat']);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Credentials Failed!',
            detail: 'Please Check Your Password!',
          });
        },
      });
    } else {
      this.chatService.validateAllFormFields(this.loginForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid Form',
        detail: 'Validations Failed',
      });
    }
  }
}
