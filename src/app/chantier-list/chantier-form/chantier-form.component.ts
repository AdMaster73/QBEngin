import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { ChantierService } from './../../services/chantier.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateAdapter} from '@angular/material/core';
import { ChantierListComponent } from '../chantier-list.component';

@Component({
  selector: 'app-chantier-form',
  templateUrl: './chantier-form.component.html',
  styleUrls: ['./chantier-form.component.scss']
})
export class ChantierFormComponent implements OnInit {


  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject(''); 
  date: any  
  ChantierFormEdit: FormGroup  
  @ViewChild('resetChantierForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    private chantierService : ChantierService,
    private _adapter: DateAdapter<any>,
    public dialogRef: MatDialogRef<ChantierListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.ChantierFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required],
      compte:[],
      archive:[]
    });    
  }

  /* Reactive book form */
  onSubmit(chantier) {
    this.chantierService.UpdateChantier(this.data.id,chantier)
    this.dialogRef.close();   
  }  

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.ChantierFormEdit.controls[controlName].hasError(errorName);
  }   

  search(searchText){
    this.startAt.next(searchText);
  } 
  
  /* Reset form */
  closeForm() {        
    this.dialogRef.close(); 
    return false
  }

}
