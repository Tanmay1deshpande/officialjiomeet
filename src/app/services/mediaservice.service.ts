import { Injectable } from '@angular/core';
import { EventManager, JMClient, IJMRemotePeer, IJMLocalPeer, IFacingMode, IJMVideoSettings, IJMChatPayloadConfig, IJMSendChatMessageAttachment, IJMMessage } from '@jiomeet/core-sdk-web';
import { IJM_EVENTS } from '../constants';
import { BehaviorSubject, Observable, Subject, config } from 'rxjs';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { RemotePeer } from '@jiomeet/core-sdk-web/src/room-store/peer/remote-peer';
import { IJMMessageInput, IJMChatMessages, IJMGetChatMessages,IJMMessageComp, IJMGetPrivateChatThread } from '@jiomeet/core-sdk-web/src/network/network-request.interface';
@Injectable({

  providedIn: 'root',

})

export class MediaserviceService {

  audioIsMute = true;
  cameraFlipped = true;
  isRecordingOn: boolean = false
  isChatOn:boolean = false
  type: 'image' | 'none' | 'blur';
  videoIsMute = true;
  jmClient = new JMClient();
  selectedSpeaker!: string;
  selectedMic: string | undefined;
  preview: any;
  currentDominantSpeaker: any;
  isBgBlur: boolean = true;
  testing:any;
  rpname:any[] =[]

  private participantsStatus$: BehaviorSubject<any> = new BehaviorSubject(null);
  private participantsUpdated$: Subject<any> = new Subject();
  private localParticipant$: Subject<any> = new Subject();
  private chatReceived$: Subject<any> = new Subject();
  //private remotePeerName$: Subject<any> = new Subject();
  private remotePeerName$ = new BehaviorSubject<any>('');
  public remotePeerObservable = this.remotePeerName$.asObservable();

  constructor(private router: Router) {
    this.type = 'none';
    this.jmClient.setLogLevel(3);
  }

  addJMEventListeners() {

    EventManager.onEvent(async (eventInfo: any) => {
      console.log("Event from jiomeet", eventInfo);
      // console.log(this.getLocalUser());



      const { data } = eventInfo;
      // console.log(data);

      switch (eventInfo.type) {

        case (IJM_EVENTS.PEER_JOINED):
         
          const { remotePeers} = data;
          remotePeers.forEach((remotePeer: IJMRemotePeer) => {
            this.participantsUpdated$.next({
              user: remotePeer,
              state: 'joined',
            });
            this.remotePeerName$.next(remotePeer)
            console.log(remotePeer.name + " joined!");
            // this.remotePeerName$.next(remotePeer.name);
          });
          // console.log(eventInfo.data.remotePeers[0].name + " joined!");
          // localPeers.forEach((localPeer: IJMLocalPeer)=>{
          //   this.participantsUpdated$.next({
          //     user: localPeer,
          //     state: 'joined'
          //   })
          //   console.log("yayy");
          // })
          break;

        case IJM_EVENTS.PEER_UPDATED:
          const { remotePeer, updateInfo } = data;
          const { action, value } = updateInfo;
          if (action === 'AUDIO_MUTE') {
            if (value) {
              if (this.currentDominantSpeaker == remotePeer.peerId) {
                this.participantsUpdated$.next({
                  user: null,
                  state: 'dominantSpeaker',
                });
              }

            } else {
              const audioTrack = await this.jmClient.subscribeMedia(
                remotePeer,
                'audio'
              );
              audioTrack.play();
            }
          } else if (action === 'VIDEO_MUTE') {
            if (value === false) {
              const videoTrack = await this.jmClient.subscribeMedia(remotePeer, 'video');
              videoTrack.play(remotePeer.peerId);
              console.log("Remote player turned on video")
            }
          } else if (action === 'SCREEN_SHARE') {
            if (value) {
              this.participantsUpdated$.next({
                user: remotePeer,
                state: 'screenshareStart',
              });

            } else {
              this.participantsUpdated$.next({
                user: remotePeer,
                state: 'screenshareStop',
              });
            }
          }
          break;

        case IJM_EVENTS.PEER_LEFT:
          this.participantsUpdated$.next({
            user: data.remotePeer,
            state: 'left',
          });
          console.log(" left!");

          if(this.getLocalUser()){
            alert("Looks like customer left!");
            setTimeout(() => {
              this.router.navigate(['']);
              this.leaveMeeting()
            }, 5000);
          }else{
            alert("Looks like agent left!");
            setTimeout(() => {
              this.router.navigate(['']);
              this.leaveMeeting()
            }, 10000);
          }

          // const port = window.location.port;
          // console.log(port);


          break;

        case IJM_EVENTS.DEVICE_UPDATED:
          if (data.state == 'ACTIVE' && data.deviceType == 'audioOutput') {
            this.selectedSpeaker = data.device.deviceId;
            this.jmClient.setAudioOutputDevice(data.device.deviceId);
            console.log()
          }
          if (
            data.state == 'ACTIVE' &&
            data.deviceType == 'audioInput' &&
            !this.audioIsMute
          ) {

            this.selectedMic = data.device.deviceId;
            this.jmClient.setAudioInputDevice(data.device.deviceId);
          }

          if (

            data.state == 'INACTIVE' &&
            data.deviceType == 'audioInput' &&
            this.selectedMic == data.device.deviceId
          ) {

            this.jmClient.setAudioInputDevice('default');
          }

          if (
            data.state == 'INACTIVE' &&
            data.deviceType == 'audioOutput' &&
            this.selectedSpeaker == data.device.deviceId
          ) {
            this.jmClient.setAudioOutputDevice('default');
          }

          break;

        case IJM_EVENTS.DOMINANT_SPEAKER:
          this.currentDominantSpeaker = data.remotePeer.peerId;
          this.participantsUpdated$.next({
            user: data.remotePeer,
            state: 'dominantSpeaker',
          });

          break;

        case IJM_EVENTS.NETWORK_QUALITY:
          const quality = this.mapQualityLevel(
            data?.uplinkNetworkQuality,
            data?.downlinkNetworkQuality
          );

          this.localParticipant$.next({
            data: quality,
            action: 'networkQuality',

          });


          break;

          case (IJM_EVENTS.CHAT_MESSAGE):
            const { messages } = data;
            
            if(messages.length != 0) {
              const zero = messages[0];
              console.log("Text from peer: ", zero.message.text);

              this.chatReceived$.next({
                  text: zero.message.text,
                  senderpeerid: zero.senderPeerId
              })
              
            } else {
              console.log("No messages found");
            }

            let messagecomp: IJMMessageComp = {
              text: 'YY',
              isGroupChat: true,
              attachments: []
            }
  
            let messageMain : IJMMessage={
              id: '',
              senderName: '',
              time: new Date,
              read: false,
              isGroupChat: true,
              type: 'TEXT',
              message: messagecomp
            } 
  
            break
        default:
          break;
      }
    });
  }
  
