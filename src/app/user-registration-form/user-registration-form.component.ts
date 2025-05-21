import { Component, OnInit, Input } from '@angular/core';

// Import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// Import your API service (make sure the class name matches your actual service)
import { FetchApiDataService } from '../fetch-api-data.service';

// Import for displaying snack bar notifications
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', password: '', email: '', Birthday: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Initialization logic can go here if needed
  }

  // Function to send user registration data to the backend
 registerUser(): void {
   console.log('Sending userData:', this.userData); // Add this line
  this.fetchApiData.userRegistration(this.userData).subscribe(
    (result) => {
      console.log('Registration successful:', result); // ✅ Log the successful response
      this.dialogRef.close(); // Close the modal
      this.snackBar.open('Registration successful', 'OK', {
        duration: 2000,
      });
    },
    (error) => {
      console.error('Registration failed:', error); // ✅ Log the error response
      this.snackBar.open('Registration failed: ' + error.error, 'OK', {
        duration: 2000,
      });
    }
  );
}
}