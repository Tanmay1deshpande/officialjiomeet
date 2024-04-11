import { Component } from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {merge} from 'rxjs';

@Component({
  selector: 'app-previewscreen',
  templateUrl: './previewscreen.component.html',
  styleUrls: ['./previewscreen.component.css']
})
export class PreviewscreenComponent {

  errorMessage = '';
  meetingcreds!: FormGroup;
  form: any;

  constructor(
    private formbuilder: FormBuilder
  ){}

  ngOnInit(){
    this.meetingcreds = this.formbuilder.group({
      meetingId: new FormControl('',[Validators.required]),
      meetingPin: new FormControl('',[Validators.required]),
      displayName: new FormControl('',[Validators.required])
  });
  }

}
