import { Component } from '@angular/core';
import { MediaserviceService } from 'src/app/services/mediaservice.service';

@Component({
  selector: 'app-mat-dialog',
  templateUrl: './mat-dialog.component.html',
  styleUrls: ['./mat-dialog.component.css']
})
export class MatDialogComponent {

  constructor(
    private mediaservice: MediaserviceService
  ){}

  back_message = "Do you want to Leave the meeting?"

  leaveMeeting(){
    this.mediaservice.leaveMeeting();
    console.log("Left by popstate");
  }
}
