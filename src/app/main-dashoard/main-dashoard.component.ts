import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Chantier } from '../models/engin.model';
import { ChantierService } from '../services/chantier.service';


@Component({
  selector: 'app-main-dashoard',
  templateUrl: './main-dashoard.component.html',
  styleUrls: ['./main-dashoard.component.scss']
})
export class MainDashoardComponent implements OnInit{

  chantier$ : Observable<Chantier[]>;

  constructor(
    private chantierService : ChantierService
    ) {}
  ngOnInit() {
    this.chantier$ = this.chantierService.getChantierByUser()
  }
}
