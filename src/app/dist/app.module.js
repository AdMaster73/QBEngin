"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var animations_1 = require("@angular/platform-browser/animations");
var input_1 = require("@angular/material/input");
var form_field_1 = require("@angular/material/form-field");
var icon_1 = require("@angular/material/icon");
var card_1 = require("@angular/material/card");
var material_1 = require("@angular/material");
var tabs_1 = require("@angular/material/tabs");
var radio_1 = require("@angular/material/radio");
var checkbox_1 = require("@angular/material/checkbox");
var layout_1 = require("@angular/cdk/layout");
var toolbar_1 = require("@angular/material/toolbar");
var sidenav_1 = require("@angular/material/sidenav");
var list_1 = require("@angular/material/list");
var slide_toggle_1 = require("@angular/material/slide-toggle");
var ngx_avatar_1 = require("ngx-avatar");
var bottom_sheet_1 = require("@angular/material/bottom-sheet");
var menu_1 = require("@angular/material/menu");
var badge_1 = require("@angular/material/badge");
var grid_list_1 = require("@angular/material/grid-list");
var table_1 = require("@angular/material/table");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var angularfire2_1 = require("angularfire2");
var firestore_1 = require("angularfire2/firestore");
var auth_1 = require("angularfire2/auth");
var database_1 = require("angularfire2/database");
var autocomplete_1 = require("@angular/material/autocomplete");
var datepicker_1 = require("@angular/material/datepicker");
var tooltip_1 = require("@angular/material/tooltip");
var stepper_1 = require("@angular/material/stepper");
var drag_drop_1 = require("@angular/cdk/drag-drop");
/* routing */
var app_routing_module_1 = require("./app-routing.module");
/* Services */
var auth_service_1 = require("./services/auth.service");
var auth_guard_service_1 = require("./services/auth-guard.service");
var user_service_1 = require("./services/user.service");
var engin_service_1 = require("./services/engin.service");
var categorie_service_1 = require("./services/categorie.service");
var fournisseur_service_1 = require("./services/fournisseur.service");
var chantier_service_1 = require("./services/chantier.service");
/* Components */
var main_dashoard_component_1 = require("./main-dashoard/main-dashoard.component");
var app_component_1 = require("./app.component");
var auth_component_1 = require("./auth/auth.component");
var user_list_component_1 = require("./user-list/user-list.component");
var new_user_component_1 = require("./new-user/new-user.component");
var signup_component_1 = require("./auth/signup/signup.component");
var signin_component_1 = require("./auth/signin/signin.component");
var header_component_1 = require("./header/header.component");
var home_component_1 = require("./home/home.component");
var main_nav_component_1 = require("./main-nav/main-nav.component");
var engin_list_component_1 = require("./engin-list/engin-list.component");
var engin_form_component_1 = require("./engin-list/engin-form/engin-form.component");
var engin_add_component_1 = require("./engin-list/engin-add/engin-add.component");
var environment_1 = require("../environments/environment");
var list_nfrais_npayed_component_1 = require("./list-nfrais-npayed/list-nfrais-npayed.component");
var list_nfrais_payed_component_1 = require("./list-nfrais-payed/list-nfrais-payed.component");
var list_nfrais_table_component_1 = require("./list-nfrais-table/list-nfrais-table.component");
var categorie_list_component_1 = require("./categorie-list/categorie-list.component");
var categorie_add_component_1 = require("./categorie-list/categorie-add/categorie-add.component");
var categorie_form_component_1 = require("./categorie-list/categorie-form/categorie-form.component");
var fournisseur_list_component_1 = require("./fournisseur-list/fournisseur-list.component");
var fournisseur_add_component_1 = require("./fournisseur-list/fournisseur-add/fournisseur-add.component");
var fournisseur_form_component_1 = require("./fournisseur-list/fournisseur-form/fournisseur-form.component");
var chantier_list_component_1 = require("./chantier-list/chantier-list.component");
var chantier_add_component_1 = require("./chantier-list/chantier-add/chantier-add.component");
var chantier_form_component_1 = require("./chantier-list/chantier-form/chantier-form.component");
var user_add_component_1 = require("./user-list/user-add/user-add.component");
var user_form_component_1 = require("./user-list/user-form/user-form.component");
var pointage_list_component_1 = require("./pointage-list/pointage-list.component");
var userFormComponent_1 = require("./pointage-list/user-Form/userFormComponent");
var auth_guard_1 = require("@angular/fire/auth-guard");
var firebase = require("firebase");
var not_found_component_1 = require("./not-found/not-found-component");
var details_users_component_1 = require("./details-users/details-users.component");
var auth_token_interceptor_1 = require("./services/auth-token.interceptor");
var user_delete_component_1 = require("./user-list/user-delete/user-delete.component");
var chantier_delete_component_1 = require("./chantier-list/chantier-delete/chantier-delete.component");
var chantier_user_component_1 = require("./chantier-list/chantier-user/chantier-user.component");
var permissions_component_1 = require("./settings/permissions/permissions.component");
var settings_component_1 = require("./settings/settings.component");
var roles_component_1 = require("./settings/roles/roles.component");
var roles_add_component_1 = require("./settings/roles/roles-add/roles-add.component");
var roles_form_component_1 = require("./settings/roles/roles-form/roles-form.component");
var roles_delete_component_1 = require("./settings/roles/roles-delete/roles-delete.component");
var permissions_add_component_1 = require("./settings/permissions/permissions-add/permissions-add.component");
var permissions_form_component_1 = require("./settings/permissions/permissions-form/permissions-form.component");
var permissions_delete_component_1 = require("./settings/permissions/permissions-delete/permissions-delete.component");
var collections_component_1 = require("./settings/collections/collections.component");
var collections_add_component_1 = require("./settings/collections/collections-add/collections-add.component");
var collections_form_component_1 = require("./settings/collections/collections-form/collections-form.component");
var collections_delete_component_1 = require("./settings/collections/collections-delete/collections-delete.component");
var pointage_chantier_list_component_1 = require("./pointage-list/pointage-chantier-list/pointage-chantier-list.component");
var pointage_location_component_1 = require("./pointage-list/pointage-location/pointage-location.component");
var pointage_engin_component_1 = require("./pointage-list/pointage-engin/pointage-engin.component");
var transfert_component_1 = require("./transfert/transfert.component");
var encours_component_1 = require("./transfert/encours/encours.component");
var historique_component_1 = require("./transfert/historique/historique.component");
var encours_add_component_1 = require("./transfert/encours-add/encours-add.component");
var encours_form_component_1 = require("./transfert/encours-form/encours-form.component");
var encours_delete_component_1 = require("./transfert/encours-delete/encours-delete.component");
var engin_accessoire_component_1 = require("./engin-list/engin-accessoire/engin-accessoire.component");
firebase.initializeApp(environment_1.environment.firebase);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                auth_component_1.AuthComponent,
                user_list_component_1.UserListComponent,
                new_user_component_1.NewUserComponent,
                signup_component_1.SignupComponent,
                signin_component_1.SigninComponent,
                header_component_1.HeaderComponent,
                home_component_1.HomeComponent,
                main_nav_component_1.MainNavComponent,
                header_component_1.BottomSheetOverviewExampleSheet,
                main_dashoard_component_1.MainDashoardComponent,
                engin_list_component_1.EnginListComponent,
                engin_form_component_1.EnginFormComponent,
                engin_add_component_1.EnginAddComponent,
                list_nfrais_npayed_component_1.ListNfraisNpayedComponent,
                list_nfrais_payed_component_1.ListNfraisPayedComponent,
                list_nfrais_table_component_1.ListNfraisTableComponent,
                categorie_list_component_1.CategorieListComponent,
                categorie_add_component_1.CategorieAddComponent,
                categorie_form_component_1.CategorieFormComponent,
                fournisseur_list_component_1.FournisseurListComponent,
                fournisseur_add_component_1.FournisseurAddComponent,
                fournisseur_form_component_1.FournisseurFormComponent,
                chantier_list_component_1.ChantierListComponent,
                chantier_add_component_1.ChantierAddComponent,
                chantier_form_component_1.ChantierFormComponent,
                user_add_component_1.UserAddComponent,
                user_form_component_1.UserFormComponent,
                userFormComponent_1.UserFormComponentP,
                pointage_list_component_1.PointageListComponent,
                not_found_component_1.NotFoundComponent,
                details_users_component_1.DetailsUsersComponent,
                user_delete_component_1.UserDeleteComponent,
                chantier_delete_component_1.ChantierDeleteComponent,
                chantier_user_component_1.ChantierUserComponent,
                permissions_component_1.PermissionsComponent,
                settings_component_1.SettingsComponent,
                roles_component_1.RolesComponent,
                roles_add_component_1.RolesAddComponent,
                roles_form_component_1.RolesFormComponent,
                roles_delete_component_1.RolesDeleteComponent,
                permissions_add_component_1.PermissionsAddComponent,
                permissions_form_component_1.PermissionsFormComponent,
                permissions_delete_component_1.PermissionsDeleteComponent,
                collections_component_1.CollectionsComponent,
                collections_add_component_1.CollectionsAddComponent,
                collections_form_component_1.CollectionsFormComponent,
                collections_delete_component_1.CollectionsDeleteComponent,
                pointage_chantier_list_component_1.PointageChantierListComponent,
                pointage_location_component_1.PointageLocationComponent,
                pointage_engin_component_1.PointageEnginComponent,
                transfert_component_1.TransfertComponent,
                encours_component_1.EncoursComponent,
                historique_component_1.HistoriqueComponent,
                encours_add_component_1.EncoursAddComponent,
                encours_form_component_1.EncoursFormComponent,
                encours_delete_component_1.EncoursDeleteComponent,
                engin_accessoire_component_1.EnginAccessoireComponent
            ],
            entryComponents: [
                header_component_1.BottomSheetOverviewExampleSheet,
                engin_add_component_1.EnginAddComponent,
                engin_form_component_1.EnginFormComponent,
                categorie_add_component_1.CategorieAddComponent,
                categorie_form_component_1.CategorieFormComponent,
                fournisseur_add_component_1.FournisseurAddComponent,
                fournisseur_form_component_1.FournisseurFormComponent,
                chantier_add_component_1.ChantierAddComponent,
                chantier_form_component_1.ChantierFormComponent,
                user_add_component_1.UserAddComponent,
                user_form_component_1.UserFormComponent,
                userFormComponent_1.UserFormComponentP,
                user_delete_component_1.UserDeleteComponent,
                chantier_delete_component_1.ChantierDeleteComponent,
                chantier_user_component_1.ChantierUserComponent,
                engin_accessoire_component_1.EnginAccessoireComponent,
                roles_add_component_1.RolesAddComponent,
                roles_delete_component_1.RolesDeleteComponent,
                roles_form_component_1.RolesFormComponent,
                collections_add_component_1.CollectionsAddComponent,
                collections_form_component_1.CollectionsFormComponent,
                collections_delete_component_1.CollectionsDeleteComponent,
                permissions_add_component_1.PermissionsAddComponent,
                permissions_form_component_1.PermissionsFormComponent,
                permissions_delete_component_1.PermissionsDeleteComponent,
                encours_form_component_1.EncoursFormComponent,
                encours_delete_component_1.EncoursDeleteComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                icon_1.MatIconModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                http_1.HttpClientModule,
                animations_1.BrowserAnimationsModule,
                input_1.MatInputModule,
                form_field_1.MatFormFieldModule,
                icon_1.MatIconModule,
                card_1.MatCardModule,
                material_1.MatButtonModule,
                tabs_1.MatTabsModule,
                radio_1.MatRadioModule,
                checkbox_1.MatCheckboxModule,
                layout_1.LayoutModule,
                toolbar_1.MatToolbarModule,
                sidenav_1.MatSidenavModule,
                list_1.MatListModule,
                slide_toggle_1.MatSlideToggleModule,
                ngx_avatar_1.AvatarModule,
                bottom_sheet_1.MatBottomSheetModule,
                menu_1.MatMenuModule,
                badge_1.MatBadgeModule,
                grid_list_1.MatGridListModule,
                table_1.MatTableModule,
                paginator_1.MatPaginatorModule,
                sort_1.MatSortModule,
                material_1.MatChipsModule,
                material_1.MatExpansionModule,
                material_1.MatDialogModule,
                autocomplete_1.MatAutocompleteModule,
                datepicker_1.MatDatepickerModule,
                material_1.MatNativeDateModule,
                material_1.MatSelectModule,
                tooltip_1.MatTooltipModule,
                stepper_1.MatStepperModule,
                drag_drop_1.DragDropModule,
                angularfire2_1.AngularFireModule.initializeApp(environment_1.environment.firebase),
                firestore_1.AngularFirestoreModule.enablePersistence()
            ],
            providers: [
                auth_service_1.AuthService,
                auth_guard_service_1.AuthGuardService,
                user_service_1.UserService,
                auth_1.AngularFireAuth,
                engin_service_1.EnginService,
                categorie_service_1.CategorieService,
                fournisseur_service_1.FournisseurService,
                chantier_service_1.ChantierService,
                firestore_1.AngularFirestore,
                auth_guard_1.AngularFireAuthGuard,
                auth_token_interceptor_1.AuthTokenHttpInterceptorProvider,
                database_1.AngularFireDatabase
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
