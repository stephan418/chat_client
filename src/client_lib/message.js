export class Message {
    constructor(
        idOrObject,
        sender,
        receiver,
        textContent,
        additionalContent,
        creation,
        dateSent,
        dateDelivered,
        dateRead,
        lastWrite,
        wasSent
    ) {
        if (idOrObject instanceof String) {
            this.id = idOrObject;
            this.sender = sender;
            this.receiver = receiver;
            this.textContent = textContent;
            this.additionalContent = additionalContent;
            this.creation = creation;
            this.dateSent = dateSent;
            this.dateDelivered = dateDelivered;
            this.dateRead = dateRead;
            this.lastWrite = lastWrite;
            this.wasSent = wasSent;
        } else {
            this.id = idOrObject.id;
            this.sender = idOrObject.sender;
            this.receiver = idOrObject.receiver;
            this.textContent = idOrObject.text_content;
            this.additionalContent = idOrObject.additional_content;
            this.creation = idOrObject.creation;
            this.dateSent = idOrObject.date_sent;
            this.dateDelivered = idOrObject.date_delivered;
            this.dateRead = idOrObject.date_read;
            this.lastWrite = idOrObject.last_write;
            this.wasSent = null;
        }
    }

    static create({ token }, receiver, text_content) {
        return fetch('http://localhost:5000/message/', {
            headers: new Headers({ Authorization: 'Bearer ' + token }),
            method: 'POST',
            body: JSON.stringify({ receiver, text_content }),
        })
            .then(data => data.json())
            .then(json => {
                let message = new Message(json);
                message.wasSent = true;
                return message;
            });
    }

    static getAllWithSession(session) {
        const token = session.token;

        return fetch('http://localhost:5000/message/?per_page=1000&order_by=date_sent', {
            headers: new Headers({ Authorization: 'Bearer ' + token }),
            method: 'GET',
        })
            .then(data => data.json())
            .then(json => json.map(m => new Message(m)));
    }

    static getAllWithUser(session, other_user) {
        const token = session.token;

        return fetch(`http://localhost:5000/user/${other_user}/message/?per_page=10&descending=true`, {
            headers: new Headers({
                Authorization: 'Bearer ' + token,
            }),
            method: 'GET',
        })
            .then(data => data.json())
            .then(json =>
                json.map(m => {
                    const message = new Message(m);

                    if (message.receiver === other_user) {
                        message.wasSent = true;
                    } else {
                        message.wasSent = false;
                    }

                    return message;
                })
            )
            .then(array => array.reverse());
    }
}
