import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CommentComponent } from "./comment/comment.component";
import { MessageFullComponent } from "./message-full/message-full.component";
import { MessageComponent } from "./message/message.component";
import { UserComponent } from "./user/user.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
    ],

    declarations: [
        MessageComponent,
        UserComponent,
        MessageFullComponent,
        CommentComponent
        
    ],
    exports: [
        MessageComponent,
        UserComponent,
        MessageFullComponent,
        CommentComponent
    ]
    })
export class ComponentsModule {}
