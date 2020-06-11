import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'firebase';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent implements OnInit {

  form = new FormGroup({
    uid: new FormControl('')
  });
  constructor(@Inject(MAT_DIALOG_DATA) public data: User) { }

  ngOnInit() {}

}
