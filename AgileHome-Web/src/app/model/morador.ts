export class Morador {
    id?:number;
    name: string;
    address: string;
    email: string;
    password: string;
    cep: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;

    constructor(name: string, address: string, email: string, password: string,
        cep:string, numero:string, complemento:string, bairro:string, cidade: string, uf:string) {
        this.name = name;
        this.address = address;
        this.email = email;
        this.password = password;
        this.cep = cep;
        this.numero = numero;
        this.complemento = numero;
        this.bairro = bairro;
        this.cidade = cidade;
        this.uf = uf;
    }
}