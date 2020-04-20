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
  date_achat:Date;
  valeur_achat: string;
  n_serie: string;
  marque_moteur: string;
  serie_moteur: string;
  categorie : any = [];
  fournisseur : any = [];
  EnginData: any = [];
  constructor(private enginService : EnginService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.enginService.GetEnginList()
    .valueChanges().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);  
      this.dataSource.paginator = this.paginator;        
      this.dataSource.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = 'Affichage par page.';
      this.paginator._intl.firstPageLabel = 'Page Premier';
      this.paginator._intl.nextPageLabel = 'Page Suivant';
      this.paginator._intl.previousPageLabel = 'Page Précédante';
      this.paginator._intl.lastPageLabel = 'Dérnier Page';
    })
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
  
  displayedColumns: string[] = ['numero', 'code', 'designation', 'categorie','fournisseur','action'];
  dataSource : MatTableDataSource<Engin>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;

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
  editEngin(index:number, e){     
    this.enginService.GetEnginById(index).subscribe((value)=>{  
      const dialogConfig = new MatDialogConfig();            
      dialogConfig.disableClose = true
      dialogConfig.autoFocus = true    
      dialogConfig.data = {
                  id:value[0]['id'],
                  code:value[0]['code'],
                  name:value[0]['name'],
                  date_achat:value[0]['date_achat'],
                  marque_moteur:value[0]['marque_moteur'],
                  n_serie:value[0]['n_serie'],
                  serie_moteur:value[0]['serie_moteur'],
                  valeur_achat:value[0]['valeur_achat'],
                  id_fournisseur:value[0]['fournisseur'].id,
                  fournisseur:value[0]['fournisseur'].name,
                  id_categorie:value[0]['categorie'].id,
                  categorie:value[0]['categorie'].name
      } 
      this.dialog.open(EnginFormComponent,dialogConfig)                        
    })
    
  }
  /* Delete */
  deleteEngin(index: number, e){
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.enginService.DeleteEngin(e.$key)
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