  getLocalUser() {
    return this.jmClient.room.localPeer;
  }

  async createPreview() {
    await this.jmClient.createPreview('1');
    this.preview = await this.jmClient.getPreview('1');
  }

  getLocalParticipant() {
    return this.localParticipant$;
  }

  async leaveMeeting() {
    await this.jmClient.leaveMeeting();
    this.participantsUpdated$.next({ user: [], state: 'localLeft' });
    this.router.navigate(['/preview']);
  }

  async startScreenShare() {
    try {
      await this.jmClient
        .startScreenShare()
        .then(() => {
          this.localParticipant$.next({
            localpeer: this.getLocalUser(),
            action: 'startShare',
          });
        })

        .catch(() => { });

    } catch (error) {
      console.log('Failed to start screen share', error);
    }
  }

  async stopScreenShare() {
    try {
      await this.jmClient.stopScreenShare().then(() => {
        this.localParticipant$.next({
          localpeer: this.getLocalUser(),
          action: 'stopShare',
        });
      });

    } catch (error) {
      console.log('Failed to stop screen share', error);
    }
  }

  getParticipantsUpdated() {
    return this.participantsUpdated$;
  }

  mapQualityLevel(uplink: number, downlink: number) {
    const maxQuality = Math.max(uplink, downlink);
    switch (maxQuality) {
      case 0:
        return 'NONE';
      case 1:
      case 2:
        return 'GOOD';
      case 3:
      case 4:
        return 'BAD';
      case 5:
        return 'VERYBAD';
      default:
        return 'NONE';

    }
  }

  async toggleVideoStatus() {
    try {
      this.videoIsMute = !this.videoIsMute;
      await this.jmClient
        .muteLocalVideo(this.videoIsMute)
        .then(() => {
          this.localParticipant$.next({
            localpeer: this.getLocalUser(),
            action: this.videoIsMute ? 'videoOff' : 'videoOn',
          });
        })

        .catch((e) => {
          console.log('Error toggle Video', e);
          this.videoIsMute = !this.videoIsMute;
        });

      if (!this.videoIsMute) {
        this.localParticipant$.next({
          localpeer: this.getLocalUser(),
          action: 'videoOn',
        });
      }

    } catch {
      console.log('error while video switching');
    }
  }

