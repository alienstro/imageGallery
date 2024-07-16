import { Component, NgZone } from '@angular/core';
import { DataService } from '../services/data.service';
import { HttpErrorResponse, HttpEventType, HttpResponse } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../login/dialog/dialog.component';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  emaill: string = '';
  passwordd: string = '';
  repasswordd: string = '';
  firstnamee: string = '';
  lastnamee: string = '';
  error: string = '';

  constructor(private dialog: MatDialog, private router: Router, private ngZone: NgZone, private dataService: DataService, private userService: UserService) {

  }

  openDialog(message: string) {
    this.dialog.open(DialogComponent, {
      data: { message: message },
      width: '425px',
      height: '300px'
    });
  }

  onSignup() {
    const email = this.emaill;
    const password = this.passwordd;
    const firstname = this.firstnamee;
    const lastname = this.lastnamee;

    this.dataService.signup(email, password, firstname, lastname, "signup").pipe(
      tap((event: HttpResponse<any>) => {
        if (event.type === HttpEventType.Response) {
          const response = event as HttpResponse<any>;
          if (response.body.status.remarks === 'success') {
            this.userService.setUserId(response.body.payload);
            this.ngZone.run(() => {
              this.router.navigate(['/landing-page']);
            });
          } else {
            // this.openDialog("Email Already Taken. Please try again");
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle the error here
        // For example, open a dialog or log the error
        // this.openDialog("Email Already Taken. Please try again");
        // Return an observable with a user-facing error message
        return throwError(() => new Error('Something bad happened; please try again later.'));
      })
    ).subscribe();
  }
}
