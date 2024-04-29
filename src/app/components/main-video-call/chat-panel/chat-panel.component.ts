import { Component, Input } from '@angular/core';
import { IJMSendChatMessageAttachment, JMClient } from '@jiomeet/core-sdk-web';
import { Subscription, combineLatest } from 'rxjs';
import { MediaserviceService } from 'src/app/services/mediaservice.service';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent {

  jmClient = new JMClient; 
  @Input() remotePeer!: any;
  participantsInCall: any[] = [];
  textiSend :String[] =[]
  textCustomerSends :String[] =[]
  textAnyoneSends :any[] =[]
  rpeerid :any[] =[]
  private subscription!: Subscription;

  constructor(
    private mediaservice: MediaserviceService
  ){ }

  ngOnInit(){
  //   this.participantsInCall = this.mediaservice.jmClient.remotePeers;
  //   this.mediaservice.getLocalParticipant().subscribe(async (data) => {
  //   if (data.action == 'joined' && this.mediaservice.jmClient.remotePeers.length<2) {
  //     this.participantsInCall.push(data.localpeer);
  //   }
  // });
  // this.subscription = this.mediaservice.getChatMessages().subscribe((messages: string[]) => {
  //   this.textCustomerSends = messages;
  // });

  // this.mediaservice.getParticipantsUpdated().subscribe(async (rpname)=>{
  //   this.rpeerid.push(rpname.user);
  //   console.log( 'rpeerid: ' + rpname)
  // })

  this.mediaservice.remotePeerObservable.subscribe((peerid)=>{
    console.log("Peerid in chat component", peerid.peerId);
  

  this.mediaservice.getChatReceieved().subscribe(async (text)=>{
    console.log('text from chat panel: '+ text.text)
    console.log('sent from peer id: '+ text.senderpeerid)

  
 


      if(text.senderpeerid == peerid.peerId){
        this.textAnyoneSends.push({key: 'peer', value :text.text });
      }
    })
  })

  }

  async sendChatMsg(){
    const inputValue = (document.querySelector('input') as HTMLInputElement).value;
    let attachments = [{
      fileID: '',
      fileSize: '',
      fileName: '',
      documentUrl: ''
    }] as IJMSendChatMessageAttachment[]


    try{
      await this.jmClient.sendChatMessage(inputValue, true, attachments)
      .then(()=>{
        (document.querySelector('input') as HTMLInputElement).value = ''
        console.log('Message Sent')
        this.textAnyoneSends.push({key: 'me', value :inputValue})
      })
    }
    catch{
      console.log('Failed to send message')
    }
  }


}