  async toggleLocalVideoStatus() {
    try {
      this.videoIsMute = !this.videoIsMute;
      await this.preview
        .muteLocalVideo(this.videoIsMute)
        .then(async () => {
          if (
            !this.videoIsMute &&
            this.preview.previewInstance.localUser.videoTrack
          ) {
            this.preview.previewInstance.localUser.videoTrack.play('localpeer', {mirror:false});
          }
        })

        .catch(() => {
          this.videoIsMute = !this.videoIsMute;
        });

    } catch {
      console.log('error while video switching');
    }
  }

  async toggleVideoStatusBoth() {
    try {
      this.videoIsMute = !this.videoIsMute;
      await this.preview.muteLocalVideo(this.videoIsMute)
      await this.jmClient.muteLocalVideo(this.videoIsMute)
        .then(async () => {
          if (
            !this.videoIsMute &&
            this.preview.previewInstance.localUser.videoTrack
          ) {
            this.preview.previewInstance.localUser.videoTrack.play('localpeer', {mirror:false});
            console.log('local video toggled')
          }
        })

        // .catch((e) => {
        //   console.log('Error toggle Video', e);
        //   this.videoIsMute = !this.videoIsMute;
        // });

      if (!this.videoIsMute) {
        this.localParticipant$.next({
          localpeer: this.getLocalUser(),
          action: 'videoOn',
        });
      }

    } catch {
      console.log('error while video switching');
    }
  }

  async toggleLocalMicStatus() {
    try {
      this.audioIsMute = !this.audioIsMute;
      await this.preview
        .muteLocalAudio(this.audioIsMute)
        .catch((error: any) => {
          console.log('Error while toggling local microphone:', error);
          this.audioIsMute = !this.audioIsMute;
        });

    } catch(error) {
      console.log('error while mic switching',error);
      this.audioIsMute = !this.audioIsMute;
    }
  }

  toggleMicStatus() {
    try {
      this.audioIsMute = this.getLocalUser()!.audioMuted;
      this.jmClient
        .muteLocalAudio(!this.audioIsMute)
        .then(() => {
          this.audioIsMute = !this.audioIsMute;
          this.localParticipant$.next({
            localpeer: this.getLocalUser(),
            action: this.audioIsMute ? 'audioOff' : 'audioOn',
          });
        })

        .catch((e) => {
          console.log(e);
        });

    } catch {
      console.log('error Muting Mic');
    }

  }

  // async toggleFlipCamera() {
  //   try {
  //     this.cameraFlipped = !this.cameraFlipped;
  //     let videoSettings : IJMVideoSettings = {
  //       facingMode: IFacingMode.USER
  //     }
        
  //     await this.jmClient
  //       .setVideoDevice(videoSettings)
  //       .catch((error: any) => {
  //         console.log('Error while toggling flip camera:', error);
  //         this.cameraFlipped = !this.cameraFlipped;
  //       });

  //   } catch(error) {
  //     console.log('error while switching camera',error);
  //     this.cameraFlipped = !this.cameraFlipped;
  //   }
  // }

  async flipcam(){
    if(this.cameraFlipped){
      let videoSettings : IJMVideoSettings = {
        facingMode: IFacingMode.ENVIRONMENT
      }
      await this.jmClient
        .setVideoDevice(videoSettings)
        .then(()=>{
          console.log('Camera Flipped');
          console.log("Facing Environment", navigator.mediaDevices.getUserMedia())
          this.cameraFlipped = !this.cameraFlipped;
        })
        .catch((error: any) => {
          console.log('Error while toggling flip camera:', error);
          this.cameraFlipped = !this.cameraFlipped;
        });
        
    }if(!this.cameraFlipped){
      let videoSettings : IJMVideoSettings = {
        facingMode: IFacingMode.USER
      }
      await this.jmClient
        .setVideoDevice(videoSettings)
        .then(()=>{
          console.log('Camera Flipped');
          console.log("Facing User", navigator.mediaDevices.getUserMedia())
          this.cameraFlipped = !this.cameraFlipped;
        })
        .catch((error: any) => {
          console.log('Error while toggling flip camera:', error);
          this.cameraFlipped = !this.cameraFlipped;
        });
    }
  }



