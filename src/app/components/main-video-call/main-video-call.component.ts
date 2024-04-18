import { Component, ViewChild, OnInit, ElementRef, NgModule, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, Renderer2} from '@angular/core';
import { EventManager, IJMRemotePeer, JMClient, IJMInfoEventTypes, IJMMediaSetting, IJMJoinMeetingParams, IJMLocalAudioTrack, IJMLocalPeer, IJMLocalScreenShareTrack, IJMLocalVideoTrack, IJMPreviewManager, IJMRemoteAudioTrack, IJMRemoteScreenShareTrack, IJMRemoteVideoTrack, IJMConnectionStateEvent, IJMRequestMediaType } from '@jiomeet/core-sdk-web';
import { async } from 'rxjs';
import { MediaserviceService } from '../../services/mediaservice.service';
import {CommonModule} from '@angular/common';
import { JMDeviceManager } from '@jiomeet/core-sdk-web';

@Component({
  selector: 'app-main-video-call',
  templateUrl: './main-video-call.component.html',
  styleUrls: ['./main-video-call.component.css']
})
export class MainVideoCallComponent {

  showloader!: boolean;
  loaderService: any;
  subs: any[] = [];
  localpeer: any;
  enablePanOverlay: boolean = false
  enableFaceOverlay: boolean = false
  participantsInCall:any[]=[];
	@ViewChild('videoElement') videoElement!:ElementRef;
  optionsController={
    more:false
  }

  // @ViewChild('network')
  // networkIndicator!: ElementRef;
  // @Output() changeControl = new EventEmitter();
  // isLocalVideoOn = false;
  // isScreenShare = false;
  // micMuted = true;
  // videoMuted = true;
  // signalQuality='NONE'

  constructor(
    public mediaservice: MediaserviceService,
  ){}


	ngOnInit(){
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

  async registerDevices() {
    await JMDeviceManager.getMediaPermissions(true, true);
  
    JMDeviceManager.getDevices();
  }

	// async startCamera(){
	// 	try{
	// 		const stream=await navigator.mediaDevices.getUserMedia({video:true});
	// 		this.videoElement.nativeElement.srcObject = stream;
	// 	}catch(error){
	// 		// console.error("Error", error);
	// 	}	
	// }

  
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
  
}
