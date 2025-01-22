import { Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { PasswordValidator } from '../_validators/password.validator'
import { PasswordMatchValidator } from '../_validators/password.match.validator'
import { CommonModule } from '@angular/common'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatRadioModule } from '@angular/material/radio'
import { provideNativeDateAdapter } from '@angular/material/core'
import { MatCardModule } from '@angular/material/card'
import { AccountService } from '../_services/account.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  imports: [MatCardModule, MatRadioModule, ReactiveFormsModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class LoginComponent {
  mode: 'login' | 'register' = 'login'
  form: FormGroup

  private accountService = inject(AccountService)
  private router = inject(Router)
  private readonly _currentYear = new Date().getFullYear()
  errorFormServer = ''
  readonly minDate = new Date(this._currentYear - 70, 0, 1)
  readonly maxDate = new Date(this._currentYear - 18, 11, 31)
  readonly startDate = new Date(this._currentYear - 18, 0, 1)

  errorMessages = {
    username: signal(''),
    password: signal(''),
    display_name: signal(''),
    confirm_password: signal(''),
  }

  constructor() {
    this.form = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      password: new FormControl(null, [Validators.required, PasswordValidator(8, 16)]),
    })
  }

  toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login'
    this.updateForm()
  }
  updateForm() {
    if (this.mode === 'register') {
      this.form.addControl('confirm_password', new FormControl(null, Validators.required))
      this.form.addValidators(PasswordMatchValidator('password', 'confirm_password'))

      this.form.addControl('display_name', new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(8)]))
      this.form.addControl('date_of_birth', new FormControl(null, Validators.required))
      this.form.addControl('gender', new FormControl(null, Validators.required))
      this.form.addControl('looking_for', new FormControl(null, Validators.required))
    } else {
      this.form.removeControl('confirm_password')
      this.form.removeValidators(PasswordMatchValidator('password', 'confirm_password'))
      this.form.removeControl('display_name')
      this.form.removeControl('date_of_birth')
      this.form.removeControl('gender')
      this.form.removeControl('looking_for')
    }
  }

  async onSubmit() {
    // console.log(this.form.value)
    if (this.mode === 'login') {
      this.errorFormServer = await this.accountService.login(this.form.value)
    } else {//register
      this.errorFormServer = await this.accountService.register(this.form.value)
    }

    if (this.errorFormServer === '')
      this.router.navigate(['/'])
  }

  updateErrorMessage(ctrlName: string) {
    const control = this.form.controls[ctrlName]
    if (!control) return

    switch (ctrlName) {
      case 'username':
        // console.log('minLength: ' + control.hasError('minlength'))
        // console.log('maxLength: ' + control.hasError('maxlength'))
        if (control.hasError('required'))
          this.errorMessages.username.set('required')
        else if (control.hasError('minlength'))
          this.errorMessages.username.set('must be at least 6 characters long')
        else if (control.hasError('maxlength'))
          this.errorMessages.username.set('must be 16 characters or fewer')
        else
          this.errorMessages.username.set('')
        // console.log(this.errorMessages.username())
        break

      case 'password':
        if (control.hasError('required'))
          this.errorMessages.password.set('required')
        else if (control.hasError('invalidMinLength'))
          this.errorMessages.password.set('must be at least 8 characters long')
        else if (control.hasError('invalidMaxLength'))
          this.errorMessages.password.set('must be 16 characters or fewer')
        else if (control.hasError('invalidLowerCase'))
          this.errorMessages.password.set('must contain minimum of 1 lower-case letter')
        else if (control.hasError('invalidUpperCase'))
          this.errorMessages.password.set('must contain minimum of 1 capital letter')
        else if (control.hasError('invalidNumeric'))
          this.errorMessages.password.set('must contain minimum of 1 numeric character')
        else if (control.hasError('invalidSpecialChar'))
          this.errorMessages.password.set('must contain minimum of 1 special character')
        else
          this.errorMessages.password.set('')
        break

      case 'confirm_password':
        if (control.hasError('required'))
          this.errorMessages.confirm_password.set('required')
        else if (control.hasError('misMatch'))
          this.errorMessages.confirm_password.set('do not match password')
        else
          this.errorMessages.confirm_password.set('')
        break
      case 'display_name':
        if (control.hasError('required'))
          this.errorMessages.display_name.set('required')
        else if (control.hasError('minlength'))
          this.errorMessages.display_name.set('must be at least 3 characters long')
        else if (control.hasError('maxlength'))
          this.errorMessages.display_name.set('must be 8 characters or fewer')
        else
          this.errorMessages.display_name.set('')
        break
    }
  }
}
