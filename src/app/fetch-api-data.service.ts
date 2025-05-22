import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

const apiUrl = 'https://movie-api-padma-7528be21ca05.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    console.log('Registering user:', userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }

  // User login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(catchError(this.handleError));
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get a single movie by title
  public getMovie(title: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${title}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get director info by name
  public getDirector(name: string): Observable<any> {
    return this.http
      .get(apiUrl + `director/${name}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get genre info by name
  public getGenre(name: string): Observable<any> {
    return this.http
      .get(apiUrl + `genre/${name}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get all users
  public getAllUsers(): Observable<any> {
    return this.http
      .get(apiUrl + 'users', this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get user by username
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + `users/${username}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get user's favorite movies
  public getUserFavorites(username: string): Observable<any> {
    return this.http
      .get(apiUrl + `users/${username}/favorites`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Add a movie to user favorites
  public addMovieToFavorites(username: string, movieId: string): Observable<any> {
    return this.http
.post(apiUrl + `users/${username}/movies/${movieId}`, null, this.getAuthHeaders())

      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Edit user details
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + `users/${username}`, userDetails, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Delete a user
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/${username}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Remove a movie from user favorites
  public removeMovieFromFavorites(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/${username}/movies/${movieId}`, this.getAuthHeaders())

      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Helper method to prepare HTTP headers with Authorization token.
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
    } else {
      // Backend error
      console.error(
        `Server returned code ${error.status}, ` + `body was: ${JSON.stringify(error.error)}`
      );
    }
    // Return a user-friendly error message
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  // Extract response data
  private extractResponseData(res: any): any {
    return res || {};
  }
}
