import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ChatService} from "../../service/chat.service";
import {MessageModel} from "../../model/message.model";
import {IonContent, NavController} from "@ionic/angular";
import {UserModel} from "../../model/user.model";

import {Plugins} from '@capacitor/core';
const {LocalNotifications} = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements AfterViewInit {

  messageText: string = '';
  messages: MessageModel[] =[];
  sender: UserModel;

  @ViewChild('content')
  content: IonContent;

  constructor(private chatService: ChatService, private navController: NavController) {
  }

  ionViewDidEnter() {
    this.chatService.getUser().subscribe((user) => {
      if (user) {
        this.sender = user;
      } else {
        this.navController.navigateRoot('/profile');
      }
    });
  }

  ngAfterViewInit(): void {
    this.chatService.getMessages().subscribe(messages => {
      this.messages.push(...messages);
      this.scrollBottom();
      this.showNotification(messages.pop());
    });
  }

  private showNotification(message) {
    LocalNotifications.schedule({
      notifications: [
        {
          title: "Message from: " + message.sender.name,
          body: message.text,
          id: 1,
          schedule: { at: new Date() },
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }

  private scrollBottom() {
    setTimeout(() => this.content.scrollToBottom(1000), 100);
  }

  send() {
    const message = new MessageModel();
    message.text = this.messageText;
    message.timestamp = Date.now();
    message.sender = this.sender;
    this.chatService.send(message)
        .subscribe(() => this.messageText ='', () => "Sent error")
  }

}
