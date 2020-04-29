import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatDialogConfig} from '@angular/material';
import { MatPaginator} from '@angular/material/paginator';
import { ChantierService } from '../services/chantier.service';
import { Chantier } from './../models/engin.model';
import { ChantierAddComponent } from './chantier-add/chantier-add.component';
import { ChantierFormComponent } from "./chantier-form/chantier-form.component";
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-chantier-list',
  templateUrl: './chantier-list.component.html',
  styleUrls: ['./chantier-list.component.scss']
})
export class ChantierListComponent implements OnInit {


  EnginData: any = [];
  constructor(
    public db : AngularFirestore,
    private chantierService : ChantierService, 
    public dialog: MatDialog) {}
  displayedColumns: string[] = ['numero', 'designation','compte','archive','action'];
  dataSource : MatTableDataSource<Chantier>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;  
  ngOnInit(): void {
    this.chantierService.GetChantierList().subscribe(
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
  /** Ajouter nouveau Chantier */
  addChantier(): void{
    const dialogRef = this.dialog.open(ChantierAddComponent);
  }
  /**Modifier Chantier */
  editChantier(element){   
    const dialogConfig = new MatDialogConfig();            
    this.dialog.open(ChantierFormComponent,{data:{
      id:element.id,
      name:element.name,
      compte:element.compte,
      archive:element.archive
    }}).afterClosed().subscribe(result => {
      if (result){
        this.chantierService.UpdateChantier(result)
      } 
    });                              
  }
  /* Delete */
  deleteChantier(index: number){    
    if(window.confirm('Are you sure?')) {
      const data = this.dataSource.data;
      data.splice((this.paginator.pageIndex * this.paginator.pageSize) + index, 1);
      this.dataSource.data = data;
      this.chantierService.DeleteChantier(index)
    }
  }

}
