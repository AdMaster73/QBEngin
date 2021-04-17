import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { UserListComponent } from './user-list/user-list.component';
import { NewUserComponent } from './new-user/new-user.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { MainDashoardComponent } from './main-dashoard/main-dashoard.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { EnginListComponent } from './engin-list/engin-list.component';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { FournisseurListComponent } from './fournisseur-list/fournisseur-list.component';
import { ChantierListComponent } from './chantier-list/chantier-list.component';
import { AuthAdminGuardGuard } from './services/auth-admin-guard.guard';
import { NotFoundComponent } from './not-found/not-found-component';
import { PointageListComponent } from './pointage-list/pointage-list.component';
import { SettingsComponent } from './settings/settings.component';
import { TransfertComponent } from './transfert/transfert.component';
import { EncoursAddComponent } from './transfert/encours-add/encours-add.component';
import { RegionListComponent } from './region-list/region-list.component';
import { PointageEnginComponent } from './pointage-list/pointage-engin/pointage-engin.component';
import { ChauffeurListComponent } from './chauffeur-list/chauffeur-list.component';
import { ChauffeurFonctionComponent } from './chauffeur-list/chauffeur-fonction/chauffeur-fonction.component';
import { ChantierDetailsComponent } from './chantier-details/chantier-details.component';
import { MouvementsComponent } from './mouvements/mouvements.component';
import { PersonnelListComponent } from './personnel-list/personnel-list.component';

const routes: Routes = [
  { path: 'sidenav', canActivate: [AuthGuardService], component: MainNavComponent,
      children: [
        {
          path: '',
          pathMatch: 'full', redirectTo: 'home'
        },
        { path: 'home',canActivate:[AuthGuardService], component: MainDashoardComponent },
        { path: 'engin', canActivate: [AuthGuardService], component: EnginListComponent },
        { path: 'user', component: UserListComponent,canActivate:[AuthAdminGuardGuard]},
        { path: 'user/new', component: NewUserComponent,canActivate:[AuthAdminGuardGuard] },
        { path: 'categorie', canActivate: [AuthGuardService], component: CategorieListComponent },
        { path: 'fournisseur', canActivate: [AuthGuardService], component: FournisseurListComponent },
        { path: 'chantier', canActivate: [AuthGuardService], component: ChantierListComponent },
        { path: 'signUp',canActivate:[AuthAdminGuardGuard],component:SignupComponent},
        { path: 'pointage',component:PointageListComponent,canActivate:[AuthGuardService]},
        { path: 'chauffeur',component:ChauffeurListComponent,canActivate:[AuthGuardService]},
        { path: 'pointage/engins',component:PointageEnginComponent,canActivate:[AuthGuardService]},
        { path: 'settings',component:SettingsComponent,canActivate:[AuthAdminGuardGuard]},
        { path: 'transfert',component:TransfertComponent,canActivate:[AuthGuardService]},
        { path: 'fonction',component:ChauffeurFonctionComponent,canActivate:[AuthAdminGuardGuard]},
        { path: 'transfert/add',component:EncoursAddComponent,canActivate:[AuthGuardService]},
        { path: 'region',component:RegionListComponent,canActivate:[AuthGuardService]},
        { path: 'charges',component:MouvementsComponent,canActivate:[AuthGuardService]},
        { path: 'personnel',component:PersonnelListComponent,canActivate:[AuthGuardService]},
        { path: 'site-details',component:ChantierDetailsComponent,canActivate:[AuthGuardService]},
        { path: '**', component: NotFoundComponent }

        ]},
  { path: '', canActivate: [AuthGuardService], pathMatch: 'full', redirectTo: 'sidenav'},
  { path: 'auth/signUp', component: SignupComponent,canActivate:[AuthAdminGuardGuard] },
  { path: 'auth/signin', component: SigninComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
