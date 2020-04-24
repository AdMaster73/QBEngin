import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { CategorieService } from '../services/categorie.service';
import { Categorie } from './../models/engin.model';
import { CategorieAddComponent } from './categorie-add/categorie-add.component';
import { CategorieFormComponent } from "./categorie-form/categorie-form.component";
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-categorie-list',
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.scss']
})
export class CategorieListComponent implements OnInit {

  EnginData: any = [];
  constructor(
    public db : AngularFirestore,
    private categorieService : CategorieService, 
    public dialog: MatDialog) {}
  displayedColumns: string[] = ['numero', 'designation','action'];
  dataSource : MatTableDataSource<Categorie>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;  
  ngOnInit(): void {
    this.categorieService.GetCategorieList().subscribe(
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
  /** Ajouter nouveau Categorie */
  addCategorie(): void{
    const dialogRef = this.dialog.open(CategorieAddComponent);
  }
  /**Modifier Categorie */
  editCategorie(index:number, element){   
    const dialogConfig = new MatDialogConfig();            
    dialogConfig.autoFocus = true 
    dialogConfig.data = element
    this.dialog.open(CategorieFormComponent,dialogConfig)                            
  }
  /* Delete */
  deleteCategorie(index: number){    
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.categorieService.DeleteCategorie(index)
    }
  }

}
