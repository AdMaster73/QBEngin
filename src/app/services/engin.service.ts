import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Engin } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { switchMap, debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { firestore } from 'firebase';


@Injectable({
  providedIn: 'root'
})

export class EnginService {
	
	enginsRef: AngularFireList<any>;
	enginRef: AngularFireObject<any>;
	item: Observable<any>;
	offset = new Subject<string>();		
	constructor(
		 private db: AngularFireDatabase,
		 private afs: AngularFirestore) {
			this.enginRef = db.object('engin');
			this.item = this.enginRef.valueChanges();
		 }
	/* Create engin */
	AddEngin(engin: Engin){		
		return this.afs.collection('engin').add(engin)
	}
	/** Rcherche Engin par ID */
    GetEnginById(index:number){		
		return this.afs.collection('engin',ref=> 
		ref.where('id','==',index))
		.snapshotChanges()
			.pipe(
				debounceTime(1),
				distinctUntilChanged(),
				map(changes => {
					return changes.map(c => {
						return { key: c.payload.doc.id, ...c.payload.doc.data() as any};
					});
				})
			);
	}
	/* Delete engin */
	DeleteEngin(id: string) {
		this.enginRef = this.db.object('/engin/' + id);
		this.enginRef.remove()
		.catch(error => {
		  this.errorMgmt(error);
		})
	  }

	// Error management
	private errorMgmt(error) {
		console.log(error)
	}
	// Confirm management
	private confirmMgmt(confirm) {
		console.log(confirm)
	}	
	/* Get engin list */
	GetEnginList() {		
		return this.afs.collection<any>('engin',ref=> ref.orderBy('id'));		
	}

	// Reactive search query  "CATEGORIE"
	searchCategory(start: BehaviorSubject<string>,collection:string):Observable<any[]> {
		return start.pipe(
			switchMap(startText => {
				const endText = startText + '\uf8ff';
				return this.afs.collection(collection,ref => ref
				.orderBy('name')
				.limit(100)
				.startAt(startText)
				.endAt(endText)
				)
			.snapshotChanges()
			.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				map(changes => {
					return changes.map(c => {
						return { key: c.payload.doc.id, ...c.payload.doc.data() as any};
					});
				})
			);	
		  })
		);
	}
	//Search Categorie by fiels id
	GetIdCategorie(categorie){
		return this.afs.collection('categorie',ref=> 
		ref.where('name','==',categorie))
		.snapshotChanges()
			.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				map(changes => {
					return changes.map(c => {
						return { key: c.payload.doc.id, ...c.payload.doc.data() as any};
					});
				})
			);		
	}
	//
	GetIDFourisseur(fournisseur){
		return this.afs.collection('fourisseur',ref=> 
		ref.where('name','==',fournisseur))
		.snapshotChanges()
			.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				map(changes => {
					return changes.map(c => {
						return { key: c.payload.doc.id, ...c.payload.doc.data() as any};
					});
				})
			);
	}
	
	//get the last record from engin for incemanting
	GetEnginLastRecord(){		
	  return this.afs.collection('engin', ref => ref
		.limit(1)
		.orderBy('id', 'desc')
	  )				
	}
	
	/* Update engin */
	UpdateEngin(id, engin) {  
		return false
		//var date_achat  = typeof engin.date_achat === 'string' ? date_achat = new Date(engin.date_achat) : date_achat = new Date((engin.date_achat).toDate());
		this.afs.collectionGroup('engin',ref=> 
			ref.where('id','==',id)).snapshotChanges()
			.forEach( user => {
				user.forEach( userData =>{				  
					let ID = userData.payload.doc.id;
					this.afs.doc('engin/'+ID).update(
						{
							code: engin.code,
							name: engin.name,
							date_achat: (engin.date_achat).toDate(),//firestore.Timestamp.fromDate(new Date('01/01/2019'))
							valeur_achat: engin.valeur_achat,
							n_serie: engin.n_serie,
							marque_moteur: engin.marque_moteur,
							serie_moteur: engin.serie_moteur,			
							categorie:{
								id:engin.id_categorie,
								name:engin.categorie
							},
							fournisseur:{
								id:engin.id_fournisseur,
								name:engin.fournisseur
							}			
						}
					)	

					});
				});															
		/*this.enginRef = this.db.object('/engin/' + 'pwSGcINwaINrTHv4Wj6i');
		this.enginRef.update({
				code: engin.code,
				name: engin.name,
				date_achat: engin.date_achat,
				valeur_achat: engin.valeur_achat,
				n_serie: engin.n_serie,
				marque_moteur: engin.marque_moteur,
				serie_moteur: engin.serie_moteur,			
				categorie:engin.categorie[name],
				fournisseur:engin.fournisseur[name]
		}).then(()=>{
			this.confirmMgmt("modif confirmée")
		})
		.catch(error => {			
			this.errorMgmt(error);
		})*/				

	}  
  
}
