import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './../services/auth-guard.service';
import { MainDashoardComponent } from '../main-dashoard/main-dashoard.component';


const routes: Routes = [{ path: 'dashboard', component: MainDashoardComponent,outlet:"dashboard"}];

@NgModule({
  imports: [RouterModule.forChild(routes)],  
exports: [RouterModule]
})
export class MainNavRoutingModule { }
