import { Component, ViewChild, OnInit, ElementRef, NgModule, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, Renderer2} from '@angular/core';
import { EventManager, IJMRemotePeer, JMClient, IJMInfoEventTypes, IJMMediaSetting, IJMJoinMeetingParams, IJMLocalAudioTrack, IJMLocalPeer, IJMLocalScreenShareTrack, IJMLocalVideoTrack, IJMPreviewManager, IJMRemoteAudioTrack, IJMRemoteScreenShareTrack, IJMRemoteVideoTrack, IJMConnectionStateEvent, IJMRequestMediaType } from '@jiomeet/core-sdk-web';
import { async } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MediaserviceService } from '../../services/mediaservice.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-main-video-call',
  templateUrl: './main-video-call.component.html',
  styleUrls: ['./main-video-call.component.css']
})
export class MainVideoCallComponent {

  showloader!: boolean;
  loaderService: any;
  @ViewChild('network')
  networkIndicator!: ElementRef;
  @Output() changeControl = new EventEmitter();
  isLocalVideoOn = false;
  isScreenShare = false;
  micMuted = true;
  videoMuted = true;
  signalQuality='NONE'

  constructor(
    public mediaservice: MediaserviceService,
  ){}

	@ViewChild('videoElement') videoElement!:ElementRef;

	ngOnInit(){
    this.showloader = true;
    this.loaderService.showLoader();
		this.startCamera();
    this.showloader = true;
    this.loaderService.hideLoader();

    
    
	}

	async startCamera(){
		try{
			const stream=await navigator.mediaDevices.getUserMedia({video:true});
			this.videoElement.nativeElement.srcObject = stream;
		}catch(error){
			// console.error("Error", error);
		}	
	}
  

}
