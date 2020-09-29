import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EnginService } from 'src/app/services/engin.service';
import { EnginListComponent } from '../engin-list.component';

@Component({
  selector: 'app-engin-position',
  templateUrl: './engin-position.component.html',
  styleUrls: ['./engin-position.component.scss']
})
export class EnginPositionComponent implements OnInit {

  latitude : number;
  longitude : number;
  chantier:string;
  constructor(
    private enginService:EnginService,
    public dialogRef: MatDialogRef<EnginListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

  ngOnInit() {
    this.enginService.getLocalisationEngin(this.data).subscribe(pointage=>{
      this.latitude = pointage.payload.data()['localisation'].altitude
      this.longitude = pointage.payload.data()['localisation'].longitude
      this.chantier = pointage.payload.data()['chantier']
    })
  }

}
