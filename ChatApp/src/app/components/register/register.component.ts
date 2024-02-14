import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  signupForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';

  constructor(private formBuilder:FormBuilder, private authService:AuthService,private chatService:ChatService, private router:Router,private messageService:MessageService){}

  ngOnInit() : void{
    this.signupForm = this.formBuilder.group({
      username: ['',Validators.required],
      email: ['',Validators.required],
      imageFile: [''],
      password: ['',Validators.required],
      confirmPassword: ['',Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onFileUpload(event: any): void {
    const file = event.files[0];
    this.signupForm.patchValue({
      imageFile: file,
    });
  }
  
  onSignup(){
    if(this.signupForm.valid){

      const formData = new FormData();
      formData.append('username',this.signupForm.get('username')?.value);
      formData.append('email',this.signupForm.get('email')?.value);
      formData.append('imageFile',this.signupForm.get('imageFile')?.value);
      formData.append('password',this.signupForm.get('password')?.value);
      formData.append('confirmPassword',this.signupForm.get('confirmPassword')?.value);

      const imageFile = this.signupForm.get('imageFile')?.value;
      if (imageFile instanceof File) {
        formData.append('imageFile', imageFile, imageFile.name);
      }

      this.authService.signUp(formData).subscribe({
        next:(res => {
          this.messageService.add({severity: 'success', summary:  'Success', detail: 'User Registered Successfully!' });
          this.signupForm.reset();
          this.router.navigate(['login']);
        }),
        error:(err => {
          this.messageService.add({severity: 'error', summary:  `${err.message}`, detail: 'Some Error Occured' });
        })
      })
    }
    else{
      this.chatService.validateAllFormFields(this.signupForm);
      this.messageService.add({severity: 'error', summary:  'Invalid Form', detail: 'Validations Failed' });
    }
  }
}