  async joinCall(
    meetingId: string,
    pin: string,
    userName: string,
    mediaconf: any
  ) {
    
    await this.jmClient
      .joinMeeting({
        meetingId: meetingId,
        meetingPin: pin,
        userDisplayName: userName,
        config: {
          //for userrole speaker remove token. Token only necessary for userrole host.
          userRole: 'speaker',
          //token:'1'
        },
      })

      .then(async () => {
        this.router.navigate(['/main-video']);
        setTimeout(async () => {
          this.addJMEventListeners();

          
          let sourceType: 'image' | 'none' | 'blur' = 'none';
          let localUserConfig = {
            trackSettings: {
              audioMuted: mediaconf.isMicMuted,
              videoMuted: mediaconf.VideoMuted,
              audioInputDeviceId: '',
              audioOutputDeviceId: '',
              videoDeviceId: '',
            },

            virtualBackgroundSettings: {
              isVirtualBackground: false,
              sourceType,
              sourceValue: '',
            },

          };

          await this.jmClient.publish(localUserConfig).then(() => {

            // console.log(this.getLocalUser());
              // this.participantsUpdated$.next({
              //   user: this.getLocalUser(), // Assuming this returns the local user information
              //   state: 'joined',
              // });
              // console.log("user joined", this.getLocalUser);

            if (!this.preview.previewInstance.localUserSettings?.videoMuted) {

              this.localParticipant$.next({
                localpeer: this.getLocalUser(),
                action: this.videoIsMute ? 'videoOff' : 'videoOn',
              });
            }

            if (!this.preview.previewInstance.localUserSettings.audioMuted) {
              this.localParticipant$.next({
                localpeer: this.getLocalUser(),
                action: this.audioIsMute ? 'audioOff' : 'audioOn',
              });
            }
          });

        }, 500);
        // console.log("You, "+ userName + " joined!");
      })

      .catch(() => {
        console.log('errpr While Joining',meetingId,pin,userName);
        alert('Error while joining meeting')
      });
  }

  async toggleRemotepeerAudio(){
    await this.jmClient.softMutePeersAudio();
  }

  // async backgroundBlur1(){
  //   await this.jmClient.setBackgroundBlurring('5');
  // }

  async backgroundBlur() {
    if(this.isBgBlur){
    try {
      await this.preview
        .setBackgroundBlurring('5')
        .then(() => {
          this.localParticipant$.next({
            localpeer: this.getLocalUser(),
            sourceType: 'blur',
          });
          this.isBgBlur = !this.isBgBlur
        })

        .catch(() => { });

    } catch (error) {
      console.log('Failed to set background as blur', error);
    } 
    }else if(!this.isBgBlur){
      try {
        await this.preview
          .setBackgroundBlurring('0')
          .then(() => {
            this.localParticipant$.next({
              localpeer: this.getLocalUser(),
              sourceType: 'none',
            });
            this.isBgBlur = !this.isBgBlur
          })
  
          .catch(() => { });
  
      } catch (error) {
        console.log('Failed to remove blur background', error);
      } 
    }
  }

  toggleRecording() {
    try {
      if(this.isRecordingOn){ 
      this.jmClient.startRecording().then(()=>{
        console.log('Recording started')
        this.isRecordingOn=!this.isRecordingOn
      })

      .catch(()=>{
        console.log("Error starting recording")
        this.isRecordingOn=!this.isRecordingOn
      })
      }else{
        this.jmClient.stopRecording().then(()=>{
          console.log('Recording Stopped')
          this.isRecordingOn=!this.isRecordingOn
        })
        .catch(()=>{
          console.log("Error stopping recording")
          this.isRecordingOn=!this.isRecordingOn
        })
      }


    } catch {
      console.log('error toggling recording');
    }

  }

  messageSend(){
    //message: IJMMessageInput
  }

  loadChatBox(){
    try{
        let chatPayload : IJMChatPayloadConfig ={
          isGroupChat: true,
          members: [''],
          context:'' ,
          admins: ['']
        }
        this.jmClient.loadChat(chatPayload).then(()=>{
          console.log('Chat box loaded.')
        })
        .catch(()=>{
          console.log('error with loadChat method')
        })
      
    }
    catch{
      console.log('Error while loading Chat')
    }
    
  }

  getChatevent(){
    let attachments: IJMSendChatMessageAttachment[]=[{
      fileID: '',
      fileSize: '',
      fileName: '',
      documentUrl: ''
    }]

    let messagecomp: IJMMessageComp = {
      text: '',
      isGroupChat: true,
      attachments: attachments
    }

    let messageMain : IJMMessage={
      id: '',
      senderName: '',
      time: new Date,
      read: false,
      isGroupChat: true,
      type: 'TEXT',
      message: messagecomp
    }

    let chatmessageinterface : IJMChatMessages={
      messages: {
        '0':  messageMain 
      },
      privateMessages: {
        '1':  messageMain 
      }
    }

    console.log('The messagecomp text is: ' + messagecomp.text + messageMain.time)
  }

  getChatReceieved(){
    return this.chatReceived$
  }

  getRemotePeerName(){
    return this.remotePeerName$
  }


}
