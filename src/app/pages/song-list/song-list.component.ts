import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Song } from '../../models/song';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent {
  @Input() songList!: Song[];
  @Input() displayedColumns!: string[];
  @Output() editSong: EventEmitter<Song> = new EventEmitter<Song>();
  @Output() deleteSong: EventEmitter<number> = new EventEmitter<number>();
  @Output() addSong: EventEmitter<Song> = new EventEmitter<Song>()

  deleteClicked(event: any, id: number) {
    event.stopPropagation();
    this.deleteSong.emit(id);
  }
}
