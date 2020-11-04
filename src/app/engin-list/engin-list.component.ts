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
import { EnginAccessoireComponent } from './engin-accessoire/engin-accessoire.component';
import { EnginPositionComponent } from './engin-position/engin-position.component';

@Component({
  selector: 'app-engin-list',
  templateUrl: './engin-list.component.html',
  styleUrls: ['./engin-list.component.scss']
})
export class EnginListComponent implements OnInit{

  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean
  collectionPermAccessoire:boolean
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
              this.collectionPermAdd = item.add?item.add.includes(collectionId.toString()):false
              this.collectionPermUpdate = item.update?item.update.includes(collectionId.toString()):false
              this.collectionPermDelete = item.delete?item.delete.includes(collectionId.toString()):false
              this.collectionPermAccessoire = item.accessoire?item.accessoire.includes(collectionId.toString()):false
              !this.collectionPermUpdate && !this.collectionPermDelete ? this.collectionMenuToggel = false : this.collectionMenuToggel = true
        })
      })
  })();
  }
  displayedColumnsObj = [
    {"value":'transfert',"show": true},
    {"value":'action',"show": true},
    {"value":'numero',"show": false},
    {"value":'code',"show": true},
    {"value":'designation',"show": true},
    {"value":'categorie',"show": true},
    {"value":'fournisseur',"show": true},
    {"value":'chauffeur',"show": true},
    {"value":'b_code',"show": true},
    {"value":'etat_f',"show": false},
    {"value":'site',"show": true},
    {"value":'position',"show": true}
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
    this.enginService.getEnginWithChantierName().subscribe(
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

  filterEtat(etat: string) {
    if(etat == ''){
      this.enginService.getEnginWithChantierName().subscribe(
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
    this.dataSource.filter = etat.trim().toUpperCase();

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
      date_achat: element.date_achat?element.date_achat:'',
      valeur_achat: element.valeur_achat? element.valeur_achat:'',
      n_serie: element.n_serie?element.n_serie:'',
      marque_moteur: element.marque_moteur?element.marque_moteur:'',
      serie_moteur: element.serie_moteur?element.serie_moteur:'',
      b_code:element.b_code?element.b_code:'',
      fournisseur:{
        id:eval(element.fournisseur.id),
        name:element.fournisseur.name
      },
      categorie:{
        id:eval(element.categorie.id),
        name:element.categorie.name
      },
      chauffeur:{
        id:eval(element.chauffeur.id),
        name:element.chauffeur.name
      },
      type_v:element.type_v?element.type_v:'',
      etat_f:element.etat_f?element.etat_f:'',
      etat_k:element.etat_k?element.etat_k:'',
      accessoire_v:element.accessoire_v?element.accessoire_v:'',
      compteur:element.compteur?element.compteur:0,
      pointed:element.pointed?element.pointed:0,
      porte:element.porte,
      consomation:element.consomation,
      compteur_v:element.compteur_v,
      vidange_alarm:element.vidange_alarm,
      compteur_dernier_v:element.compteur_dernier_v,
      date_v:element.date_v
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

  /** */
  getBackgroundColor(etat: string): String {
    switch (etat) {
      case 'MARCHE':
        return ''
        break;
      case 'ARRET':
        return 'rgb(88, 78, 78)'
        break;
      case 'MAD':
        return 'rgb(148, 204, 241)'
        break;
      case 'EN ATTENTE':
        return 'yellow'
        break;
      case 'PANNE':
        return 'red'
        break;

      default:
        break;
    }
  }

  accessoireEngin(engin:Engin){
    this.dialog.open(EnginAccessoireComponent,{data:engin}).afterClosed().subscribe(_ =>{
    })
  }

  getPosition(engin){
    this.dialog.open(EnginPositionComponent,{data:engin}).afterClosed().subscribe(_ =>{
    })
  }
}
