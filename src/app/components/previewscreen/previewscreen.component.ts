import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {merge} from 'rxjs';
import { MediaserviceService } from 'src/app/services/mediaservice.service';
import { JMDeviceManager } from '@jiomeet/core-sdk-web';

@Component({
  selector: 'app-previewscreen',
  templateUrl: './previewscreen.component.html',
  styleUrls: ['./previewscreen.component.css']
})
export class PreviewscreenComponent {

  errorMessage = '';
  meetingcreds!: FormGroup;
  form: any;
  localpeer: any;
  isLocalMicOn = false;
  isLocalVideoOn = false;
  vb = 0;
  subs: any[] = [];

  constructor(
    private formbuilder: FormBuilder,
    private mediaservice: MediaserviceService
  ){}

  ngOnInit(){
    this.meetingcreds = this.formbuilder.group({
      meetingId: new FormControl('',[Validators.required]),
      meetingPin: new FormControl('',[Validators.required]),
      displayName: new FormControl('',[Validators.required])
  });
  

  
    this.registerDevices();

    this.mediaservice.createPreview();
    this.subs.push(
      this.mediaservice.getLocalParticipant().subscribe(async (data) => {
        if (data.action == 'videoOn') {
          const videoTrack = data.localpeer;
          videoTrack.play('localpeer');
        }
      })
    );
}
async registerDevices() {
  await JMDeviceManager.getMediaPermissions(true, true);

  JMDeviceManager.getDevices();
}


async toggleVideo() {
  await this.mediaservice
    .toggleLocalVideoStatus()
    .then(() => {
      this.isLocalVideoOn = !this.isLocalVideoOn;
      console.log('video toggled')
    })
    .catch(() => {});
}

async toggleAudio() {
  await this.mediaservice
    .toggleLocalMicStatus()
    .then(() => {
      this.isLocalMicOn = !this.isLocalMicOn;
      console.log('Mic toggled')
    })
    .catch(() => {});
}
join() {
  this.mediaservice.joinCall(
    this.form.value.meetingId,
    this.form.value.pin,
    this.form.value.name,
    {
      isMicMuted: !this.isLocalMicOn,
      VideoMuted: !this.isLocalVideoOn,
    }
  );
}

ngOnDestroy(): void {
  this.subs.forEach((s) => {
    s.unsubscribe();
  });
}

}
