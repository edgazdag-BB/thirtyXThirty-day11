import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { Song } from 'src/app/models/song';
import { SongService } from 'src/app/services/song.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'artist', 'album', 'genre', 'delete']

  songForm =  new FormGroup({
    name: new FormControl('', Validators.required),
    artistName: new FormControl('', Validators.required),
    albumName: new FormControl('', Validators.required),
    genre: new FormControl('', Validators.required)
  });

  songForm$ = this.songService.currentSong$.pipe(
    tap(s => s ? this.songForm.patchValue(s) : this.songForm.reset()),
    map(s => this.songForm)
  );
  
  currentSong$ = this.songService.currentSong$;

  constructor(public songService: SongService) {}

  ngOnInit(): void {
    this.songService.getAllSongs();
  }

  setCurrentSong(song: Song) {
    this.songService.getSong(song);
  }

  addSong() {
    this.songService.setCurrentSong({name: '', artistName: '', albumName: '', genre: ''});
    //this.songForm.reset();
  }

  saveSong() {
    const song = this.songForm.value as Omit<Song, 'id'>;

    this.songService.saveSong(song);
  }

  deleteSong(id: number) {
    this.songService.deleteSong(id);
    this.songService.getAllSongs();
  }
}
