import { Component, input, OnInit } from '@angular/core'
import { Message } from '../../../_models/message'
import { User } from '../../../_models/user'

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {
  sender = input.required<User>()
  recipient = input.required<User>()
  message = input.required<Message>()
  previousMessageSenDate = input.required<Date | undefined>()

  isMessageFromSender = true
  messageStyle: MessageStyle = 'right'
  avatar = ''
  messageDate = ''
  readAt = 'unread'

  ngOnInit(): void {
    this.isMessageFromSender = this.sender().id === this.message().sender
    if (this.isMessageFromSender) {

      this.avatar = this.sender().avatar!
    } else {
      this.avatar = this.recipient().avatar!
      this.messageStyle = 'left'
    }
    if (this.message().read_at)
      this.readAt = `read:${this.message().read_at}`
  }

  isDateSamePreviousMessageSenDate(): boolean {
    const date1 = new Date(this.message().created_at!.toString())
    this.messageDate = date1.toLocaleDateString()
    if (!this.previousMessageSenDate()) return false

    const date2 = new Date(this.previousMessageSenDate()!.toString())

    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())

    return d1.getTime() === d2.getTime()
  }
}
type MessageStyle = 'right' | 'left'
