import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { UserListComponent } from './user-list/user-list.component';
import { NewUserComponent } from './new-user/new-user.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';	
import { AuthComponent } from './auth/auth.component';
import {MainDashoardComponent} from './main-dashoard/main-dashoard.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { EnginListComponent } from './engin-list/engin-list.component';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { FournisseurListComponent } from './fournisseur-list/fournisseur-list.component';
import { ChantierListComponent } from './chantier-list/chantier-list.component';


const routes: Routes = [
  { path: 'sidenav', canActivate: [AuthGuardService], component: MainNavComponent,
      children: [
        {
          path: '',      
          pathMatch: 'full', redirectTo: 'home'
        },
        { path: 'home', component: MainDashoardComponent },
        { path: 'engin', canActivate: [AuthGuardService], component: EnginListComponent },        
        { path: 'users', component: UserListComponent },
        { path: 'users/new', component: NewUserComponent },
        { path: 'categorie', canActivate: [AuthGuardService], component: CategorieListComponent },
        { path: 'fournisseur', canActivate: [AuthGuardService], component: FournisseurListComponent },
        { path: 'chantier', canActivate: [AuthGuardService], component: ChantierListComponent },
        { path: 'user', canActivate: [AuthGuardService], component: UserListComponent },
        { path: 'signUp',canActivate:[AuthGuardService],component:SignupComponent}

        ]},
  { path: 'auth', component: AuthComponent },
  { path: '', canActivate: [AuthGuardService], pathMatch: 'full', redirectTo: 'sidenav'},
  { path: 'new-uses', component: NewUserComponent },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  
exports: [RouterModule]
})
export class AppRoutingModule { }
