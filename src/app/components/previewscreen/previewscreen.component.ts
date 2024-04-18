import { Component } from '@angular/core';
import {FormControl, ValidatorFn, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {merge} from 'rxjs';
import { MediaserviceService } from 'src/app/services/mediaservice.service';
import { JMClient, JMDeviceManager } from '@jiomeet/core-sdk-web';
// import { LoaderComponent } from '../loader/loader/loader.component';
import { addressValidator, firstCharNotSpaceValidator, noSpacesValidator, maxLengthValidator, maxLengthValidatorForPin } from './whitespace-validator';
import { LoaderService } from '../loader/loader.service';


@Component({
  selector: 'app-previewscreen',
  templateUrl: './previewscreen.component.html',
  styleUrls: ['./previewscreen.component.css']
})
export class PreviewscreenComponent {

  errorMessage = '';
  // showloader: boolean = false;
  meetingcreds!: FormGroup;
  form: any;
  localpeer: any;
  isLocalMicOn = false;
  isLocalVideoOn = false;
  isBackgroundBlur = false;
  vb = 0;
  subs: any[] = [];
  jmClient = new JMClient();

  constructor(
    private formbuilder: FormBuilder,
    private mediaservice: MediaserviceService,
    // private loaderService: LoaderService,
  ){
    this.meetingcreds = this.formbuilder.group({
    
      meetingId: new FormControl('',[firstCharNotSpaceValidator(), noSpacesValidator(), maxLengthValidator()]),
      meetingPin: new FormControl('',[maxLengthValidatorForPin()]),
      displayName: new FormControl('')
  });
  }

  ngOnInit(){
  //  this.testFunction();
    
    
    
  
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

// testFunction() {
//   this.showloader=true;
//     this.loaderService.showLoader();
//     setTimeout(()=>{
//       console.log("Hello, working");
//       this.showloader=false;
//       this.loaderService.hideLoader();
//     }, 2000);
// }


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

async toggleBlur(){
  await this.mediaservice.
  backgroundBlur()
  .then(()=>{
    this.isBackgroundBlur = !this.isBackgroundBlur;
    console.log('Background blur toggled')
  })
  .catch(()=>{});
}


join() {

  console.log('Thank you for joining');
  console.log(this.meetingcreds.value);

  this.mediaservice.joinCall(
    this.meetingcreds.value.meetingId.toString(),
    this.meetingcreds.value.meetingPin.toString(),
    this.meetingcreds.value.displayName.toString(),
    {
        isMicMuted: !this.isLocalMicOn,
        VideoMuted: !this.isLocalVideoOn,
        // audioInputDeviceId: '',
        // audioOutputDeviceId: '',
        // videoDeviceId: '',
    }
  );
}

// onPaste(event: ClipboardEvent) {
//     setTimeout(() => {
//       const value = (event.target as HTMLInputElement).value;
//       if (value.includes('-')) {
//         (event.target as HTMLInputElement).value = value.replace(/-/g, ' ');
//       } else if (!/\s/.test(value)) {
//         if (!/^[1-9]\d*$/.test(value)) {
//           const meetingId = this.getParameterByName('meetingId', value);
//           const pin = this.getParameterByName('pwd', value);
//           if (meetingId) {
//             this.form.patchValue({ meetingId });
//           }
//           if (pin) {
//             this.form.patchValue({ pin });
//           }
//           (event.target as HTMLInputElement).value = `${meetingId?.substring(
//             0,
//             3
//           )} ${meetingId?.substring(3, 6)} ${meetingId?.substring(6)}`;
//           return;
//         }
//         (event.target as HTMLInputElement).value = `${value.substring(
//           0,
//           3
//         )} ${value.substring(3, 6)} ${value.substring(6)}`;
//       }
//     }, 0);
//   }

//   getParameterByName(name: string, url?: string) {
//     if (!url) {
//       url = window.location.href;
//     }
//     name = name.replace(/[\[\]]/g, '\\$&');
//     const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
//     const results = regex.exec(url);
//     if (!results) {
//       return null;
//     }
//     if (!results[2]) {
//       return '';
//     }
//     return decodeURIComponent(results[2].replace(/\+/g, ' '));
//   }



ngOnDestroy(): void {
  this.subs.forEach((s) => {
    s.unsubscribe();
  });
}

}
