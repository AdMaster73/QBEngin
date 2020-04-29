import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from '../services/engin.service';
import { Engin } from './../models/engin.model';
import { EnginAddComponent } from './engin-add/engin-add.component';
import { EnginFormComponent } from "./engin-form/engin-form.component";


@Component({
  selector: 'app-engin-list',
  templateUrl: './engin-list.component.html',
  styleUrls: ['./engin-list.component.scss']
})
export class EnginListComponent implements OnInit{
  
  EnginData: any = [];
  constructor(private enginService : EnginService, public dialog: MatDialog) {    
  }
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
