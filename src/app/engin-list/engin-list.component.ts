import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from '../services/engin.service';
import { CollectionsService } from '../services/collections.service'
import { Engin } from './../models/engin.model';
import { EnginAddComponent } from './engin-add/engin-add.component';
import { EnginFormComponent } from "./engin-form/engin-form.component";
import * as firebase from 'firebase';
import { RolesService } from '../services/roles.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-engin-list',
  templateUrl: './engin-list.component.html',
  styleUrls: ['./engin-list.component.scss']
})
export class EnginListComponent implements OnInit{
  
  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean  
  collectionMenuToggel:boolean 
  EnginData: any = [];
  constructor(
    private enginService : EnginService,
    private rolesService:RolesService,    
    private collectionService: CollectionsService,
    public dialog: MatDialog) {  
    (async () => {
      let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
      let collectionId :number
      this.collectionService.GetCollectionsByName('engin').subscribe(collections=>{
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
  displayedColumnsObj = [
    {"value":'action',"show": true},
    {"value":'numero',"show": false}, 
    {"value":'code',"show": true}, 
    {"value":'designation',"show": true}, 
    {"value":'categorie',"show": true},
    {"value":'fournisseur',"show": true},
    {"value":'b_code',"show": true},
    {"value":'etat_f',"show": false}
  ];
  get displayedColumns(): string[]{
    return this.displayedColumnsObj.filter(
      (element) => {
        return element.show == true
      }).map(
        (element) => 
        {
          return element.value
        });
  }
  dataSource : MatTableDataSource<Engin>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;  
  ngOnInit(): void {
    this.enginService.GetEnginList().subscribe(
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
  /** Ajouter nouveau Engin */
  addEngin(): void{
    const dialogRef = this.dialog.open(EnginAddComponent);
  }
  /**Modifier Engin */
  editEngin(element){            
    this.dialog.open(EnginFormComponent,{data:{
      id:element.id,
      code: element.code,
      name: element.name,
      date_achat: element.date_achat,
      valeur_achat: element.valeur_achat,
      n_serie: element.n_serie,
      marque_moteur: element.marque_moteur,
      serie_moteur: element.serie_moteur,		
      b_code:element.b_code,	
      categorie:{
        id:element.categorie.id,
        name:element.categorie.name
      },
      fournisseur:{
        id:element.fournisseur.id,
        name:element.fournisseur.name
      }
    }}).afterClosed().subscribe(result => {
      if (result){        
        this.enginService.UpdateEngin(result)
      } 
    });                           
  }
  /* Delete */
  deleteEngin(index: number){    
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.enginService.DeleteEngin(index)
    }
  }
}
