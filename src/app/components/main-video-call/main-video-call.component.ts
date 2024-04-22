import { Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { MediaserviceService } from '../../services/mediaservice.service';
import { JMDeviceManager } from '@jiomeet/core-sdk-web';
import * as html2canvas from 'html2canvas';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';

@Component({
  selector: 'app-main-video-call',
  templateUrl: './main-video-call.component.html',
  styleUrls: ['./main-video-call.component.css']
})
export class MainVideoCallComponent {

  private unsubscriber: Subject<void> = new Subject<void>();
  showloader!: boolean;
  loaderService: any;
  subs: any[] = [];
  localpeer: any;
  enablePanOverlay: boolean = false
  enableFaceOverlay: boolean = false
  participantsInCall:any[]=[];
  dominantSpeaker: any;
	@ViewChild('videoElement') videoElement!:ElementRef;
  optionsController={
    more:false
  }
  private confirmedNavigation = false;
  constructor(
    public mediaservice: MediaserviceService,
    private router : Router, 
    private matDialog: MatDialog,
    private location: Location
  ){}

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: Event) {
    //event.preventDefault();
    console.log('Refresh button pressed!');
    this.mediaservice.leaveMeeting();
  }
  
  @HostListener('window:popstate', ['$event'])
  onPopState(event: Event) {
    //event.preventDefault();
    console.log('Back button pressed!');
    this.mediaservice.leaveMeeting();
  }

	ngOnInit(){

    
    
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationStart) {
    //     if (event instanceof NavigationStart && event.navigationTrigger === 'popstate') {
    //       this.openDialog();
    //     }
    //   }
    // });

    // fromEvent(window, 'popstate')
    //   .pipe(takeUntil(this.unsubscriber))
    //   .subscribe((_) => {
    //     history.pushState(null, '');
    //     alert(`You can't make changes or go back at this time.`);
    // });


    // this.showloader = true;
    // this.loaderService.showLoader();
		// this.startCamera();
    // this.showloader = true;
    // this.loaderService.hideLoader();

    // this.registerDevices();

    // this.mediaservice.createPreview();
    // this.subs.push(
    //   this.mediaservice.getLocalParticipant().subscribe(async (data) => {
    //     if (data.action == 'videoOn') {
    //       const videoTrack = data.localpeer;
    //       videoTrack.play('localpeer');
    //     }
    //   })
    // );
	}

  openDialog(){
    this.matDialog.open(MatDialogComponent,{
      width: '350px'
    })
  }

  async registerDevices() {
    await JMDeviceManager.getMediaPermissions(true, true);
  
    JMDeviceManager.getDevices();
  }
  
  changeController(){
    this.optionsController.more=!this.optionsController.more;
  }
  
  async subscribeToVideo(peer:any){
    const videoTrack = await this.mediaservice.jmClient.subscribeMedia(peer,"video");
    videoTrack.play(peer.peerId);
  }

  togglePanOverlay(){
    this.enablePanOverlay = !this.enablePanOverlay;
    this.enableFaceOverlay=false
    console.log('pan toggled')
  }

  toggleFaceOverlay(){
    this.enableFaceOverlay = !this.enableFaceOverlay;
    this.enablePanOverlay=false
    console.log('facetoggled')
  }

  captureScreenshot() {
    const element = document.getElementById('main-video-container');
    console.log(element);
    if(element){
    html2canvas.default(element).then((canvas: { toDataURL: (arg0: string) => any; }) => {
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL('image/png');
      this.downloadScreenshot(imageData);
    });
  }else {
    console.log('element not found')
  }
  }

  async toggleFlipCam(){
    // await this.mediaservice.toggleFlipCamera();
    await this.mediaservice.flipcam();
  }
  
  downloadScreenshot(imageData: string) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'screenshot.png'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  // ngOnDestroy() {
  //   // Removing the event listener when the component is destroyed
  //   window.removeEventListener('beforeunload', this.onPageRefresh);
  // }
  
  
}
