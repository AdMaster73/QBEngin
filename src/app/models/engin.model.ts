
export interface Engin {
    id: number;
    code: string;
    name:string;
    date_achat:Date;
    valeur_achat: string;
    n_serie: string;
    marque_moteur: string;
    serie_moteur: string;
    categorie:Categorie;
    fournisseur:Fournisseur;
    chauffeur?:Chauffeur,
    compteur?:number,
    etat_f?:string,
    last_notified?:number,
    type_v?:string;//type de vidange km ou hr
    compteur_dernier_v?:number;//Compteur du dernier vidange fait
    compteur_v?:number;//km ou hr à parcourir pour faire le vidange
    date_v?:Date;//la date du dernier vidange
    vidange?:string;//vidange complet ou simple
    vidange_alarm?:number;//le compteur qu'on doit allumer l'alarme
    id_chantier?:number,
    etiquette_ancienne?:number,
    pointed?:number
  }
  export interface Categorie{
    id:number,
    name:string,
    compte?:string,
  }
  export interface Fournisseur{
    id:number,
    name:string,
    compte?:string
  }
  export interface Fonction{
    id:number,
    name:string
  }
  export interface Chantier{
    id:number,
    name:string,
    compte:string,
    num_marche?:string,
    archive:number,
    region?:string,
    users?:string[],
    engins?:string[],
    localisation?:Localisation
  }
  export interface chantierUser{
    createdBy: string
    displayName: string
    email: string
    role: string
    uid: string
  }
  export interface User{
    uid:string,
    email:string,
    displayName: string,
    creationTime?:Date,
    lastSignInTime?:Date,
    photoURL?:string,
    emailVerified?:boolean,
    password?:string,
    phoneNumber?:string,
    role?:string
  }
  export interface Roles{
    id:number,
    name:string,
    intitule:string,
    list?:string[],
    add?:string[],
    update?:string[],
    delete?:string[],
    accessoire?:string[]
  }
  export interface Collections{
    id:number,
    name:string,
    intitule?:string,
    toolTipe?:string,
    icon?:string,
    order?:number
  }
  export interface Permissions{
    id:number,
    collection:Collections,
    /* list:Roles,
    add:Roles,
    update:Roles,
    delete:Roles */
  }
  export interface Transfert{
    id:number,
    uid:string,
    date_t:Date,
    chantier_p:Chantier,
    chantier_d:Chantier,
    porte_char:Engin,
    niveau_gasoil:string,
    etat_engin:Etat_engin_Transfert
  }
  export enum Etat_engin_Transfert{
    BIEN,MAUVAIS,FERAI
  }
  export enum Etat_engin{
    MARCHE,ARRET,MAD,ENATTENTE,PANNE
  }
  export enum Type_vidange{
    HEURE,KILOMETRAGE
  }

  export interface Notification{
    id?:string,
    uid:string,
    first_validation?:firebase.User[],
    second_validation?:firebase.User[],
    dex_dtu?:firebase.User[],
    validation?:string,
    userName?:string,
    role?:string,
    type:string,
    engin:string,
    etat:number,
    destination?:string,
    provenance?:string,
    description?:string,
    message?:string,
    createdBy?:string,
    createdAt?:Date,
    updateBy?:string,
    updatedAt?:Date,
    engin_id?:string
  }

  export interface Region {
    id:number;
    name:string;
    compte:string
  }

  export interface Pointage{
    id?:string,
    chantier:string,
    chantier_id?:string,
    date_pointage?:string,
    etat_e:string,
    gasoil:string[],
    heure_ar:number,
    heure_m:number,
    heure_p:number,
    localisation:Localisation,
    chauffeur:string,
    lubrifiant:number[],
    type_p:string,
    uid:string,
    user?:string
 }
 export interface Localisation{
   latitude:number,
   longitude:number
 }

 export interface Chauffeur{
   id:number,
   name:string,
   fonction?:Fonction,
   matricule?:string,
   type_permis?:string,
   date_obtention?:Date,
   date_visite_yeux?:Date,
 }

 export interface IFournisseurResponse {
  total: number;
  results: Fournisseur[];
}
export class FournisseurClass {
  constructor(
    public id: number,
    public name: string
    ) {}
}
export interface ICategorieResponse {
  total: number;
  results: Categorie[];
}
export class CategorieClass {
  constructor(
    public id: number,
    public name: string
    ) {}
}
export interface IChauffeurResponse {
  total: number;
  results: Chauffeur[];
}
export class ChauffeurClass {
  constructor(
    public id: number,
    public name: string
    ) {}
}
export interface IFonctionResponse {
  total: number;
  results: Fonction[];
}
export class FonctionClass {
  constructor(
    public id: number,
    public name: string
    ) {}
}
