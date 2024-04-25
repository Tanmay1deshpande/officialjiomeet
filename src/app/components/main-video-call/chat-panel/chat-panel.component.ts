import { Component, Input } from '@angular/core';
import { IJMSendChatMessageAttachment, JMClient } from '@jiomeet/core-sdk-web';
import { Subscription } from 'rxjs';
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
  // messages: string[] = [];
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
    

  
  }

  async sendChatMsg(){
    const inputValue = (document.querySelector('input') as HTMLInputElement).value;
    console.log(inputValue);
    let attachments = [{
      fileID: '',
      fileSize: '',
      fileName: '',
      documentUrl: ''
    }] as IJMSendChatMessageAttachment[]
    // console.log(attachments);
    try{
      await this.jmClient.sendChatMessage(inputValue, true, attachments)
      .then(()=>{
        (document.querySelector('input') as HTMLInputElement).value = ''
        console.log('Message Sent')
        this.textiSend.push(inputValue)
      })
    }
    catch{
      console.log('Failed to send message')
    }
  }
  
  getChatMessages(){
    let msges = this.jmClient.chatMessages
    console.log('deezz msges: ' + msges)
  }


}
