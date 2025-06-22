import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioTranscriptionComponent } from './audio-transcription.component';

describe('AudioTranscriptionComponent', () => {
  let component: AudioTranscriptionComponent;
  let fixture: ComponentFixture<AudioTranscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudioTranscriptionComponent]
    });
    fixture = TestBed.createComponent(AudioTranscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
