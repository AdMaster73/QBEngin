
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
    fournisseur:Fournisseur  
  }
  export interface Categorie{
    id:number,
    name:string,
    compte:string,
  }
  export interface Fournisseur{
    id:number,
    name:string,
    compte:string
  }  
  export interface Chantier{
    id:number,
    name:string,
    compte:string,
    archive:number,
  }
  export interface User{
    id:number,
    display_name:string,
    email:string,
    login:string,    
  }

