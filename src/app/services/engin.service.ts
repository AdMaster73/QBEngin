import { Injectable } from '@angular/core';
import { Chantier, Engin, Notification, Pointage } from '../models/engin.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, switchMap } from 'rxjs/operators';
import { firestore, User } from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable, combineLatest, Subject } from 'rxjs';
import * as firebase from 'firebase';
import { ChantierService } from './chantier.service';


@Injectable({
  providedIn: 'root'
})

export class EnginService {


	constructor(private afs: AngularFirestore,private firebaseAuth: AngularFireAuth,public chantierService:ChantierService) {
  }


  AddNotification(notification: Notification) {
    let maintenant:Date = new Date()
    let idDoc : string = maintenant.getFullYear().toString() +
     (maintenant.getMonth()+1).toString() +
      maintenant.getDate().toString() +
      maintenant.getHours().toString() +
      notification.engin.toString()
    this.afs.doc('engin/'+notification.engin.toString()).update({
      last_notified : notification.etat
    }).then(()=>{
      this.afs.collection('notification').doc(idDoc).set({
        createdBy:notification.uid,
        createdAt:notification.createdAt,
        uid : notification.uid,
        validation:notification.validation,
        type : notification.type,
        etat: notification.etat,
        provenance:notification.provenance,
        destination:notification.destination,
        description:notification.description,
        message:notification.message,
        engin:notification.engin
    }).then(()=>{
      this.afs.collection('notification/'+idDoc+'/story').add({
        createdBy:notification.uid,
        createdAt:notification.createdAt,
        etat: notification.etat
        })
      })
    })
  }

	/* Créer un nouveau engin */
	AddEngin(engin: Engin){
		return this.afs.collection('engin').doc(engin.id.toString()).set({
			createdBy: this.firebaseAuth.auth.currentUser.uid,
			createdAt: firestore.FieldValue.serverTimestamp(),
			code: engin.code,
			name: engin.name,
			date_achat:engin.date_achat,
			valeur_achat: engin.valeur_achat,
			n_serie: engin.n_serie,
			marque_moteur: engin.marque_moteur,
			serie_moteur: engin.serie_moteur,
			categorie:{
				id :engin.categorie.id,
				name:engin.categorie.name
			},
			fournisseur:{
				id :engin.fournisseur.id,
				name:engin.fournisseur.name
			},
			chauffeur:{
				id :engin.chauffeur.id,
				name:engin.chauffeur.name
			}
		})
	}

	/* Supprier un engin */
	async DeleteEngin(id) {
		this.afs.doc('engin/'+id).delete()
  }

  getEnginWithChantierName(){//,ref=>ref.where('pointed','==',1)
  /* const db = firebase.firestore()
    db.collection("engin").get().then((querySnapshot) =>{
      querySnapshot.forEach((doc) =>{
          doc.ref.update({
              b_code:firebase.firestore.FieldValue.delete()
          });
      });
    }); */

    return this.afs.collection<Engin>('engin').snapshotChanges().pipe(
      switchMap((engins)=>{
        const engin = engins.map(c=>{
          var id_chantier :string
          var id  = c.payload.doc.id
          if(c.payload.doc.data().id_chantier){
            id_chantier = c.payload.doc.data().id_chantier.toString()
          }else{
            id_chantier = '249'
          }
          return this.chantierService.getChantierById(id_chantier)
          .pipe(
            map(chantiers=>Object.assign(c.payload.doc.data(),{chantiers,id}))
          )
        })
        return combineLatest(...engin)
      }
      )
    )
  }

