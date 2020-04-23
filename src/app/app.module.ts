import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule} from '@angular/material/icon';
import { MatCardModule} from '@angular/material/card';
import { MatButtonModule, MatChipsModule, MatExpansionModule,MatDialogModule, MatNativeDateModule} from '@angular/material';
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
import { MainDashoardComponent } from './main-dashoard/main-dashoard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';

/* routing */
import { AppRoutingModule } from './app-routing.module';
/* Services */
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { UserService } from './services/user.service';
import { EnginService } from './services/engin.service';
import { CategorieService } from './services/categorie.service';
import { FournisseurService } from './services/fournisseur.service'

/* Components */
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
	FournisseurListComponent,
	FournisseurAddComponent,
	FournisseurFormComponent
  ],
  entryComponents: [
	BottomSheetOverviewExampleSheet,
	EnginAddComponent,
	EnginFormComponent,
	CategorieAddComponent,
	CategorieFormComponent,
	FournisseurAddComponent,
	FournisseurFormComponent
  ],
  imports: [
    BrowserModule,	
    AppRoutingModule,	
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
	AngularFireModule.initializeApp(environment.firebase),
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
	AngularFirestore,
	AngularFireDatabase],
  bootstrap: [AppComponent]
})
export class AppModule { }
