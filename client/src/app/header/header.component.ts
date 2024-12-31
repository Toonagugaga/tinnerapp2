import { Component } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'


@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',   //yang ngi
  styleUrls: ['./header.component.scss']   //yang ngi
})
export class AppComponent {
  title = 'client';
}