  GetEnginListBySite(siteId: string) {
    return this.afs.collection<Engin>('engin',ref=> ref.where('id_chantier','==',siteId))
    .snapshotChanges()
    .pipe(
      switchMap((engins)=>{
        const engin = engins.map(c=>{
          var id_chantier :string
          var id = c.payload.doc.id
          if(c.payload.doc.data().id_chantier){
            id_chantier = c.payload.doc.data().id_chantier.toString()
          }else{
            id_chantier = '249'
          }
          return this.chantierService.getChantierById(id_chantier)
          .pipe(
            map(chantiers=>Object.assign(c.payload.doc.data(),{chantiers,id}))
          )
        })
        return combineLatest(...engin)
      }
      )
    )

  }
	/*Retourner une liste des engin */
	GetEnginList() {
    /*  let maintenant:string = new Date().toLocaleDateString('fr-FR')
    const db = firebase.firestore()
    db.collection("engin").where('last_pointage','==',maintenant).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
          doc.ref.update({
              compteur: 0
          });
      });
    }) */;

    return this.afs.collection<Engin>('engin',ref=> ref.orderBy('createdAt','asc'))
    .snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Engin;
				const id = a.payload.doc.id;
				return { id, ...data };
			})
			})
		)
  }
	/*Retourner une liste des engin */
	GetEnginListAccessoire() {
    return this.afs.collection<Engin>('engin',ref=> ref.where('accessoire_v','==',1))
    .snapshotChanges().pipe(
			map(actions => {
			return actions.map(a => {
				const data = a.payload.doc.data() as Engin;
				const id = a.payload.doc.id;
				return { id, ...data };
			});
			})
		);
  }


    	/*Retourner une liste des engin */
	GetEnginListByIdArray(idArray:string[]):Observable<Engin[]> {
		return this.afs.collection<Engin>('engin',ref=>{
      let query : firebase.firestore.Query = ref
      query = query.where(firestore.FieldPath.documentId(),'in',idArray)
      return query
    }).snapshotChanges().pipe(
      map(action=>{
      return action.map(a=>{
        const id = a.payload.doc.id
        const data = a.payload.doc.data() as Engin
        const vidange_tf = data.compteur-data.compteur_dernier_v>data.compteur_v
        return Object.assign(data,{id,vidange_tf})
      })
    })
    )
  }

  //
  addAccessoireEngin(enginId:string,engin:any){
		this.afs.doc('/engin/'+enginId).update({
			accessoire:firebase.firestore.FieldValue.arrayUnion(engin.id)
    })
    this.afs.doc('/engin/'+enginId).update({
      accessoire_v:true
    })
  }
  //
  deleteAccessoireEngin(enginId:string,engin:Engin){
		const arrayRemove = firebase.firestore.FieldValue.arrayRemove;
		this.afs.doc('/engin/'+enginId).update({
			accessoire:arrayRemove(
				engin.id
			)
		})
	}

	//Avoir le ID du dernier enregesitrement
	GetEnginLastRecord(){
	  return this.afs.collection('engin', ref => ref
		.limit(1)
		.orderBy('createdAt','desc')
	  )
  }
  //

  listEnginAccessoire(enginID):Observable<Engin[]>{
		return combineLatest(
			this.afs.doc('engin/'+enginID).valueChanges(),
			this.GetEnginList()
		).pipe(
			map(([engin,accessoire])=>{
				if(engin['accessoire'] === undefined){
					return []
				}
				return accessoire.filter(accessoire=>engin['accessoire'].includes(accessoire.id))
			}))
	}

	/* Modifier un engin */
	UpdateEngin(engin) {
    let accessoire_veh = engin.accessoire_v ? 1 : 0
    let pointage_veh = engin.pointed ? 1 : 0
    let porte = engin.porte ? 1 : 0
    var consomation :number =0
    var compteur_v :number =0
    var vidange_alarm :number =0
    if(engin.consomation===undefined){
      consomation = 0
    }else{
      consomation = engin.consomation
    }
    if(engin.compteur_v!=undefined){
      compteur_v = engin.compteur_v
    }
    if(engin.vidange_alarm!=undefined){
      vidange_alarm = engin.vidange_alarm
    }
		this.afs.doc('engin/'+engin.id).update(
			{
				updatedBy: this.firebaseAuth.auth.currentUser.uid,
				updatedAt: firestore.FieldValue.serverTimestamp(),
				code: engin.code,
				name: engin.name,
				date_achat: engin.date_achat,
				valeur_achat: engin.valeur_achat,
				n_serie: engin.n_serie,
				marque_moteur: engin.marque_moteur,
				serie_moteur: engin.serie_moteur,
				b_code: engin.b_code,
				categorie:{
					id:eval(engin.categorie.id),
					name:engin.categorie.name
				},
				fournisseur:{
					id:eval(engin.fournisseur.id),
					name:engin.fournisseur.name
        },
				chauffeur:{
					id:eval(engin.chauffeur.id),
					name:engin.chauffeur.name
        },
        type_v:engin.type_v,
        etat_f:engin.etat_f,
        etat_k:engin.etat_k,
        accessoire_v:accessoire_veh,
        compteur:engin.compteur,
        pointed:pointage_veh,
        porte:porte,
        consomation:consomation,
        compteur_v:compteur_v,
        vidange_alarm:vidange_alarm
			}
		)
  }

  /**retoure un objet de type engin */

  getEnginById(engin){
    return this.afs.collection<Engin>('engin',ref=>ref.where(firestore.FieldPath.documentId(),'==',engin.toString())).snapshotChanges().pipe(
      map(action=>{
        return action.map(a=>{
          const data = a.payload.doc.data() as Engin;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    )
  }

  getLocalisationEngin(data: any) {
    return this.afs.doc<Pointage>('engin/'+data.id+'/pointage/'+data.last_pointage.replace('/','').replace('/','')).valueChanges()
  }


}
