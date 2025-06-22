import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { response } from 'express';

@Component({
  selector: 'app-audio-transcription',
  templateUrl: './audio-transcription.component.html',
  styleUrls: ['./audio-transcription.component.css'],
})
export class AudioTranscriptionComponent implements OnDestroy {
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  isDragging = false;
  selectedLanguage: string = 'en';
  serverResponseReceived = false;
  transcription: string = '';
  translation: string = '';
  private destroy$ = new Subject<void>();

  
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese (Simplified)' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'tr', name: 'Turkish' },
    { code: 'pl', name: 'Polish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'da', name: 'Danish' },
    { code: 'fi', name: 'Finnish' },
    { code: 'el', name: 'Greek' },
    // Add more languages as needed...
  ];

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.selectedFile = file;

    this.sendFileToServer(file);
  }

  onDragOver(event: any): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: any): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: any): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer.files[0];
    this.selectedFile = file;

    this.sendFileToServer(file);
  }

  private sendFileToServer(file: File): void {
    const serverUrl = 'http://localhost:8888/upload';

    const formData = new FormData();
    formData.append('audioFile', file);

    formData.append('language', this.selectedLanguage);

    this.http
      .post<any>(serverUrl, formData)
      .pipe()
      .subscribe((response: any) => {
        this.translation = response.transcriptionAndTranslation[0].content
        this.transcription = response.transcriptionAndTranslation[1]
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
