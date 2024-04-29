import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { JMClient } from '@jiomeet/core-sdk-web';
import { MediaserviceService } from 'src/app/services/mediaservice.service';

@Component({
  selector: 'app-call-controls',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.css']
})
export class CallControlsComponent {

  
  isLocalVideoOn = false;
  isLocalMicOn = false;
  isBackgroundBlur = false;
  isScreenShare = false;
  micMuted = true;
  videoMuted = true;
  preview: any;
  enablePanOverlay: boolean = true
  enableFaceOverlay: boolean = true
  openChatBox:boolean = false
  isChatActive:boolean = false
  @Output() changeControl = new EventEmitter();
  signalQuality='NONE'
  @ViewChild('network')
  networkIndicator!: ElementRef;
  //jmClient = new JMClient();

  constructor(
    private mediaservice: MediaserviceService,
    private renderer:Renderer2 
  ){}

  ngOnInit(){

    window.onbeforeunload = async () => {
      await this.leave();
    };

    this.mediaservice.getLocalParticipant().subscribe((data) => {
      switch (data.action) {
        case 'videoOn':
          this.videoMuted = false;
          break
        case 'videoOff':
          this.videoMuted = true;
          break
        case 'startShare':
          this.isScreenShare = true;
          break
        case 'stopShare':
          this.isScreenShare = false;
          break
        case 'audioOff':
          this.micMuted=true;
          break
        case 'audioOn':
          this.micMuted=false;
          break
        // case 'networkQuality':
        //   this.signalQuality=data?.data;
        //   this.updateNetworkQuality();
        //   break
        default:
          break
      }
    })
  }

  updateNetworkQuality(){
    switch(this.signalQuality){
      case "GOOD":
        this.renderer.setStyle(this.networkIndicator.nativeElement,'backgroundColor', '#0E8147');
        break
      case "BAD":
        this.renderer.setStyle(this.networkIndicator.nativeElement,'backgroundColor', '#FA7D19');
        break;
      case "VERYBAD":
        this.renderer.setStyle(this.networkIndicator.nativeElement,'backgroundColor', '#F50031');
        break;
    }
  }

  async startScreenShare() {
    await this.mediaservice.startScreenShare();
  }

  async toggleScreenShare() {
    if (this.isScreenShare) {
      await this.stopScreenShare();
    } else {
      await this.startScreenShare();
    }

  }
  toggleMore() {
    this.changeControl.emit();
  }

  async stopScreenShare() {
    await this.mediaservice.stopScreenShare();

  }
  
  async toggleMic(){
    await this.mediaservice.toggleMicStatus()
    this.isLocalMicOn = !this.isLocalMicOn;
  }

  async toggleVideoCam() {
    // console.log("working");
    await this.mediaservice.toggleVideoStatus();
    this.isLocalVideoOn = !this.isLocalVideoOn;
  }

  async toggleVideo() {
    await this.mediaservice.toggleVideoStatusBoth();
    this.isLocalVideoOn = !this.isLocalVideoOn;
    //this.mediaservice.toggleLocalVideoStatus();
    console.log("Triggered video from call control")
  }
  
  async toggleAudio() {
    this.mediaservice.toggleMicStatus();
    this.isLocalMicOn = !this.isLocalMicOn;
  }

  async leave() {
    await this.mediaservice.leaveMeeting();
  }

  async toggleRemotepeerMic(){
    await this.mediaservice.toggleRemotepeerAudio();
  }

  togglePanOverlay(){
    this.enablePanOverlay = !this.enablePanOverlay;
    console.log('pan toggled')
  }

  toggleFaceOverlay(){
    this.enableFaceOverlay = !this.enableFaceOverlay;
    console.log('facetoggled')
  }
  
  async setBgBlur(){
    await this.mediaservice.
    backgroundBlur()
    .then(()=>{
      this.isBackgroundBlur = !this.isBackgroundBlur;
      console.log('Background blur toggled')
    })
    .catch(()=>{});
  }

  // async setBgBlur(){
  //   if(this.isBackgroundBlur){
  //   await this.preview.setBackgroundBlurring('5');
  //   this.isBackgroundBlur = !this.isBackgroundBlur;
  //   } else if (!this.isBackgroundBlur){
  //     await this.jmClient.setBackgroundBlurring('0');
  //   }
  // }

  toggleChat(){
    this.mediaservice.loadChatBox();
    this.isChatActive = !this.isChatActive
    this.mediaservice.getChatOpened().next(this.isChatActive);
  }
}
