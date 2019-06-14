import {Component} from '@angular/core';
import {ChatService} from "../../service/chat.service";
import {UserModel} from "../../model/user.model";
import {NavController} from "@ionic/angular";
import { Plugins } from '@capacitor/core';

const {Device} = Plugins;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  userName: string;

  constructor(private chatService: ChatService, private navController: NavController) {
  }

  async save() {
    if (this.userName) {
      const user = new UserModel();
      user.id = (await Device.getInfo()).uuid;
      user.name = this.userName;
      this.chatService.setUser(user)
          .subscribe(() => this.navController.back());
    }
  }

}
