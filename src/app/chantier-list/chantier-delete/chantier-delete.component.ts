import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-chantier-delete',
  templateUrl: './chantier-delete.component.html',
  styleUrls: ['./chantier-delete.component.scss']
})
export class ChantierDeleteComponent implements OnInit {

  form = new FormGroup({
    id: new FormControl('')
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data:number) { }

  ngOnInit() {
  }

}
