import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from './../models/engin.model';
import { FournisseurAddComponent } from './fournisseur-add/fournisseur-add.component';
import { FournisseurFormComponent } from "./fournisseur-form/fournisseur-form.component";
import { AngularFirestore } from 'angularfire2/firestore';
import { firestore } from 'firebase';

@Component({
  selector: 'app-fournisseur-list',
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.scss']
})
export class FournisseurListComponent implements OnInit {
      
    constructor(
      public db : AngularFirestore,
      private FournisseurService : FournisseurService, 
      public dialog: MatDialog) {}
    displayedColumns: string[] = ['numero', 'designation','action'];
    dataSource : MatTableDataSource<Fournisseur>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static : true}) sort: MatSort;  
    ngOnInit(): void {
      this.FournisseurService.GetFournisseurList().subscribe(
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
    /** Ajouter nouveau Fournisseur */
    addFournisseur(): void{
      const dialogRef = this.dialog.open(FournisseurAddComponent);
    }
    /**Modifier Fournisseur */
    editFournisseur(index:number, element){   
      const dialogConfig = new MatDialogConfig();            
      dialogConfig.autoFocus = true 
      dialogConfig.data = element
      this.dialog.open(FournisseurFormComponent,dialogConfig)                            
    }
    /* Delete */
    deleteFournisseur(index: number){    
      if(window.confirm('Are you sure?')) {
        const data = this.dataSource.data;
        data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
        this.dataSource.data = data;
        this.FournisseurService.DeleteFournisseur(index)
      }
    }
  
  }
  
