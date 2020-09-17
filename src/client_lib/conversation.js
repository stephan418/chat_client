export class Conversation {
    constructor(participantsOrObj, lastActivity, other) {
        if (typeof lastActivity === 'number') {
            this.participants = participantsOrObj;
            this.lastActivity = lastActivity;
            this.other = other;
        } else {
            this.participants = participantsOrObj.participants;
            this.lastActivity = participantsOrObj.last_activity;
            this.other = participantsOrObj.other;
        }
    }

    static async getAllWithSession(session, id) {
        const token = session.token;

        return fetch('http://localhost:5000/conversation/', {
            headers: new Headers({ Authorization: 'Bearer ' + token }),
        })
            .then(data => data.json())
            .then(json =>
                json.map(c => {
                    let other = undefined;
                    if (id) {
                        other = c.participants[0];
                        if (other === id) {
                            other = c.participants[1];
                        }
                    }

                    return new Conversation(Object.assign({ other: other }, c));
                })
            );
    }
}
