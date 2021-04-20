import { Injectable } from '@angular/core';
import { Chantier } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import { IChantierResponse } from '../transfert/encours-add/encours-add.component';

@Injectable({
  providedIn: 'root'
})
export class ChantierService {

  constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth,private db: AngularFireDatabase) {}

  getChantierByName(destination: any) {
    return this.afs.collection<Chantier>('chantier',ref=>{
      let query : firebase.firestore.Query = ref
      query = query.where('name','==',destination)
      return query
    }).snapshotChanges().pipe(map(action=>{
      return action.map(a=>{
        const id = a.payload.doc.id
        const data = a.payload.doc.data() as Chantier
        return {id, ...data}
      })
    }))
  }

  bulkChantier(){
    const db = firebase.firestore()
    const locationData = new firebase.firestore.GeoPoint(33.8504681, -7.0409885)
    db.collection("chantier").get().then(querySnapshot=>{
      querySnapshot.forEach(doc=>{
          doc.ref.update({
              localisation: locationData
          });
      });
    });
  }

  getChantierById(chantier: any): import("rxjs").Observable<Chantier[]> {
    if(!chantier) return
    return this.afs.collection<Chantier>('chantier',ref=>ref.where(firestore.FieldPath.documentId(),'==',eval(chantier).toString())).snapshotChanges().pipe(
      map(action =>{
        return action.map(a =>{
          const data = a.payload.doc.data() as Chantier;
          const id = a.payload.doc.id;
          return {id, ...data };
        })
      })
    )
  }

  /*** */

  getChantierByRegion(region: string): import("rxjs").Observable<any[]> {
    return this.afs.collection('chantier',ref=>ref.where('region','==',region)).snapshotChanges().pipe(
      map(action =>{
        return action.map(a =>{
          const data = a.payload.doc.data() as Chantier;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }
  /**Récuperer le chantier par utilisateur */

  getChantierByUser(){
    return this.afs.collection('chantier',
    ref=>ref.where('users','array-contains',this.firebaseAuth.auth.currentUser.uid)
    .where('archive','==',0)
    ).snapshotChanges().pipe(
      map(action =>{
        return action.map(a =>{
          const data = a.payload.doc.data() as Chantier;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }
  /**Récuperer le chantier par utilisateur */

  getChantierByUserP(start: BehaviorSubject<string>):Observable<any[]>{
    return start.pipe(
      switchMap(startText=>{
        const endText = startText + '\uf8ff';
        return this.afs.collection(
          'chantier',ref=>
          ref
          .where('users','array-contains',this.firebaseAuth.auth.currentUser.uid)
        )
        .snapshotChanges()
        .pipe(
          debounceTime(200),
          map(changes=>{
            return changes.map(c=>{
              const data = c.payload.doc.data() as Chantier;
              const id = c.payload.doc.id;
              return { id, ...data}
            })
          })
        )
      })
    )
  }

	/* Créer un nouveau chantier */
	AddChantier(chantier: Chantier){
    const locationData = new firebase.firestore.GeoPoint(33.8504681, -7.0409885)
		return this.afs.collection('chantier').doc(chantier.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			name: chantier.name,
			compte:chantier.compte,
			archive:chantier.archive,
			localisation:locationData,
      personnel_pointed:0,
      month_pointed:new Date().getMonth()+1,
      year_pointed:new Date().getFullYear(),
      fortnight_pointed:0
		})
	}

	/* Supprier un chantier */
	async DeleteChantier(id) {
		this.afs.doc('chantier/'+id).delete()
	}

	/*Retourner une liste des chantier */
	GetChantierList() {
    /* const db = firebase.firestore()
    const locationData = new firebase.firestore.GeoPoint(33.8504681, -7.0409885)
    db.collection("chantier").get().then(querySnapshot=>{
      querySnapshot.forEach(doc=>{
          doc.ref.update({
              marche: [],
              arret: [],
              attente: [],
              mad: [],
              panne: []
          });
      });
    }); */
		return this.afs.collection<Chantier>('chantier',ref=> ref.orderBy(firestore.FieldPath.documentId(),'asc')).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Chantier;
				const id = a.payload.doc.id;
        return { id, ...data };
			});
			})
		);
	}
	/*Retourner une liste des chantier */
	GetChantierListSearch():Observable<IChantierResponse> {
    return new Observable(subscriber => {
      this.GetChantierListNnArchived().subscribe(chantiers=>{
        subscriber.next({
          total: chantiers.length,
          results: chantiers
        });
      })
    });
	}
	/*Retourner une liste des chantier */
	GetChantierListSearchByUser():Observable<IChantierResponse> {
    return new Observable(subscriber => {
      this.getChantierByUser().subscribe(chantiers=>{
        subscriber.next({
          total: chantiers.length,
          results: chantiers
        });
      })
    });
	}

	/*Retourner une liste des chantier non archivées*/
	GetChantierListNnArchived() {
		return this.afs.collection<Chantier>('chantier',ref=> ref.where('archive','==',0)).snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Chantier;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
	}

	//Avoir le ID du dernier enregesitrement
	GetChantierLastRecord(){
	  return this.afs.collection('chantier', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
	}

	/* Modifier un chantier */
	UpdateChantier(chantier) {
    let archive:number
    let region:string=""
    let departement:string=""
    let num_marche:string=""
		if(typeof(chantier.archive)==='number'){
			archive = chantier.archive
		}else{
			!!chantier.archive ? archive = 1 : archive = 0
    }
    if(chantier.region) region = chantier.region
    if(chantier.departement) departement = chantier.departement
    if(chantier.num_marche) num_marche = chantier.num_marche
    const locationData = new firebase.firestore.GeoPoint(chantier.latitude, chantier.longitude)
		this.afs.doc('chantier/'+chantier.id).update(
			{
			uodatedBy: this.firebaseAuth.auth.currentUser.uid,
			updatedAt: firestore.FieldValue.serverTimestamp(),
			name: chantier.name.toUpperCase(),
			compte:chantier.compte,
			num_marche:num_marche,
			archive:archive,
			region:region,
			departement:departement,
			localisation:locationData
			}
		)
	}
}
