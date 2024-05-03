import { Component, Input } from '@angular/core';
import { IJMChatPayloadConfig, IJMSendChatMessageAttachment, JMClient } from '@jiomeet/core-sdk-web';
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
  chatInputDate: string=''

  // rpname :any[] =[]
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
  let chatPayload : IJMChatPayloadConfig ={
    isGroupChat: true,
    members: [''],
    context:'' ,
    admins: ['']
  }
  this.jmClient.loadChat(chatPayload)

  this.mediaservice.remotePeerObservable.subscribe((peerid)=>{
    console.log("Peerid in chat component", peerid.peerId);
    this.participantsInCall.push(peerid.name)
  

  this.mediaservice.getChatReceieved().subscribe( (text)=>{
    console.log('text from chat panel: '+ text.text)
    console.log('sent from peer id: '+ text.senderpeerid)
    this.chatInputDate = this.formatDateTime(text.time)
    console.log( "Text sent on: ", this.chatInputDate)

      if(text.senderpeerid == peerid.peerId){
        this.textAnyoneSends.push({key: 'peer', value :text.text, timeSentOn: this.chatInputDate });
      }

      if(text.senderpeerid != peerid.peerId){
        const inputValue = (document.querySelector('input') as HTMLInputElement).value;
        this.textAnyoneSends.push({key: 'me', value :inputValue, timeSentOn: this.chatInputDate });
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

    if(inputValue == '' || inputValue.trim() === '' ){
      console.log('Cannot send empty message')
    }else{
      try{
        await this.jmClient.sendChatMessage(inputValue, true, attachments)
        .then(()=>{
          (document.querySelector('input') as HTMLInputElement).value = ''
          console.log('Message Sent')
          // this.textAnyoneSends.push({key: 'me', value :inputValue})
        })
      }
      catch{
        console.log('Failed to send message')
      }
    }
    
  }

  formatDateTime(inputDate: string): string {
    const date = new Date(inputDate);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
    const formattedDate = `${dayOfWeek}, ${formattedTime}`;
    return formattedDate;
  }


}
