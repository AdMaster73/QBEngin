import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  errorMessage: string;
  isAuth:boolean
  hide = true;

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService,
              private router: Router) {                
              }

  ngOnInit() {   
    this.authService.isLoggedURL() ? this.router.navigate(['/sidenav','home']) : this.router.navigate(['/auth','signin']);
    this.initForm();
  }

  initForm() {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]]
    });
  }
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Vous devez entrer un email valid';
    }

    return this.email.hasError('email') ? 'email non valid' : '';
  }
  onSubmit() {
    const email = this.signinForm.get('email').value;
    const password = this.signinForm.get('password').value;
    
    this.authService.signInUser(email, password).then(
      () => {
        this.router.navigate(['sidenav'], { replaceUrl: true });
      },
      (error) => {
        this.errorMessage = error;
      }
    );
    //this.authService.login()
  }
}