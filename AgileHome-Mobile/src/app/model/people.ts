export class People {
    id?:number;
    name: string;
    email: string;
    street: string;
    nStreet: string;
    hood:string;
    complement:string;
    zipCode:string;
    city:string;
    state:string;
    passwordHome: string;
    passwordApp: string;
    situation: string;
    faces:string;
    roles: string[];

    constructor() {
        this.id = null;
        this.name = '';
        this.email = '';
        this.street = '';
        this.nStreet = '';
        this.hood = '';
        this.complement = '';
        this.state = '';
        this.city = '';
        this.passwordHome = '';
        this.passwordApp = '';
        this.zipCode = '';
        this.situation = '';
        this.faces = '';
        this.roles = [''];
    }
}