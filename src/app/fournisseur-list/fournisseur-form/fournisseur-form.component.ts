import { Component, OnInit,Inject, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from "@angular/forms";
import { FournisseurService } from './../../services/fournisseur.service';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { DateAdapter} from '@angular/material/core';
import { FournisseurListComponent } from '../fournisseur-list.component';

@Component({
  selector: 'app-fournisseur-form',
  templateUrl: './fournisseur-form.component.html',
  styleUrls: ['./fournisseur-form.component.scss']
})
export class FournisseurFormComponent implements OnInit {

  results$ : Observable<any[]>;
  results_f$: Observable<any[]>;
  startAt: BehaviorSubject<string | null> = new BehaviorSubject(''); 
  date: any  
  FournisseurFormEdit: FormGroup  
  @ViewChild('resetFournisseurForm',{static: true}) myNgForm : NgForm;  
  constructor(      
    public fb: FormBuilder ,
    private FournisseurService : FournisseurService,
    private _adapter: DateAdapter<any>,
    public dialogRef: MatDialogRef<FournisseurListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.FournisseurFormEdit= this.fb.group({
      id : new FormControl(),
      name: ['', Validators.required]
    });    
  }

  /* Reactive book form */
  onSubmit(Fournisseur) {
    this.FournisseurService.UpdateFournisseur(this.data.id,Fournisseur)
    this.dialogRef.close();   
  }  

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.FournisseurFormEdit.controls[controlName].hasError(errorName);
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
