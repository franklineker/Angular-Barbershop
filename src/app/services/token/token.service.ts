import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as buffer from 'buffer';
import { environment } from 'src/environments/environment';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';
const CODE_VERIFIER = 'code_verifier';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    constructor() { }

    setTokens(access_token: string, refresh_token: string): void {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.setItem(ACCESS_TOKEN, access_token);

        localStorage.removeItem(REFRESH_TOKEN);
        localStorage.setItem(REFRESH_TOKEN, refresh_token);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN);
    }

    getUserEmail(): string | null {
        let email = "User email not found";
        if (this.isLogged()) {
            const token = this.getAccessToken();
            const payload = token!.split('.')[1];
            const payloadDecoded = buffer.Buffer.from(payload!, 'base64').toString(
                'utf-8'
            );
            const values = JSON.parse(payloadDecoded);
            const sub = values.username;
            email = sub;
        }

        return email;
    }

    clear(): void {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
    }

    isLogged(): boolean {
        return localStorage.getItem(ACCESS_TOKEN) != null;
    }

    isAdmin(): boolean {
        if (!this.isLogged()) {
            return false;
        }

        const token = this.getAccessToken();
        const payload = token?.split('.')[1];
        const payloadDecoded = atob(payload!);
        const values = JSON.parse(payloadDecoded);
        const roles = values.roles;

        if (roles.indexOf('ADMIN') < 0) {
            return false;
        }

        return true;
    }

    isBarber(): boolean {
        if (!this.isLogged()) {
            return false;
        }

        const token = this.getAccessToken();
        const payload = token?.split('.')[1];
        const payloadDecoded = atob(payload!);
        const values = JSON.parse(payloadDecoded);
        const roles = values.roles;

        if (roles.indexOf('BARBER') < 0) {
            return false;
        }

        return true;
    }

    isClient(): boolean {
        if (!this.isLogged()) {
            return false;
        }

        const token = this.getAccessToken();
        const payload = token?.split('.')[1];
        const payloadDecoded = atob(payload!);
        const values = JSON.parse(payloadDecoded);
        const roles = values.roles;

        if (roles.indexOf('CLIENT') < 0) {
            return false;
        }

        return true;
    }

    setVerifier(code_verifier: string): void {
        if (localStorage.getItem(CODE_VERIFIER)) {
            this.deleteVerifier();
        }

        const encrypted = CryptoJS.AES.encrypt(
            code_verifier,
            environment.secret_pkce
        );
        localStorage.setItem(CODE_VERIFIER, encrypted.toString());
    }

    getVerifier(): string {
        const encrypted = localStorage.getItem(CODE_VERIFIER);
        const decrypted = CryptoJS.AES.decrypt(
            encrypted!,
            environment.secret_pkce
        ).toString(CryptoJS.enc.Utf8);
        return decrypted;
    }

    deleteVerifier(): void {
        localStorage.removeItem(CODE_VERIFIER);
    }
}
