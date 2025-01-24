import { Component, inject } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.scss'
})
export class ServerErrorComponent {
  private router = inject(Router)
  error: undefined | { [id: string]: string | number }
  constructor() {
    this.error = this.router.getCurrentNavigation()?.extras.state
  }
}
