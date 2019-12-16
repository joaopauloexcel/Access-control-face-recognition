export class AuthLoginInfo {
    email: string;
    passwordApp: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.passwordApp = password;
    }
}
