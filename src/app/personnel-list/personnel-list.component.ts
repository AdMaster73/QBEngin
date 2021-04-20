import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator} from '@angular/material/paginator';
import { PersonnelService } from '../services/personnel.service';
import { Personnel } from './../models/engin.model';
import { PersonnelAddComponent } from './personnel-add/personnel-add.component';
import { PersonnelFormComponent } from "./personnel-form/personnel-form.component";
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { CollectionsService } from '../services/collections.service';
import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit {

  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean
  collectionMenuToggel:boolean
  constructor(
    public db : AngularFirestore,
    private rolesService:RolesService,
    private collectionService: CollectionsService,
    private personnelService : PersonnelService,
    public dialog: MatDialog) {
      (async () => {
        let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
        let collectionId :number
        this.collectionService.GetCollectionsByName('personnel').subscribe(collections=>{
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
  displayedColumns: string[] = ['action','matricule', 'f_name','l_name','cin','date_naissance','fonction','type_pointage','type_contrat','date_amboche','duree_contrat','id_chantier'];
  dataSource : MatTableDataSource<Personnel>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  ngOnInit(): void {
    this.personnelService.getPersonnelList().subscribe(
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
  /** Ajouter nouveau Personnel */
  addPersonnel(): void{
    const dialogRef = this.dialog.open(PersonnelAddComponent);
  }
  /**Modifier Personnel */
  editPersonnel(index:number, element){
    this.dialog.open(PersonnelFormComponent,{data:{
      id:element.id,
      f_name:element.f_name,
      l_name:element.l_name,
      cin:element.cin,
      date_naissance:element.date_naissance,
      adresse:element.adresse,
      fonction:{
        id:element.fonction==undefined?0:eval(element.fonction.id),
        name:element.fonction==undefined?'':element.fonction.name
      },
      matricule:element.matricule,
      date_ambauche:element.date_ambauche,
      type_contrat:{
        id:element.type_contrat==undefined?0:eval(element.type_contrat.id),
        name:element.type_contrat==undefined?'':element.type_contrat.name
      },
      duree_contrat:element.duree_contrat,
      num_tele:element.num_tele,
      type_pointage:element.type_pointage,
      heure_pp:element.heure_pp,
      totalMois:element.totalMois,
      last_day:element.last_day,
      isChecked:element.isChecked,
      pending:element.pending,
      deplacement:element.deplacement
    }}).afterClosed().subscribe(result => {
      if (result){
        this.personnelService.UpdatePersonnel(result)
      }
    });
  }
  /* Delete */
  deletePersonnel(index: number){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.personnelService.DeletePersonnel(index)
    }
  }

}
