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
    private renderer:Renderer2 
  ){}

	@ViewChild('videoElement') videoElement!:ElementRef;

	ngOnInit(){
    this.showloader = true;
    this.loaderService.showLoader();
		this.startCamera();
    this.showloader = true;
    this.loaderService.hideLoader();

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
        case 'networkQuality':
          this.signalQuality=data?.data;
          this.updateNetworkQuality();
          break
        default:
          break
      }
    })
	}

	async startCamera(){
		try{
			const stream=await navigator.mediaDevices.getUserMedia({video:true});
			this.videoElement.nativeElement.srcObject = stream;
		}catch(error){
			// console.error("Error", error);
		}	
	}

  async toggleMic(){
    await this.mediaservice.toggleLocalMicStatus()
  }

  async toggleVideo() {
    await this.mediaservice.toggleVideoStatus();
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

  async leave() {
    await this.mediaservice.leaveMeeting();
  }

  async startScreenShare() {
    await this.mediaservice.startScreenShare();
  }


}
