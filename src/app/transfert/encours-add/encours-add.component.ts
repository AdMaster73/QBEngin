import { Component, OnInit, ViewChild } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnginService } from 'src/app/services/engin.service';
import { startWith, map, debounceTime, tap, switchMap, finalize, filter } from 'rxjs/operators';
import { ChantierService } from 'src/app/services/chantier.service';
import { Categorie, Chantier, Engin, Fournisseur, Notification } from 'src/app/models/engin.model';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

export interface IChantierResponse {
  total: number;
  results: Chantier[];
}

export interface IEnginResponse {
  total: number;
  results: Engin[];
}

export class ChantierClass {
  constructor(
    public id: number,
    public name: string,
    public compte : string,
    public archive : number,
    public region :string,
    public users : string[],
    public engins : string[]
    ) {}
}

export class EnginClass {
  constructor(
    public id: number,
    public name: string,
    public code : string,
    public id_chantier : number,
    public date_achat:Date,
    public valeur_achat:string,
    public n_serie: string,
    public marque_moteur: string,
    public serie_moteur: string,
    public categorie:Categorie,
    public fournisseur:Fournisseur,
    ) {}
}

@Component({
  selector: 'app-encours-add',
  templateUrl: './encours-add.component.html',
  styleUrls: ['./encours-add.component.scss']
})
export class EncoursAddComponent implements OnInit {

