import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Song } from '../models/song';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  
  API_URL: string = environment.apiUrl;
  songGenres: string[] = ['Rock', 'Pop', 'Hip-Hop', ];
  
  private songsSubject$$ = new BehaviorSubject<Song[]>([]);
  private currentSong$$ = new BehaviorSubject<Song | undefined>(undefined);

  get songList$(): Observable<Song[]> {
    return this.songsSubject$$.asObservable();
  }

  get currentSong$(): Observable<Song | undefined> {
    return this.currentSong$$.asObservable();
  }

  setCurrentSong(song: Song) {
    this.currentSong$$.next(song);
  }

  getCurrentSong() {
    return this.currentSong$$.value;
  }

  constructor(private http: HttpClient) { }

  getAllSongs() {
    this.http.get<Song[]>(`${this.API_URL}songs/`, this.httpOptions)
      .pipe(
        tap(s => this.songsSubject$$.next(s)),
        catchError(this.handleError<Song[]>('getAllSongs', []))
      )
      .subscribe();
  }
  
  getSong(song: Song) {
    this.http.get<Song>(`${this.API_URL}songs/${song.id}`, this.httpOptions)
      .pipe(
        tap(song => this.currentSong$$.next(song)),
        catchError(this.handleError<Song>('getSong'))
      )
      .subscribe();
  }
  
  saveSong(song: Song) {
    !this.currentSong$$.value?.id ?
      this.createSong({...song, id: 0}) : 
      this.updateSong({...song, id: this.currentSong$$.value?.id});
  }

  createSong(song: Song) {
    this.http.post<Song>(`${this.API_URL}songs/`, song, this.httpOptions)
      .pipe(
        tap(s => {
          this.songsSubject$$.next([...this.songsSubject$$.value, s]);
        }),
        tap(s => this.currentSong$$.next(s)),
        catchError(this.handleError<Song>('createSong'))
      )
      .subscribe();
  }

  updateSong(song: Song) {
    this.http.put<Song>(`${this.API_URL}songs/${song.id}`, song, this.httpOptions)
      .pipe(
        tap(() => this.songsSubject$$.next(this.songsSubject$$.value.map(s => s.id === song.id ? song : s))),
        tap(s => this.currentSong$$.next(s)),
        catchError(this.handleError<Song>('updateSong'))
      )
      .subscribe();
  }

  deleteSong(id: number) {
    this.http.delete<Song>(`${this.API_URL}songs/${id}`, this.httpOptions)
      .pipe(
        tap(() => this.songsSubject$$.next([...this.songsSubject$$.value.filter(s => s.id !== id)])),
        tap(() => this.currentSong$$.next(undefined)),
        tap(() => this.getAllSongs()),
        catchError(this.handleError<Song>('deleteSong'))
      )
      .subscribe();
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }
}
