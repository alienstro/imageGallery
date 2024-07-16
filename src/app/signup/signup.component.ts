import { Component, NgZone } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../login/dialog/dialog.component';
import { catchError, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: {
    email: string;
    password: string;
    repassword: string;
    firstname: string;
    lastname: string;
  } = {
    email: '',
    password: '',
    repassword: '',
    firstname: '',
    lastname: ''
  };

  error: string = '';

  constructor(private dialog: MatDialog, private router: Router, private ngZone: NgZone, private dataService: DataService, private userService: UserService, private _snackBar: MatSnackBar) {}

  onSignup() {
    this.dataService.signup(this.signupForm.email, this.signupForm.password, this.signupForm.repassword, this.signupForm.firstname, this.signupForm.lastname, "signup").pipe(
      tap((event: HttpResponse<any>) => {
        if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<any>;
          if (response.body.status.remarks === 'uccess') {
            this.userService.setUserId(response.body.payload);
            this.ngZone.run(() => {
              this.router.navigate(['/landing-page']);
            });
          } else {
            // do nothing, error will be caught by catchError
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.error.status.message === 'Email Already Taken') {
          this._snackBar.open('Email is already taken', 'Close', {
            duration: 8000,
          });

        } else if (error.error.status.message === 'Passwords do not match'){
          this._snackBar.open('Passwords do not match', 'Close', {
            duration: 5000,
          });
        } else if (error.error.status.message === 'Name should be less than 30 characters'){
          this._snackBar.open('Name should be less than 30 characters', 'Close', {
            duration: 5000,
          });
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
      })
    ).subscribe();
  }
}