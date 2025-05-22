import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  @Input() userData = { Username: '', password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Sends user login data to the backend and handles the response.
   */
  userLogin(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        // On successful login, store user and token in localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);

        this.dialogRef.close(); // Close the login dialog
        this.snackBar.open('Login successful', 'OK', { duration: 2000 });

        // Navigate to the movies page after successful login
        this.router.navigate(['movies']);
      },
      (error) => {
        // Show an error message on login failure
        this.snackBar.open(`Login failed: ${error.error?.message || error.message || error}`, 'OK', { duration: 3000 });
      }
    );
  }
}
