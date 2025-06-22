import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AudioTranscriptionComponent } from './audio-transcription/audio-transcription.component'; // Adjust the import path if needed

const routes: Routes = [
  { path: '', component: AudioTranscriptionComponent },
  { path: 'transcription', component: AudioTranscriptionComponent },
  // Add other routes if needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
