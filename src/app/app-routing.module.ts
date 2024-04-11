import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainVideoCallComponent } from './components/main-video-call/main-video-call.component';
import { PreviewscreenComponent } from './components/previewscreen/previewscreen.component';

const routes: Routes = [

  { path:'',redirectTo:'preview',pathMatch:'full' },
  { path:'main-video', component:MainVideoCallComponent },
  { path:'preview', component: PreviewscreenComponent},
  { path:'**',component: PreviewscreenComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
