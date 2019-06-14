import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/firestore";
import {MessageModel} from "../model/message.model";
import {from, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {Storage} from "@ionic/storage";
import {UserModel} from "../model/user.model";
import {Plugins} from '@capacitor/core';
const {Geolocation} = Plugins;

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private userKey = 'user';
    private messages: AngularFirestoreCollection<MessageModel>;

    constructor(private fireStore: AngularFirestore, private storage: Storage) {
        this.messages = this.fireStore.collection<MessageModel>('messages');
    }

    getMessages(): Observable<MessageModel[]> {
        return this.messages.stateChanges()
            .pipe(map(actions => this.extract(actions)));
    }

    private extract(actions) {
        return actions.map(this.toMessage).sort(this.byTimestamp);
    }

    private byTimestamp(firstMessage: MessageModel, secondMessage: MessageModel): number {
        return firstMessage.timestamp > secondMessage.timestamp ? 1 : -1;
    }

    private toMessage(action) {
        const document = action.payload.doc;
        const data = document.data();
        return {id: document.id, ...data, sender: data.sender};
    }

    send(message: MessageModel): Observable<DocumentReference> {
        return from(this.messages.add({...message}));
    }

    getUser(): Observable<UserModel> {
        return from(this.storage.get(this.userKey));
    }

    setUser(user: UserModel) {
        return from(this.storage.set(this.userKey, user));
    }

}
