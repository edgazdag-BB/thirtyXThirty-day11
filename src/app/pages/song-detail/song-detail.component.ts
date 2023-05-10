import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Song } from 'src/app/models/song';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent {
  @Input() songGenres!: string[];
  @Input() songForm!: FormGroup;
  @Output() saveSong = new EventEmitter();
}
