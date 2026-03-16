export class WebhookService {

    async validation(value: string) {

        return "validation";
    }


    async confirm(value: string) {
        return "confirm";
    }


    async reject(value: string) {
        return "reject";
    
    }
}