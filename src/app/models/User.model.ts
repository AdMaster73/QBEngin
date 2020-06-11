/*export class User{
	constructor(
		public id:number,
		public firstName : string,
		public lastName: string,
		public email: string,
		public login: string
		/*public drinkPreference: string,
		public hobbies?: string[]*/
	/*){
	
	}
}*/
export interface Roles { 
    subscriber?: boolean;
    editor?: boolean;
    admin?: boolean;
 }
export interface User {
	uid: string;
	email: string;
	photoURL?: string;
	displayName?: string;
	myCustomData?: string;
	role?: Role;
}
export enum Role {
    Editor = 'Editor',
	Admin = 'Admin',
	Subscriber = 'Subsrciber'
}