import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { EnginService } from './../../services/engin.service';
import { Engin } from 'src/app/models/engin.model';
import { Observable } from 'rxjs';
import { PointageService } from 'src/app/services/pointage.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-pointage-location',
  templateUrl: './pointage-location.component.html',
  styleUrls: ['./pointage-location.component.scss']
})
export class PointageLocationComponent implements OnInit {
  
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
    this.pointageService.getAllChantierActive().subscribe(chantiers=>{
      chantiers.forEach(chantier=>{
        this.options.push(chantier.name)
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
        map(value => this._filter_chantier(value))
      );
  }

  private _filter_chantier(value: string): string[] {
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
