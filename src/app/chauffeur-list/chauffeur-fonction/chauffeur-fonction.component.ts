import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { FonctionService } from '../../services/fonction.service';
import { Fonction } from './../../models/engin.model';
import { FonctionAddComponent } from './fonction-add/fonction-add.component';
import { FonctionFormComponent } from "./fonction-form/fonction-form.component";
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { CollectionsService } from '../../services/collections.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-chauffeur-fonction',
  templateUrl: './chauffeur-fonction.component.html',
  styleUrls: ['./chauffeur-fonction.component.scss']
})
export class ChauffeurFonctionComponent implements OnInit {

  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean
  collectionMenuToggel:boolean
  constructor(
    public db : AngularFirestore,
    private rolesService:RolesService,
    private collectionService: CollectionsService,
    private fonctionService : FonctionService,
    public dialog: MatDialog) {
      (async () => {
        let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
        let collectionId :number
        this.collectionService.GetCollectionsByName('fonction').subscribe(collections=>{
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
    })();
    }
  displayedColumns: string[] = ['action','numero', 'designation'];
  dataSource : MatTableDataSource<Fonction>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  ngOnInit(): void {
    this.fonctionService.GetFonctionList().subscribe(
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
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }
  /** Ajouter nouveau Fonction */
  addFonction(): void{
    const dialogRef = this.dialog.open(FonctionAddComponent);
  }
  /**Modifier Fonction */
  editFonction(index:number, element){
    const dialogConfig = new MatDialogConfig();
    this.dialog.open(FonctionFormComponent,{data:{
      id:element.id,
      name:element.name
    }}).afterClosed().subscribe(result => {
      if (result){
        this.fonctionService.UpdateFonction(result)
      }
    });
  }
  /* Delete */
  deleteFonction(index: number){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.fonctionService.DeleteFonction(index)
    }
  }

}