  options: string[] = [];
  optionsC: string[] = []
  optionsD: string[] = []
  engins_provenance : Engin[]=[]
  engins_destination : Engin[]=[]
  notifications : Array <Notification> = []
  notification : Notification
  engin : Array <Engin> = []
  myArray = []
  provenance :string = 'Provenance'
  destination :string = 'Destination'
  id_destination :number
  id_provenance :number
  filteredEngins: Engin[] = [];
  results$: Observable<any[]>
  results_d$: Observable<any[]>
  typeOfTransfert:string;
  @ViewChild('envoyer',{static:true}) envoyer;
  transfertFormGroup: FormGroup;
  secondFormGroup: FormGroup
  typeFormGroup: FormGroup
  isLoading = false;
  filteredChantiers: Chantier[] = [];
  filteredChantiersD: Chantier[] = [];
  filteredStringChantiers: IChantierResponse[];
  user$: Observable<{}>;
  role:string
  chantier_provenance : Chantier
  chantier_destination : Chantier
  userRoleConducteur: User[];
  userRoleCharger: User[];
  userRoleInj: User[];
  userRoleManager: User[];
  userRoleGLM: User[];
  uid: string;
  constructor(private enginService: EnginService,private _formBuilder: FormBuilder,private auth: AuthService,
    private firebaseAuth: AngularFireAuth,
    private chantierService: ChantierService) {}
  radioChange(event: MatRadioChange) {
    this.typeOfTransfert = event.value
  }
  ngOnInit() {
    this.user$ = this.firebaseAuth.user.pipe(
      filter(user => !!user),
      switchMap(user => this.auth.user$(user.uid))
    )
    this.user$.subscribe(user=>{
      this.role = user['role']
      this.uid = user['uid']
    })
    this.auth.users$.pipe(
      map(
        (user: User[]) => user.filter(
          (user: User) => user['role'] === 'glm'
        )
      )
    ).subscribe(
      (users: User[]) => {
        this.userRoleGLM = users.filter(user=>user['role'] === 'glm')
      }
    )
    this.transfertFormGroup = this._formBuilder.group({
      typeControl: [],
      myControl : new FormControl(''),
      myControlC : new FormControl('',[Validators.required]),
      myControlD : new FormControl('',[Validators.required])//{value:'',disabled:true}
    })
    this.enginService.GetEnginList().subscribe(data=>{
      data.forEach(engin=>{
        this.options.push(engin.code+' => '+engin.name)
      })
    })
    this.transfertFormGroup.get('myControlC')
    .valueChanges
    .pipe(
      debounceTime(200),
      tap(() => this.isLoading = true),
      switchMap(value => this.search({name: value}, 1)
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((chantiers)=>this.filteredChantiers = chantiers.results );

    this.transfertFormGroup.get('myControlD')
    .valueChanges
    .pipe(
      debounceTime(200),
      tap(() => this.isLoading = true),
      switchMap(value => this.searchD({name: value}, 2)
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((chantiers)=>this.filteredChantiersD = chantiers.results );

    this.transfertFormGroup.get('myControl')
    .valueChanges
    .pipe(
      debounceTime(200),
      tap(() => this.isLoading = true),
      switchMap(value => this.searchEngin({name: value}, 1)
      .pipe(
        finalize(() => {this.isLoading = false}),
        )
      )
    )
    .subscribe((engins)=>this.filteredEngins = engins.results );


  }

  search(filter: {name: string} = {name: ''}, page = 1): Observable<IChantierResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      filterString = filter.name['name']
      let engins_array : [] = filter.name['engins']
      if(engins_array !== undefined){
        if(engins_array.length >0){
          this.enginService.GetEnginListByIdArray(filter.name['engins'])
          .subscribe(engins=>{
            this.engins_provenance = engins
          })
        }
      }
      this.chantier_provenance = filter.name
    }
    return this.chantierService.GetChantierListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((chantier)=>new ChantierClass(
          chantier.id,
          chantier.name,
          chantier.compte,
          chantier.archive,
          chantier.region,
          chantier.users,
          chantier.engins
          ))
        .filter(chantier => chantier.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }

  searchD(filter: {name: string} = {name: ''}, page = 1): Observable<IChantierResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      filterString = filter.name['name']
      let engins_array : [] = filter.name['engins']
      if(engins_array !== undefined){
        if(engins_array.length >0){
          this.enginService.GetEnginListByIdArray(filter.name['engins'])
          .subscribe(engins=>{
            this.engins_destination = engins
          })
        }
      }
      this.chantier_destination = filter.name
    }
    return this.chantierService.GetChantierListSearchByUser()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((chantier)=>new ChantierClass(
          chantier.id,
          chantier.name,
          chantier.compte,
          chantier.archive,
          chantier.region,
          chantier.users,
          chantier.engins
          ))
        .filter(chantier => chantier.name.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }

  searchEngin(filter: {name: string} = {name: ''}, page = 1): Observable<IEnginResponse>{
    let filterString:string = filter.name
    if (typeof( filter.name) === 'object') {
      filterString = filter.name['code']
      let engins_array : [] = filter.name['engins']
      if(engins_array !== undefined){
        if(engins_array.length >0){
          this.enginService.GetEnginListByIdArray(filter.name['engins'])
          .subscribe(engins=>{
            this.engins_destination = engins
          })
        }
      }
      this.chantier_destination = filter.name
    }
    return this.enginService.GetEnginListSearch()
    .pipe(
      tap((response) => {
        response.results = response.results.
        map((engin)=>new EnginClass(
          engin.id,
          engin.name,
          engin.code,
          engin.id_chantier,
          engin.date_achat,
          engin.valeur_achat,
          engin.n_serie,
          engin.marque_moteur,
          engin.serie_moteur,
          engin.categorie,
          engin.fournisseur
          ))
        .filter(engin => engin.code.toUpperCase().includes(filterString.toUpperCase()))
        return response;
      })
      );
  }


  displayFn(chantier: Chantier): string {
    return chantier && chantier.name ? chantier.name : '';
  }
  displayFnD(chantier: Chantier): string {
    return chantier && chantier.name ? chantier.name : '';
  }
  displayFnEngin(engin: Engin): string {
    return engin && engin.code ? engin.code : '';
  }

  drop(event: CdkDragDrop<Engin[]>) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      } else {
        if(event.previousContainer.id=="cdk-drop-list-1"){
          this.engin = this.engin.filter(engin=>{
            return engin.code !== event.previousContainer.data[event.previousIndex].code
          })
          if(this.engin.length == 0){
            this.envoyer.disabled = true
          }
        }else{
          this.engin.push(event.previousContainer.data[event.previousIndex])
          this.envoyer.disabled = false
        }
        transferArrayItem(event.previousContainer.data,
                          event.container.data,
                          event.previousIndex,
                          event.currentIndex);
      }
    }

