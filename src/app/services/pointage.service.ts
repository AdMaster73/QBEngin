import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map, switchMap } from 'rxjs/operators';
import { Chantier, Engin, Pointage } from '../models/engin.model';
import { AuthService} from '../services/auth.service';
import { combineLatest } from 'rxjs';
import { firestore } from 'firebase';
declare var require: any;
const firebase = require('firebase')


@Injectable({
  providedIn: 'root'
})
export class PointageService {

  constructor(private afs: AngularFirestore,private authService:AuthService,
		private firebaseAuth: AngularFireAuth) {
    }

    addPointage(result: any,engin :Engin) {
      var id_chantier = engin.id_chantier === undefined ? 249 : engin.id_chantier
      var latitude = result.latitude === null ? 33.8504681 : result.latitude
      var longitude = result.longitude === null ? -7.0409885 : result.longitude
      let etiquette_ancienne = engin.etiquette_ancienne == undefined ? 0:engin.etiquette_ancienne
      let maintenant:string = new Date().toLocaleDateString('fr-FR')
      const locationData = new firebase.firestore.GeoPoint(latitude, longitude)
            this.afs.collection('engin/'+engin.id+'/pointage').doc(maintenant.replace('/','').replace('/',''))
            .set({
              chantier:id_chantier,
              date_pointage:maintenant,
              etat_e:result.etat_f,
              gasoil:[
                result.gasoil,
                engin.compteur,
                result.compteur_nvx,
                result.consomation,result.etat_compt,
                result.bon,
                etiquette_ancienne,
                result.etiquette_nvx
              ],
              heure_ar:result.heure_ar,
              heure_m:result.heure_m,
              heure_p:result.heure_p,
              localisation:locationData,
              lubrifiant:[result.oil_10,result.oil_40,result.oil_90],
              type_p:'pointage',
              chauffeur:result.chauffeur,
              mobile:false,
              uid:this.firebaseAuth.auth.currentUser.uid
            },{ merge: true })
            if(result.vidange == null || result.vidange === ''){
              this.afs.doc('engin/'+engin.id).update({
                last_pointage:maintenant,
                etat_f:result.etat_f,
                compteur: result.compteur_nvx,
                etiquette_ancienne: result.etiquette_nvx,
                pointed:1
              })
            }else{
              this.afs.doc('engin/'+engin.id).update({
                last_pointage:maintenant,
                etat_f:result.etat_f,
                compteur: result.compteur_nvx,
                compteur_dernier_v:result.compteur_nvx,
                etiquette_ancienne: result.etiquette_nvx,
                date_v:result.date_pointage,
                vidange_complet:result.vidange,
                pointed:1
              })
            }
    }

     getPointageByEngin(engin: Engin) {
      return this.afs.collection<Pointage>('engin/'+engin.id+'/pointage').snapshotChanges().pipe(
        switchMap((pointages)=>{
          const point = pointages.map(p=>{
            return this.authService.user$(p.payload.doc.data().uid)
            .pipe(
              map(users=>Object.assign(p.payload.doc.data(),{users}))
            )
          })
          return combineLatest(...point)
        }
        )
      )
    }

    getChantierByUser(){
      return this.afs.collection<Chantier>('chantier',ref=>{
        const id = this.firebaseAuth.auth.currentUser.uid
        let query : firebase.firestore.Query = ref
        query = query.where('users','array-contains',id)
        return query
      }).snapshotChanges().pipe(map(action=>{
        return action.map(a=>{
          const id = a.payload.doc.id
          const data = a.payload.doc.data() as Chantier
          return {id, ...data}
        })
      }))
    }
    getAllChantierActive(){
      return this.afs.collection<Chantier>('chantier',ref=>{
        let query : firebase.firestore.Query = ref
        query = query.where('archive','==',0)
        return query
      }).snapshotChanges().pipe(map(action=>{
        return action.map(a=>{
          const id = a.payload.doc.id
          const data = a.payload.doc.data() as Chantier
          return {id, ...data}
        })
      }))
    }

}
