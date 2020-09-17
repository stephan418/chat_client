import { RequestError } from './error.js';

export class Session {
    constructor(tokenOrObj, for_user, creation, expires) {
        if (tokenOrObj instanceof String) {
            this.token = tokenOrObj;
            this.for_user = for_user;
            this.creation = creation;
            this.expires = expires;
        } else if (tokenOrObj instanceof Object) {
            this.token = btoa(`${tokenOrObj.id}.${tokenOrObj.secret}`);
            this.for_user = tokenOrObj.for_user;
            this.creation = tokenOrObj.creation;
            this.expires = tokenOrObj.expires;
        }
    }

    static async create(for_user, password) {
        if (!(typeof for_user == 'string' && typeof password == 'string')) {
            throw new TypeError('Both for_user and password must be a String');
        }

        return fetch('http://127.0.0.1:5000/session/', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({
                id: for_user,
                password: password,
            }),
        })
            .then(data => {
                if (data.ok) {
                    return data.json();
                } else {
                    data.json().then(json => {
                        throw new RequestError(json);
                    });
                }
            })
            .then(json => new Session(json));
    }
}
