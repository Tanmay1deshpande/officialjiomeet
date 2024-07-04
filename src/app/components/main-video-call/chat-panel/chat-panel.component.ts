import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IJMChatPayloadConfig, IJMSendChatMessageAttachment, JMClient } from '@jiomeet/core-sdk-web';
import { Subscription, combineLatest } from 'rxjs';
import { MediaserviceService } from 'src/app/services/mediaservice.service';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent {

  
  @ViewChild('chatMessagePanel') chatMessagePanel!: ElementRef;

  @Input() remotePeer!: any;
  reversedObject!: { [key: string]: any };
  participantsInCall: any[] = [];
  textiSend :String[] =[]
  textCustomerSends :String[] =[]
  textAnyoneSends :any[] =[]
  loadChatTextBox :any[] =[]
  customChatBox :any[] =[]
  rpeerid :any[] =[]
  chatInputDate: string=''
  chatInputTime: string=''
  messageKey: string = ''
  bubbleName: string = ''
  chatMessageObject: any;

  // rpname :any[] =[]
  // messages: string[] = [];
  private subscription!: Subscription;

  constructor(
    private mediaservice: MediaserviceService,
  ){ }

  ngOnInit(){
  // let chatPayload : IJMChatPayloadConfig ={
  //   isGroupChat: true,
  //   members: [''],
  //   context:'' ,
  //   admins: ['']
  // }
  this.mediaservice.loadChatBox()
  this.chatMessagesMain();
  this.mediaservice.remotePeerObservable.subscribe((peerid)=>{
    console.log("Peer id", peerid);
    this.participantsInCall.push(peerid.name)
  

  this.mediaservice.getChatReceieved().subscribe( (text)=>{
    this.chatInputTime = this.formatDateTime(text.time)
    this.chatInputDate = this.formatDate(text.time)
    // console.log(typeof(text));

      if(text.senderpeerid == peerid.peerId){
          this.textAnyoneSends.push({key: 'peer', value :text.text, timeSentOn: this.chatInputTime, bubbleName: "Customer" });
          // console.log("remotePeer text, textanyone sends: ", this.textAnyoneSends)
      }else{
        const inputValue = (document.querySelector('input') as HTMLInputElement).value;
          this.textAnyoneSends.push({key: 'me', value :inputValue, timeSentOn: this.chatInputTime, bubbleName: "You" });
          // console.log( "Localpeer text: ", this.textAnyoneSends)
        }
    // })
    })
  })

  }

  chatMessagesMain(){
    this.mediaservice.sharedChatMessageObject.subscribe((chaChaCha) => {

      console.log("chatmessage method of jmclient after subscription: ",chaChaCha);
      this.chatMessageObject = chaChaCha;
      for (const messageId in this.chatMessageObject) {
        if (Object.prototype.hasOwnProperty.call(this.chatMessageObject, messageId)) {
            const message = this.chatMessageObject[messageId];
            const messageT = this.formatDateTimeCustom(message.time.toString())
            const messagePropertyId = message.id

            if(message.senderName == 'Tanmay1'){
              this.messageKey = 'peer'
              this.bubbleName = 'Customer'
            }else{
              this.messageKey = 'me'
              this.bubbleName = 'You'
            }

            const idAlreadyExists = this.customChatBox.find(item => item.id === messagePropertyId);
            
            if(!idAlreadyExists){
              this.customChatBox.push({id: messagePropertyId,value: message.message.text, timeSentOn: messageT, key: this.messageKey, bubbleName: this.bubbleName});
            }
            
            this.customChatBox.sort(function(x,y){
              return x.timeSentOn - y.timeSentOn;
            })
            console.log("text: ",message.message.text); 
            // console.log("time: ",messageT); 
            console.log("key: ",this.messageKey); 
            console.log("customChatBox: ",this.customChatBox);
        }
      }
  })
  // const oneChatMessage = chatMessageObject
  // console.log("firstt: ",chatMessageObject);
  }

  hasKey(obj: any, key: any): boolean {
    return obj.hasOwnProperty(key);
  }

  reverseObjectOrder(obj: any): any {
    const reversedObject: { [key: string]: any } = {};
    const keys = Object.keys(obj);
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];
      reversedObject[key] = obj[key];
    }
    return reversedObject;
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
        this.mediaservice.jmClient.sendChatMessage(inputValue, true, attachments)
        .then(()=>{
          (document.querySelector('input') as HTMLInputElement).value = ''
          // console.log('Message Sent')
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

  formatDateTimeCustom(timestamp: string): string{
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    console.log(formattedDateTime); // Output: 2024-07-04 12:00:00

    return formattedDateTime;
  }

  formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    return date.toDateString();
  }

  scrollToBottom():void {
    const container = this.chatMessagePanel.nativeElement as HTMLElement;
    container.scrollTop = container.scrollHeight;
  }
  


}
