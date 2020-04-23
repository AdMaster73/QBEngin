import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import { Subscription } from 'rxjs/Subscription';
import {DataSource} from '@angular/cdk/collections';
import { EnginService } from '../services/engin.service';
import { Engin } from './../models/engin.model';
import { EnginAddComponent } from './engin-add/engin-add.component';
import { EnginFormComponent } from "./engin-form/engin-form.component";
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-engin-list',
  templateUrl: './engin-list.component.html',
  styleUrls: ['./engin-list.component.scss']
})
export class EnginListComponent implements OnInit{
  
  id: number;
  code: string;
  name:string;
  date_achat:string;
  valeur_achat: string;
  n_serie: string;
  marque_moteur: string;
  serie_moteur: string;
  categorie : any = [];
  fournisseur : any = [];
  EnginData: any = [];
  constructor(private enginService : EnginService, public dialog: MatDialog) {}
  displayedColumns: string[] = ['numero', 'code', 'designation', 'categorie','fournisseur','action'];
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
    //.valueChanges().subscribe()
    /*subscribe(engins => {      
        engins.map(item => {          
          let a = item.payload.toJSON();
          a['$key'] = item.key;        
          this.EnginData.push(a as Engin)
        })
        /* Data table 
        this.dataSource = new MatTableDataSource(this.EnginData);        
        /* Pagination 
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 0);
    })*/
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
  editEngin(index:number, element){   
    const dialogConfig = new MatDialogConfig();            
    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true 
    dialogConfig.data = {
                id:element.id,
                code:element.code,
                name:element.name,
                date_achat:element.date_achat,
                marque_moteur:element.marque_moteur,
                n_serie:element.n_serie,
                serie_moteur:element.serie_moteur,
                valeur_achat:element.valeur_achat,
                id_fournisseur:element.fournisseur.id,
                fournisseur:element.fournisseur.name,
                id_categorie:element.categorie.id,
                categorie:element.categorie.name
    } 
    this.dialog.open(EnginFormComponent,dialogConfig)                            
  }
  /* Delete */
  deleteEngin(index: number, e){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.enginService.DeleteEngin(index)
    }
  }
  /*ngAfterViewInit() {
    this.afs.collection<any>('engin').valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data); 
      this.dataSource.paginator = this.paginator;     
    })    
  }*/


/***
 * this.dataSource.paginator = this.paginator;
        this.paginator._intl.itemsPerPageLabel = 'Affichage par page.';
        this.paginator._intl.firstPageLabel = 'Page Premier';
        this.paginator._intl.nextPageLabel = 'Page Suivant';
        this.paginator._intl.previousPageLabel = 'Page Précédante';
        this.paginator._intl.lastPageLabel = 'Dérnier Page'; 
*/
}
