import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatButtonModule, MatIconButton } from '@angular/material/button'
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { MainVideoCallComponent } from './components/main-video-call/main-video-call.component';
import { CallControlsComponent } from './components/main-video-call/call-controls/call-controls.component';
import { PreviewscreenComponent } from './components/previewscreen/previewscreen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MainVideoCallComponent,
    CallControlsComponent,
    PreviewscreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
