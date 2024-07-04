import { Component, ViewChild } from '@angular/core';
import { MainVideoCallComponent } from '../main-video-call/main-video-call.component';

@Component({
  selector: 'app-testmain',
  templateUrl: './testmain.component.html',
  styleUrls: ['./testmain.component.css']
})

export class TestmainComponent {

  @ViewChild(MainVideoCallComponent) main!: MainVideoCallComponent;


  ngAfterViewInit(){
    // console.log("Bro: ",this.main.callGrandchild());
  }
}
