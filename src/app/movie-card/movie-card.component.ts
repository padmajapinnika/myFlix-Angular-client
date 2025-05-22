import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DirectorDialogComponent } from '../director-dialog/director-dialog.component';
import { GenreDialogComponent } from '../genre-dialog/genre-dialog.component';
import { MovieDetailsDialogComponent } from '../movie-details-dialog/movie-details-dialog.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

   /**
   * Method to fetch all movies
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      return this.movies;
    });
  }
   /**
   * Checks if a movie is a favorite
   * @param movieId ID of the movie to check
   * @returns True if the movie is a favorite, false otherwise
   */
  isFavorite(movieId: string): boolean {
    const localUser: string | null = localStorage.getItem('user');
    const parsedUser: any = localUser && JSON.parse(localUser);
    return parsedUser.favoriteMovies.includes(movieId);
  }

   /**
   * Handler to add a movie to user favorites or to remove it
   * @param movieId The movie id to add or remove from or to favorites
   */
 handleFavorite(movieId: string): void {
  const localUser: string | null = localStorage.getItem('user');
  if (!localUser) {
    this.snackBar.open('User not logged in', 'OK', { duration: 2000 });
    return;
  }

  const parsedUser = JSON.parse(localUser);
  const username = parsedUser.Username;
  const isFavorite = this.isFavorite(movieId);

  if (!isFavorite) {
    this.fetchApiData.addMovieToFavorites(username, movieId).subscribe({
      next: (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.snackBar.open('Movie added to favorites', 'OK', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Could not add favorite: ' + err.message, 'OK', { duration: 2000 });
      }
    });
  } else {
    this.fetchApiData.removeMovieFromFavorites(username, movieId).subscribe({
      next: (updatedUser) => {
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.snackBar.open('Movie removed from favorites', 'OK', { duration: 2000 });
      },
      error: (err) => {
        this.snackBar.open('Could not remove favorite: ' + err.message, 'OK', { duration: 2000 });
      }
    });
  }
}


  /**
   * Method to open the dialog with information about a director
   * @param director The director information object
   */
  openDirectorDialog(director: any): void {
    this.dialog.open(DirectorDialogComponent, {
      width: '400px',
      data: director,
    });
  }

  /**
   * Method to open the dialog with information about a genre
   * @param genre The genre information object
   */
  openGenreDialog(genre: any): void {
    this.dialog.open(GenreDialogComponent, {
      width: '400px',
      data: genre,
    });
  }

  /**
   * Method to open the dialog with information about a movie
   * @param movie The movie information object
   */
  openMovieDetailsDialog(movie: any): void {
    this.dialog.open(MovieDetailsDialogComponent, {
      width: '400px',
      data: movie,
    });
  }
}
