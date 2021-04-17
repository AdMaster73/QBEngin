import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource, MatSort, MatDialog} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { MouvementsService } from '../services/mouvements.service';
import { Mouvements } from './../models/engin.model';
/* import { CategorieAddComponent } from './categorie-add/categorie-add.component';
import { CategorieFormComponent } from "./categorie-form/categorie-form.component"; */
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { CollectionsService } from '../services/collections.service';
import { RolesService } from '../services/roles.service';
import * as xlsx from 'xlsx';

@Component({
  selector: 'app-mouvements',
  templateUrl: './mouvements.component.html',
  styleUrls: ['./mouvements.component.scss']
})
export class MouvementsComponent implements OnInit {

  collectionPermAdd: boolean
  collectionPermUpdate: boolean
  collectionPermDelete: boolean
  collectionMenuToggel:boolean
  @ViewChild('anneeChange', {static : true}) anneeChange: ElementRef;
  annees:string[] = []
  constructor(
    public fb: FormBuilder ,
    public db : AngularFirestore,
    private rolesService:RolesService,
    private collectionService: CollectionsService,
    private mouvementsService : MouvementsService,
    public dialog: MatDialog) {
      (async () => {
        let roleCurrentUser = await (await firebase.auth().currentUser.getIdTokenResult()).claims.role
        let collectionId :number
        this.collectionService.GetCollectionsByName('charges').subscribe(collections=>{
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
  displayedColumns: string[] = ['code_materiel', 'libelle_materiel','num_bon','code_artice','nom_produit','num_mvt','qte','cout_mvt','date_mvt'];
  dataSource : MatTableDataSource<Mouvements>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
  ngOnInit(): void {

    this.mouvementsService.getAllMouvements().subscribe(mouvements=>{
      mouvements.forEach(mouvement => {
        this.annees.push(mouvement.date)
      });
    })
    this.mouvementsService.GetMouvementsList().subscribe(
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

  exportToExcel() {
    const ws: xlsx.WorkSheet =
    xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Charges');
    xlsx.writeFile(wb, 'Charges du materiel.xlsx');
   }

  selectYear(annee:string){
    this.mouvementsService.fetchMouvementsByYear(annee).subscribe(
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
  /** Ajouter nouveau Categorie */
  addCategorie(): void{
    //const dialogRef = this.dialog.open(CategorieAddComponent);
  }
  /**Modifier Categorie */
  editCategorie(index:number, element){
    /* const dialogConfig = new MatDialogConfig();
    this.dialog.open(CategorieFormComponent,{data:{
      id:element.id,
      name:element.name,
      compte:element.compte?element.compte:''
    }}).afterClosed().subscribe(result => {
      if (result){
        this.categorieService.UpdateCategorie(result)
      }
    }); */
  }
  /* Delete */
  deleteCategorie(index: number){
    /* if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.categorieService.DeleteCategorie(index)
    } */
  }

}
