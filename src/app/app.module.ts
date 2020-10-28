import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule, MatIconRegistry} from '@angular/material/icon';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule,
	MatChipsModule,
	MatExpansionModule,
	MatDialogModule,
	MatNativeDateModule,
  MatSelectModule,
  MatProgressSpinnerModule
	} from '@angular/material';
import { MatTabsModule} from '@angular/material/tabs';
import { MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AvatarModule } from 'ngx-avatar';
import { MatBottomSheetModule} from '@angular/material/bottom-sheet';
import { MatMenuModule} from '@angular/material/menu';
import { MatBadgeModule} from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AgmCoreModule } from '@agm/core';

/* routing */
import { AppRoutingModule } from './app-routing.module';
/* Services */
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { UserService } from './services/user.service';
import { EnginService } from './services/engin.service';
import { CategorieService } from './services/categorie.service';
import { FournisseurService } from './services/fournisseur.service'
import { ChantierService} from './services/chantier.service'

/* Components */
import { MainDashoardComponent } from './main-dashoard/main-dashoard.component';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { UserListComponent } from './user-list/user-list.component';
import { NewUserComponent } from './new-user/new-user.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { HeaderComponent, BottomSheetOverviewExampleSheet } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { EnginListComponent } from './engin-list/engin-list.component';
import { EnginFormComponent } from './engin-list/engin-form/engin-form.component';
import { EnginAddComponent } from './engin-list/engin-add/engin-add.component';

