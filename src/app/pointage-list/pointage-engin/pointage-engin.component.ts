import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatSort, MatDialog} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from './../../services/engin.service';
import { Engin } from 'src/app/models/engin.model';
import { Observable } from 'rxjs';
import { PointageService } from 'src/app/services/pointage.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-pointage-engin',
  templateUrl: './pointage-engin.component.html',
  styleUrls: ['./pointage-engin.component.scss']
})
export class PointageEnginComponent implements OnInit {

  options: string[] = [];  
  filteredOptions: Observable<string[]>;
  myControl = new FormControl()
  constructor(
    private enginService: EnginService,
    private pointageService:PointageService) {}
  displayedColumns: string[] = ['numero', 'code', 'designation', 'categorie','fournisseur','b_code'];
  dataSource : MatTableDataSource<Engin>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static : true}) sort: MatSort;  
  ngOnInit(): void {
    this.enginService.GetEnginList().subscribe(engins=>{
      engins.forEach(engin=>{
        this.options.push(engin.code+' => '+engin.name)
      })
    })
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
    
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter_engin(value))
      );
  }

  private _filter_engin(value: string): string[] {
    if(value === null){
      return
    }
    const filterValue = value.toLowerCase();    

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.sort = this.sort;
    }
  }

}
