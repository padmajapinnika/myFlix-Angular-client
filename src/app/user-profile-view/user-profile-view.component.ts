import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss'],
})
export class UserProfileViewComponent implements OnInit {
  @Input() user: any = {};
  @Input() birthday: string = '';
  favoriteMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUserData();
  }

  // Display the birthday in a readable format
  get displayBirthday() {
    return this.birthday;
  }
  set displayBirthday(v) {
    this.user.Birthday = v;
  }

  /**
   * Method to fetch the data for the current logged in user
   */
  getUserData(): void {
    const localUser: string | null = localStorage.getItem('user');

    if (!localUser) {
      this.router.navigate(['/welcome']);
      return;
    }
    const parsedUser: any = JSON.parse(localUser);
    this.fetchApiData.getUser(parsedUser.Username).subscribe((result) => {
      this.user = result;
      delete this.user.Password;
      this.birthday = new Date(this.user.Birthday).toLocaleDateString();
      localStorage.setItem('user', JSON.stringify(result));
      this.getFavoriteMovies();
    });
  }

  /**
   * Method to update user informations
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.user.Username, this.user).subscribe(
      (result) => {
        this.snackBar.open('Update successful', 'OK', {
          duration: 2000,
        });
        this.fetchApiData.getUser(this.user.Username).subscribe((result) => {
          this.user = result;
          delete this.user.Password;
          localStorage.setItem('user', JSON.stringify(result));
        });
      },
      (result) => {
        this.snackBar.open('Update failed' + result, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * Method to set the favorite movies of a user
   * @return The favorite movies
   */
getFavoriteMovies(): void {
  this.fetchApiData.getAllMovies().subscribe((resp: any) => {
    const allMovies: any[] = resp;
    const favoriteMovieIds = this.user.favoriteMovies || [];
    this.favoriteMovies = allMovies.filter(movie =>
      favoriteMovieIds.includes(movie._id)
    );
  });
}


  /**
   * Handler to remove a movie from user favorites
   * @param movieId The movie id to remove from user favorites
   */
  removeFavorite(movieId: string): void {

    const localFavorites: any[] = [...this.favoriteMovies];
    
    const filteredFavorites: any[] = localFavorites.filter((m) => m._id !== movieId);
    const favoriteIds: string[] = filteredFavorites.map((favorite)=> favorite._id);

    const favoriteMovies = {
      favoriteMovies: favoriteIds,
    };

    this.favoriteMovies = filteredFavorites;

    this.fetchApiData.editUser(this.user.Username, favoriteMovies).subscribe(
      (result) => {
        this.snackBar.open('Movie removed from favorites', 'OK', {
          duration: 2000,
        });
        localStorage.setItem('user', JSON.stringify(result))
      },
      (result) => {
        this.snackBar.open('Could not remove movie from favorites' + result, 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
     * Method to open the dialog with informations about a director
     * @param director The director informations
     */
    openDirectorDialog(director: any): void {
      this.dialog.open(DirectorDialogComponent, {
        width: '400px',
        data: director,
      });
    }
  
    /**
     * Method to open the dialog with informations about a genre
     * @param genre The genre informations
     */
    openGenreDialog(genre: any): void {
      this.dialog.open(GenreDialogComponent, {
        width: '400px',
        data: genre,
      });
    }
  
    /**
     * Method to open the dialog with informations about a movie
     * @param movie The movie informations
     */
    openMovieDetailsDialog(movie: any): void {
      this.dialog.open(MovieDetailsDialogComponent, {
        width: '400px',
        data: movie,
      });
    }
}