import { environment } from '../environments/environment';
import { ListNfraisNpayedComponent } from './list-nfrais-npayed/list-nfrais-npayed.component';
import { ListNfraisPayedComponent } from './list-nfrais-payed/list-nfrais-payed.component';
import { ListNfraisTableComponent } from './list-nfrais-table/list-nfrais-table.component';
import { CategorieListComponent } from './categorie-list/categorie-list.component';
import { CategorieAddComponent } from './categorie-list/categorie-add/categorie-add.component';
import { CategorieFormComponent } from './categorie-list/categorie-form/categorie-form.component';
import { FournisseurListComponent } from './fournisseur-list/fournisseur-list.component';
import { FournisseurAddComponent } from './fournisseur-list/fournisseur-add/fournisseur-add.component';
import { FournisseurFormComponent } from './fournisseur-list/fournisseur-form/fournisseur-form.component';
import { ChantierListComponent } from './chantier-list/chantier-list.component';
import { ChantierAddComponent } from './chantier-list/chantier-add/chantier-add.component';
import { ChantierFormComponent } from './chantier-list/chantier-form/chantier-form.component';
import { UserAddComponent } from './user-list/user-add/user-add.component';
import { UserFormComponent } from './user-list/user-form/user-form.component';
import { PointageListComponent } from './pointage-list/pointage-list.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import * as firebase from 'firebase';
import { NotFoundComponent } from './not-found/not-found-component';
import { DetailsUsersComponent } from './details-users/details-users.component';
import { AuthTokenHttpInterceptorProvider } from './services/auth-token.interceptor';
import { UserDeleteComponent } from './user-list/user-delete/user-delete.component';
import { ChantierDeleteComponent } from './chantier-list/chantier-delete/chantier-delete.component';
import { ChantierUserComponent } from './chantier-list/chantier-user/chantier-user.component';
import { PermissionsComponent } from './settings/permissions/permissions.component';
import { SettingsComponent } from './settings/settings.component';
import { RolesComponent } from './settings/roles/roles.component';
import { RolesAddComponent } from './settings/roles/roles-add/roles-add.component';
import { RolesFormComponent } from './settings/roles/roles-form/roles-form.component';
import { RolesDeleteComponent } from './settings/roles/roles-delete/roles-delete.component';
import { PermissionsAddComponent } from './settings/permissions/permissions-add/permissions-add.component';
import { PermissionsFormComponent } from './settings/permissions/permissions-form/permissions-form.component';
import { PermissionsDeleteComponent } from './settings/permissions/permissions-delete/permissions-delete.component';
import { CollectionsComponent } from './settings/collections/collections.component';
import { CollectionsAddComponent } from './settings/collections/collections-add/collections-add.component';
import { CollectionsFormComponent } from './settings/collections/collections-form/collections-form.component';
import { CollectionsDeleteComponent } from './settings/collections/collections-delete/collections-delete.component';
import { PointageChantierListComponent } from './pointage-list/pointage-chantier-list/pointage-chantier-list.component';
import { PointageLocationComponent } from './pointage-list/pointage-location/pointage-location.component';
import { PointageEnginComponent } from './pointage-list/pointage-engin/pointage-engin.component';
import { TransfertComponent } from './transfert/transfert.component';
import { EncoursComponent } from './transfert/encours/encours.component';
import { HistoriqueComponent } from './transfert/historique/historique.component';
import { EncoursAddComponent } from './transfert/encours-add/encours-add.component';
import { EncoursFormComponent } from './transfert/encours-form/encours-form.component';
import { EncoursDeleteComponent } from './transfert/encours-delete/encours-delete.component';
import { EnginAccessoireComponent } from './engin-list/engin-accessoire/engin-accessoire.component';
import { RegionListComponent } from './region-list/region-list.component';
import { RegionAddComponent } from './region-list/region-add/region-add.component';
import { RegionFormComponent } from './region-list/region-form/region-form.component';
import { EnginPositionComponent } from './engin-list/engin-position/engin-position.component';
import { PointageAddComponent } from './pointage-list/pointage-add/pointage-add.component';
import { ChauffeurListComponent } from './chauffeur-list/chauffeur-list.component';
import { ChauffeurAddComponent } from './chauffeur-list/chauffeur-add/chauffeur-add.component';
import { ChauffeurFormComponent } from './chauffeur-list/chauffeur-form/chauffeur-form.component';
import { ChauffeurDeleteComponent } from './chauffeur-list/chauffeur-delete/chauffeur-delete.component';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
	UserListComponent,
	NewUserComponent,
	SignupComponent,
	SigninComponent,
	HeaderComponent,
	HomeComponent,
	MainNavComponent,
	BottomSheetOverviewExampleSheet,
	MainDashoardComponent,
	EnginListComponent,
	EnginFormComponent,
	EnginAddComponent,
	ListNfraisNpayedComponent,
	ListNfraisPayedComponent,
	ListNfraisTableComponent,
	CategorieListComponent,
	CategorieAddComponent,
  CategorieFormComponent,
  RegionAddComponent,
  RegionFormComponent,
	FournisseurListComponent,
	FournisseurAddComponent,
	FournisseurFormComponent,
	ChantierListComponent,
	ChantierAddComponent,
	ChantierFormComponent,
	UserAddComponent,
	UserFormComponent,
	PointageListComponent,
	NotFoundComponent,
	DetailsUsersComponent,
	UserDeleteComponent,
	ChantierDeleteComponent,
	ChantierUserComponent,
	PermissionsComponent,
	SettingsComponent,
	RolesComponent,
	RolesAddComponent,
	RolesFormComponent,
	RolesDeleteComponent,
	PermissionsAddComponent,
	PermissionsFormComponent,
	PermissionsDeleteComponent,
	CollectionsComponent,
	CollectionsAddComponent,
	CollectionsFormComponent,
	CollectionsDeleteComponent,
	PointageChantierListComponent,
	PointageLocationComponent,
	PointageEnginComponent,
	TransfertComponent,
	EncoursComponent,
	HistoriqueComponent,
	EncoursAddComponent,
	EncoursFormComponent,
	EncoursDeleteComponent,
	EnginAccessoireComponent,
	RegionListComponent,
	EnginPositionComponent,
	PointageAddComponent,
	ChauffeurListComponent,
	ChauffeurAddComponent,
	ChauffeurFormComponent,
	ChauffeurDeleteComponent
  ],
  entryComponents: [
	BottomSheetOverviewExampleSheet,
	EnginAddComponent,
	EnginFormComponent,
	CategorieAddComponent,
  CategorieFormComponent,
  RegionAddComponent,
  RegionFormComponent,
  EnginPositionComponent,
	FournisseurAddComponent,
	FournisseurFormComponent,
	ChantierAddComponent,
	ChantierFormComponent,
	UserAddComponent,
	UserFormComponent,
	UserDeleteComponent,
	ChantierDeleteComponent,
  ChantierUserComponent,
  EnginAccessoireComponent,
	RolesAddComponent,
	RolesDeleteComponent,
	RolesFormComponent,
	CollectionsAddComponent,
	CollectionsFormComponent,
	CollectionsDeleteComponent,
	PermissionsAddComponent,
	PermissionsFormComponent,
	PermissionsDeleteComponent,
	EncoursFormComponent,
  EncoursDeleteComponent,
  PointageAddComponent,
  ChauffeurAddComponent,
  ChauffeurFormComponent,
  ChauffeurDeleteComponent
  ],
  imports: [
    BrowserModule,
	AppRoutingModule,
	MatIconModule,
	FormsModule,
	ReactiveFormsModule,
	HttpClientModule,
	BrowserAnimationsModule,
	MatInputModule,
	MatFormFieldModule,
	MatIconModule,
	MatCardModule,
	MatButtonModule,
	MatTabsModule,
	MatRadioModule,
	MatCheckboxModule,
	LayoutModule,
	MatToolbarModule,
	MatSidenavModule,
	MatListModule,
	MatSlideToggleModule,
	AvatarModule,
	MatBottomSheetModule,
	MatMenuModule,
	MatBadgeModule,
	MatGridListModule,
	MatTableModule,
	MatPaginatorModule,
	MatSortModule,
	MatChipsModule,
	MatExpansionModule,
	MatDialogModule,
	MatAutocompleteModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatSelectModule,
	MatTooltipModule,
	MatStepperModule,
  DragDropModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  AgmCoreModule.forRoot({
    apiKey: 'AIzaSyAgAdva88NetRz6vyCzpfaltzNM11FaFtw'
  }),
	AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence()
  ],
  providers: [
	AuthService,
	AuthGuardService,
	UserService,
	AngularFireAuth,
	EnginService,
	CategorieService,
	FournisseurService,
	ChantierService,
	AngularFirestore,
	AngularFireAuthGuard,
	AuthTokenHttpInterceptorProvider,
	AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
