import { Component, ViewChild, ElementRef, HostListener, AfterViewInit} from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { MediaserviceService } from '../../services/mediaservice.service';
import { IJMChatPayloadConfig, IJMVideoSettings, JMClient, JMDeviceManager } from '@jiomeet/core-sdk-web';
import * as html2canvas from 'html2canvas';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogComponent } from '../mat-dialog/mat-dialog.component';
import { GalleryComponent } from './gallery/gallery.component';

@Component({
  selector: 'app-main-video-call',
  templateUrl: './main-video-call.component.html',
  styleUrls: ['./main-video-call.component.css']
})
export class MainVideoCallComponent implements AfterViewInit {

  private unsubscriber: Subject<void> = new Subject<void>();
  showloader!: boolean;
  loaderService: any;
  subs: any[] = [];
  localpeer: any;
  myName:any[]=[];
  name:any;
  enablePanOverlay: boolean = false
  enableFaceOverlay: boolean = false
  isMeetingLocked:boolean = false
  isRecording:boolean = false
  openChatBox:boolean = false
  isChatActive:boolean = false
  participantsInCall:any[]=[];
  dominantSpeaker: any;
  jmClient = new JMClient();

	@ViewChild('videoElement') videoElement!:ElementRef;
  @ViewChild(GalleryComponent, { static: false }) gallerycomponent!: GalleryComponent;
  @ViewChild('panOverlayIn') overlayDiv!: ElementRef;
  @ViewChild('faceOverlayIn') faceOverlayDiv!: ElementRef;

  optionsController={
    more:false
  }
  private confirmedNavigation = false;
  vSettings!: IJMVideoSettings;
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
    this.mediaservice.getChatOpened().subscribe(async (boolvalue)=> {
      this.isChatActive=boolvalue;
    })

    this.mediaservice.getMyName().subscribe((myname)=>{
      this.myName.push(myname);
      this.name = myname
    })

    
    
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

  ngAfterViewInit() {
    // Access child component's DOM element after view initialization
    if (this.gallerycomponent) {
      console.log("parentdiviv: ",this.gallerycomponent.parentDiv.nativeElement);
    }
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
    videoTrack.play(peer.peerId, { mirror: false });
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

  // captureScreenshot() {
  //   const element = document.getElementById('main-video-container');
  //   console.log(element);
  //   if(element){
  //   html2canvas.default(element, { scale:0.8 }).then((canvas: { toDataURL: (arg0: string) => any; }) => {
  //     // Convert canvas to base64 image
  //     const imageData = canvas.toDataURL('image/png');
  //     this.downloadScreenshot(imageData);
  //   });
  // }else {
  //   console.log('element not found')
  // }
  // }

  lockMeeting(){
    this.isMeetingLocked = !this.isMeetingLocked;
    this.jmClient.toggleMeetingLock();
    console.log('Meeting lock toggled')
  }

  async toggleFlipCam(){
    // await this.mediaservice.toggleFlipCamera();
    await this.mediaservice.flipcam();
  }

  toggleRecording(){
    this.mediaservice.toggleRecording()
    this.isRecording=!this.isRecording
    console.log('Recording toggled')
  }
  
  downloadScreenshot(imageData: string) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'screenshot.jpg'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toggleChat(){
    this.mediaservice.loadChatBox();
    this.isChatActive = !this.isChatActive
  }


  // ngOnDestroy() {
  //   // Removing the event listener when the component is destroyed
  //   window.removeEventListener('beforeunload', this.onPageRefresh);
  // }

  captureScreenshot() {
    const parentElement = this.gallerycomponent.parentDiv.nativeElement;
    console.log("parent",parentElement);
    const overlayElement = this.overlayDiv.nativeElement;
    console.log("pan",overlayElement);
    const faceOverlayElement = this.faceOverlayDiv.nativeElement;
    console.log("face",faceOverlayElement);

    const parentRect = parentElement.getBoundingClientRect();
    const overlayRect = overlayElement.getBoundingClientRect();
    const faceOverlayRect = faceOverlayElement.getBoundingClientRect();

    const overlayX = overlayRect.left - parentRect.left;
    const overlayY = overlayRect.top - parentRect.top;
    const overlayWidth = overlayRect.width;
    const overlayHeight = overlayRect.height;

    const faceOverlayX = faceOverlayRect.left - parentRect.left;
    const faceOverlayY = faceOverlayRect.top - parentRect.top;
    const faceOverlayWidth = faceOverlayRect.width;
    const faceOverlayHeight = faceOverlayRect.height;

    if(this.enablePanOverlay){
      html2canvas.default(parentElement, { 
        width: overlayWidth,
        height: overlayHeight,
        x: overlayX,
        y: overlayY,
        scale: window.devicePixelRatio * 2
      }).then(canvas => {
        const imageData = canvas.toDataURL('image/jpg');
        // const img = new Image();
        // img.src = imageData;
        // document.body.appendChild(img); 
        this.downloadScreenshot(imageData); // For demonstration, append image to body
      });
    }else if(this.enableFaceOverlay){
      html2canvas.default(parentElement, { 
        width: faceOverlayWidth,
        height: faceOverlayHeight,
        x: faceOverlayX,
        y: faceOverlayY,
        scale: window.devicePixelRatio * 2
      }).then(canvas => {
        const imageData = canvas.toDataURL('image/jpg');
        // const img = new Image();
        // img.src = imageData;
        // document.body.appendChild(img); 
        this.downloadScreenshot(imageData); // For demonstration, append image to body
      });
    }
    
  }

  callGrandchild(){
    return this.gallerycomponent.parentDiv.nativeElement;
  }
  
  
}
