import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import { MustMatch } from './must-match.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;
  errorMessage: string;
  hide = true;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      confirmPassword:['',[Validators.required] ]     
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });    
  }
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('',[Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]);
  confirmPassword = new FormControl('',[Validators.required]);
  getErrorMessage() {
    if (this.signupForm.controls['email'].hasError('required')) {
      return 'Champs email obligatoir';
    }

    return this.signupForm.controls['email'].hasError('email') ? 'email non valid' : '';
  }
  getErrorMessagePW() {
    if (this.signupForm.controls['password'].hasError('required')) {
      return 'Champs mot de passe obligatoir';
    }
    return this.signupForm.controls['password'].hasError('pattern') ? 'mot de passe doit contenir au moins 6 carachtères et des chifres' : '';
  }
  getErrorMessagePWC() {
    if (this.signupForm.controls['confirmPassword'].hasError('required')) {
      return 'Chanmps mot de passe de confirmation obligatoire';
    }
    return this.signupForm.controls['confirmPassword'].hasError('pattern') ? 'vous devez réentrer à nouveau votre mot de passe' : '';
  }

  onSubmit() {
    const email = this.signupForm.get('email').value;
    const password = this.signupForm.get('password').value;
    this.authService.createNewUser(email, password).then(
      () => {
        this.router.navigate(['sidenav/user'], { replaceUrl: true });
      },
      (error) => {
        this.errorMessage = error;
      }
    );
  }
}