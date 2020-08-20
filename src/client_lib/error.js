export class RequestError {
    constructor(json) {
        try {
            this.error = json.error;
            this.message = json.message;
        } catch {
            console.error("Unknown Error");
            this.error = "UNKNOWN";
            this.message = "Not able to interpret the yielded error";
        }
    }
}
