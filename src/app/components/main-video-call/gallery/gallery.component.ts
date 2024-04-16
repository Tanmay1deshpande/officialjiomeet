import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MediaserviceService } from 'src/app/services/mediaservice.service';



@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent  implements OnInit { 

  name = '';
  num = 0;
  participantsInCall: any[] = [];
  localpeer: any;
  isScreenSharing = false;
  screenSharingUser: any;
  dominantSpeaker: any;
  subs : any[] = [];
  constructor(private mediaservice: MediaserviceService, private router: Router) {}

  ngOnInit(): void {
    this.participantsInCall = this.mediaservice.jmClient.remotePeers;
    // this.mediaservice.jmClient.localPeer['isLocal'] = true;
    // this.participantsInCall.push(this.mediaservice.jmClient.localPeer);
    this.subs.push(
      this.mediaservice.getLocalParticipant().subscribe(async (data) => {
        if (data.action == 'joined' && !this.mediaservice.getLocalParticipant()) {
          this.participantsInCall.push(data.localpeer);
        }
        this.localpeer = data.localpeer;
        if (data.action == 'videoOn') {
          const videoTrack = this.localpeer.videoTrack;
          videoTrack.play(data.localpeer.peerId);
        }
      }),
      this.mediaservice.getParticipantsUpdated().subscribe(async (user) => {
        switch (user?.state) {
          case 'localLeft':
            this.participantsInCall = [];
            this.localpeer = {};
            this.router.navigate(['/preview']);
            break;

          case 'screenshareStart':
            this.screenSharingUser = user.user;
            const screenShareTrack =
              await this.mediaservice.jmClient.subscribeMedia(
                this.screenSharingUser,
                'screenShare'
              );
            screenShareTrack.play('screenShare', { mirror: false });
            this.isScreenSharing = true;
            break;

          case 'screenshareStop':
            this.screenSharingUser = {};
            this.isScreenSharing = false;
            break;

          case 'joined':
            if (!this.participantsInCall.includes(user.user)) {
              this.participantsInCall.push(user.user);
            }
            break;

          case 'left':
            this.participantsInCall = this.participantsInCall.filter(
              (u: any) => {
                return u.peerId != user.user.peerId;
              }
            );
            break;

          case 'dominantSpeaker':
            this.dominantSpeaker = user?.user;
            break;

          default:
            break;
        }
      })
    );
    
  }
  async subscribeToVideo(peer: any) {
    const videoTrack = await this.mediaservice.jmClient.subscribeMedia(
      peer,
      'video'
    );
    videoTrack.play(peer.peerId);
  }

  get getNumberOfTiles() {
    if (this.isScreenSharing && this.participantsInCall.length > 4) {
      return 4;
    }
    return this.participantsInCall.length;
  }

  // ngOnDestroy(): void {
  //   this.subs.forEach((sub) => sub.unsubscribe());
  // }
}
