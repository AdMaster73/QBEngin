import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { ChantierService } from '../services/chantier.service';
import { Chantier } from './../models/engin.model';
import { ChantierAddComponent } from './chantier-add/chantier-add.component';
import { ChantierFormComponent } from "./chantier-form/chantier-form.component";
import { AngularFirestore } from 'angularfire2/firestore';
import { ChantierDeleteComponent } from './chantier-delete/chantier-delete.component';
import { ChantierUserComponent } from './chantier-user/chantier-user.component';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { filter, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { CollectionsService } from '../services/collections.service';
import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-chantier-list',
  templateUrl: './chantier-list.component.html',
  styleUrls: ['./chantier-list.component.scss']
})
export class ChantierListComponent implements OnInit {

  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean
  collectionMenuToggel:boolean
  EnginData: any = [];
  user$: Observable<{}>;
  displayedColumns: string[] = ['action','numero', 'designation','compte','archive'];
  _filter_role_chantier: string[] = []
  is_in_array_chantier:boolean = false
  dataSource : MatTableDataSource<Chantier>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  constructor(
    public db : AngularFirestore,
    public authService: AuthService,
    private rolesService:RolesService,
    private collectionService: CollectionsService,
    private chantierService : ChantierService,
    public dialog: MatDialog,private firebaseAuth: AngularFireAuth) {
      (async () => {
        let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
        let collectionId :number
        this.collectionService.GetCollectionsByName('chantier').subscribe(collections=>{
          collections.map(collection=>{
            collectionId = collection.id
          })
        })
        this.rolesService.getRolesByNameAndType(roleCurrentUser).subscribe(roles=>{
          roles.forEach(item=>{
                this.collectionPermAdd = item.add.includes(collectionId.toString())
                this.collectionPermUpdate = item.update.includes(collectionId.toString())
                this.collectionPermDelete = item.delete.includes(collectionId.toString())
                !this.collectionPermUpdate && !this.collectionPermDelete ? this.collectionMenuToggel = false : this.collectionMenuToggel = true
          })
        })
        this.rolesService.getFilterRoleChantier().subscribe(roles=>{
          roles.forEach(role=>{
            if(role.name === roleCurrentUser){
              this.is_in_array_chantier = true
            }
          })
        })
    })();

    }
  ngOnInit(): void {
    this.chantierService.GetChantierList().subscribe(
      data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.itemsPerPageLabel = 'Affichage par page.';
        this.paginator._intl.firstPageLabel = 'Page Premier';
        this.paginator._intl.nextPageLabel = 'Page Suivant';
        this.paginator._intl.previousPageLabel = 'Page Précédante';
        this.paginator._intl.lastPageLabel = 'Dérnier Page';
      }
    )
    this.user$ = this.firebaseAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.authService.user$(user.uid))
    )

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }
  /** Ajouter nouveau Chantier */
  addChantier(): void{
    const dialogRef = this.dialog.open(ChantierAddComponent);
  }
  /**Modifier Chantier */
  editChantier(element){
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(ChantierFormComponent,{data:{
      id:element.id,
      name:element.name,
      compte:element.compte,
      archive:element.archive
    }}).afterClosed().subscribe(result => {
      if (result){
        this.chantierService.UpdateChantier(result)
      }
    });
  }
  /* Delete */
  deleteChantier(index:number){
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(ChantierDeleteComponent,{data:{
      id:index
    }}).afterClosed().subscribe(result => {
      if (result){
        const data = this.dataSource.data;
        data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
        this.dataSource.data = data;
        this.chantierService.DeleteChantier(result)
      }
    });
  }
  /** */
  editUser(chantier:Chantier){
    this.dialog.open(ChantierUserComponent,{data:chantier}).afterClosed().subscribe(_ =>{
    })
  }
}
