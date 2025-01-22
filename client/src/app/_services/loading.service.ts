import { inject, Injectable } from '@angular/core'
import { NgxSpinnerService } from 'ngx-spinner'

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loadingRequestCount = 0

  private spinner = inject(NgxSpinnerService)
  constructor() { }

  loading() {
    this.loadingRequestCount++
    this.spinner.show(undefined, {
      type: "line-scale-pulse-out-rapid",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "rgba(130, 205, 237, 0.8)",
      fullScreen: false,
    })
  }
  idle() {
    this.loadingRequestCount--
    if (this.loadingRequestCount <= 0) {
      this.loadingRequestCount = 0
      this.spinner.hide()
    }
  }
}
