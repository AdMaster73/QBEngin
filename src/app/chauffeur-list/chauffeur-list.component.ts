import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { ChauffeurService } from '../services/chauffeur.service';
import { Chauffeur } from './../models/engin.model';
import { ChauffeurAddComponent } from './chauffeur-add/chauffeur-add.component';
import { ChauffeurFormComponent } from "./chauffeur-form/chauffeur-form.component";
import { ChauffeurDeleteComponent } from "./chauffeur-delete/chauffeur-delete.component";
import { AngularFirestore } from 'angularfire2/firestore';
import { CollectionsService } from '../services/collections.service';
import * as firebase from 'firebase';
import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-chauffeur-list',
  templateUrl: './chauffeur-list.component.html',
  styleUrls: ['./chauffeur-list.component.scss']
})
export class ChauffeurListComponent implements OnInit {

  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean
  collectionMenuToggel:boolean
    constructor(
      public db : AngularFirestore,
      private collectionService: CollectionsService,
      private rolesService:RolesService,
      private chauffeurServices : ChauffeurService,
      public dialog: MatDialog) {
        (async () => {
          let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
          let collectionId :number
          this.collectionService.GetCollectionsByName('chauffeur').subscribe(collections=>{
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
    dataSource : MatTableDataSource<Chauffeur>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static : true}) sort: MatSort;
    ngOnInit(): void {
      this.chauffeurServices.GetChauffeurList().subscribe(
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
    /** Ajouter nouveau Chauffeur */
    addChauffeur(): void{
      const dialogRef = this.dialog.open(ChauffeurAddComponent);
    }
    /**Modifier Chauffeur */
    editChauffeur(index:number, element){
      const dialogConfig = new MatDialogConfig();
      this.dialog.open(ChauffeurFormComponent,{data:{
        id:element.id,
        name:element.name
      }}).afterClosed().subscribe(result => {
        if (result){
          this.chauffeurServices.UpdateChauffeur(result)
        }
      });
    }
    /* Delete */
    deleteChauffeur(index: number){
      if(window.confirm('Are you sure?')) {
        const data = this.dataSource.data;
        data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
        this.dataSource.data = data;
        this.chauffeurServices.DeleteChauffeur(index)
      }
    }

}
