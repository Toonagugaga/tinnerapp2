import { HttpClient } from '@angular/common/http'
import { Component, inject } from '@angular/core'
import { environment } from '../../environments/environment'

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // private http = inject(HttpClient)
  // callError(code: number) {
  //   const url = environment.baseUrl + 'api/error/' + code
  //   this.http.get(url).subscribe({
  //     error: e => console.log(e)
  //   })
  // }
}