    sendTransfert(){
      this.engin.forEach(engin => {
        this.auth.users$.pipe(
          map(
            (user: User[]) => user.filter(
              (user: User) => this.chantier_provenance.users.includes(user.uid)
            )
          )
        ).subscribe(
          (users: User[]) => {
            this.userRoleConducteur = users.filter(user=>user['role'] === 'conducteur')
            this.userRoleCharger = users.filter(user=>user['role'] === 'charge')
            this.auth.users$.pipe(
              map(
                (users: firebase.User[]) => users.filter(
                  (user: firebase.User) => ['inj'].includes(user['role'])
                )
              )
            ).subscribe((users: firebase.User[])=>{//User dont le role est charge ou conducteur
              this.userRoleInj = users.filter(user=>user['role'] === 'inj')
              this.auth.users$.pipe(
                map(
                  (users: firebase.User[]) => users.filter(
                    (user: firebase.User) => ['manager'].includes(user['role'])
                  )
                )
              ).subscribe((users: firebase.User[])=>{//User dont le role est charge ou conducteur
                this.userRoleManager = users.filter(user=>user['role'] === 'manager')
                    //le role glm etat du materiel PANNE et le site different du GLM
                    if(['glm'].includes(this.role) && engin.etat_f === 'PANNE' && this.chantier_destination.id !== 248){
                      this.notification = {
                        uid : this.uid,
                        type : "Un retrait du materiel est encours",
                        engin: engin.id.toString(),
                        etat: 3,
                        provenance: this.chantier_provenance.name,
                        destination: this.chantier_destination.name,
                        validation: this.userRoleGLM[0].uid,
                        createdBy:this.uid,
                        createdAt:new Date(),
                        description:"Un retrait du materiel est encours",
                        message: "Un retrait du materiel est encours"
                      }
                    }else if(['admin','charge','manager','dex','dtu','conducteur','chefc'].includes(this.role)
                    && this.chantier_provenance.id.toString() !== '248' && engin.etat_f !== 'PANNE'){
                      //role n'est pas glm et le site n'est pas GLM et l'etat du materiel n'est PANNE
                      if(engin.etat_f=="MAD"){//si etat du materiel est MAD
                        this.notification = {//sans validation
                          uid : this.uid,
                          type : "Le materiel est encours de transfert",
                          engin: engin.id.toString(),
                          etat: 3,
                          provenance: this.chantier_provenance.name,
                          destination: this.chantier_destination.name,
                          validation: this.userRoleGLM[0].uid,
                          createdBy:this.uid,
                          createdAt:new Date(),
                          description:"Le materiel est encours de transfert",
                          message: "Le materiel est encours de transfert"
                        }
                      }else{// si etat du materiel est # de MAD
                        this.notification = {//avec validation du charger ou conducteur de provenance
                          uid : this.uid,
                          type : "Une validation de la part de charge d'affaire ou conducteur du site",
                          engin: engin.id.toString(),
                          etat: 1,
                          validation: this.userRoleCharger.length > 0? this.userRoleCharger[0].uid:this.userRoleConducteur[0].uid,
                          provenance: this.chantier_provenance.name,
                          destination: this.chantier_destination.name,
                          createdBy:this.uid,
                          createdAt:new Date(),
                          description:"Une validation de la part de charge d'affaire ou conducteur du site",
                          message: "Une validation de la part de charge d'affaire ou conducteur du site"
                        }
                      }
                    }else if(['admin','charge','manager','dex','dtu','conducteur','chefc'].includes(this.role)
                    && this.chantier_provenance.id.toString() === '248' && engin.etat_f !== 'PANNE'){
                      //role n'est pas glm et le site et GLM et l'etat du materiel n'est PANNE
                      this.notification = {//avec validation du Manager OU Ingénieur du Tvx
                        uid : this.uid,
                        type : "Une validation de la part du manager ou l'injenieur du travaux",
                        engin: engin.id.toString(),
                        etat: 2,
                        provenance: this.chantier_provenance.name,
                        destination: this.chantier_destination.name,
                        validation: this.userRoleInj.length > 0 ? this.userRoleInj[0].uid:this.userRoleManager[0].uid,
                        createdBy:this.uid,
                        createdAt:new Date(),
                        description:"une validation de la part du manager ou l'injenieur du travaux",
                        message: "Une validation de la part du manager ou l'injenieur du travaux"
                      }
                    }
                    this.enginService.AddNotification(this.notification)
          })
        })
          }
        )
      });
    }

     /** */
     isDragable(engin: Engin): boolean {
       let returnBoolean:boolean=false
      if(this.role === 'glm' && engin.etat_f!='PANNE') returnBoolean = true
      if(this.role != 'glm' && engin.etat_f==='PANNE') returnBoolean = true
      if(engin.last_notified) returnBoolean = true
      return returnBoolean
    }
     /** */
  getBackgroundColor(etat: string): String {
    switch (etat) {
      case 'MARCHE':
        return ''
        break;
      case 'ARRET':
        return 'rgb(88, 78, 78)'
        break;
      case 'MAD':
        return 'rgb(148, 204, 241)'
        break;
      case 'EN ATTENTE':
        return 'yellow'
        break;
      case 'PANNE':
        return 'red'
        break;

      default:
        break;
    }
  }

}
