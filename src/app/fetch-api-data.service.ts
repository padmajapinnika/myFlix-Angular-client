import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
//Declaring the api url that will provide data for the client app
const apiUrl = 'https://movie-api-padma-7528be21ca05.herokuapp.com/';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  
  constructor(private http: HttpClient) {}

   /**
   * Registers a new user.
   * @param userDetails Object containing new user data (e.g., username, password, email).
   * @returns Observable with server response.
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log('Registering user:', userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(catchError(this.handleError));
  }
/**
   * Logs in an existing user.
   * @param userDetails Object containing login credentials (e.g., username, password).
   * @returns Observable with user information and token.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(catchError(this.handleError));
  }

/**
   * Retrieves a list of all movies.
   * @returns Observable with an array of movie objects.
   */
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  
  /**
   * Retrieves data for a single movie by title.
   * @param title The title of the movie to retrieve.
   * @returns Observable with the movie object.
   */
  public getMovie(title: string): Observable<any> {
    return this.http
      .get(apiUrl + `movies/${title}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

   /**
   * Retrieves information about a director.
   * @param name The director's name.
   * @returns Observable with the director object.
   */

  public getDirector(name: string): Observable<any> {
    return this.http
      .get(apiUrl + `director/${name}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

    /**
   * Retrieves information about a genre.
   * @param name The genre name.
   * @returns Observable with the genre object.
   */

  public getGenre(name: string): Observable<any> {
    return this.http
      .get(apiUrl + `genre/${name}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
/**
   * Retrieves a list of all users.
   * @returns Observable with an array of user objects.
   */
  public getAllUsers(): Observable<any> {
    return this.http
      .get(apiUrl + 'users', this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Retrieves data for a specific user.
   * @param username The username of the requested user.
   * @returns Observable with the user object.
   */
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + `users/${username}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

   /**
   * Retrieves the list of favorite movies for a user.
   * @param username The username of the user.
   * @returns Observable with an array of the user's favorite movies.
   */
  public getUserFavorites(username: string): Observable<any> {
    return this.http
      .get(apiUrl + `users/${username}/favorites`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Adds a movie to the user's list of favorites.
   * @param username The username of the user.
   * @param movieId The ID of the movie to add.
   * @returns Observable with the updated user data or confirmation.
   */
  public addMovieToFavorites(username: string, movieId: string): Observable<any> {
    return this.http
.post(apiUrl + `users/${username}/movies/${movieId}`, null, this.getAuthHeaders())

      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

/**
   * Updates user information.
   * @param username The username of the user to update.
   * @param userDetails An object containing the updated user details.
   * @returns Observable with the updated user object.
   */
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + `users/${username}`, userDetails, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Deletes a user account.
   * @param username The username of the user to delete.
   * @returns Observable confirming deletion.
   */
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/${username}`, this.getAuthHeaders())
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

 
  /**
   * Removes a movie from the user's favorites.
   * @param username The username of the user.
   * @param movieId The ID of the movie to remove.
   * @returns Observable with the updated user data or confirmation.
   */
  public removeMovieFromFavorites(username: string, movieId: string): Observable<any> {
    return this.http
      .delete(apiUrl + `users/${username}/movies/${movieId}`, this.getAuthHeaders())

      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

 /**
   * Creates HTTP headers with the Authorization token.
   * @returns An object with HTTP headers including the Bearer token.
   */
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : '',
      }),
    };
  }
/**
   * Handles HTTP errors.
   * @param error The HttpErrorResponse returned from the server.
   * @returns Throws an observable error with a user-friendly message.
   */
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

 
  /**
   * Extracts the response data from HTTP response.
   * @param res The raw HTTP response.
   * @returns The response body or an empty object.
   */
  private extractResponseData(res: any): any {
    return res || {};
  }
}
