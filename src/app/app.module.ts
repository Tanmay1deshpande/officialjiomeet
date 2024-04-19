import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule, MatIconButton } from '@angular/material/button'
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'

import { MainVideoCallComponent } from './components/main-video-call/main-video-call.component';
import { CallControlsComponent } from './components/main-video-call/call-controls/call-controls.component';
import { PreviewscreenComponent } from './components/previewscreen/previewscreen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LoaderComponent } from './components/loader/loader/loader.component';
// import { LoaderModule } from './components/loader/loader/loader.module';
import { ParticipantsViewComponent } from './components/main-video-call/participants-view/participants-view.component';
import { GalleryComponent } from './components/main-video-call/gallery/gallery.component';
import { CallAudioSettingsComponent } from './components/call-settings/call-audio-settings/call-audio-settings.component';
import { MatDialogComponent } from './components/mat-dialog/mat-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MainVideoCallComponent,
    CallControlsComponent,
    PreviewscreenComponent,
    ParticipantsViewComponent,
    GalleryComponent,
    CallAudioSettingsComponent,
    MatDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule
    // LoaderModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
