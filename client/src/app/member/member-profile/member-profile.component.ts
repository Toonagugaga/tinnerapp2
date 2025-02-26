import { AfterViewChecked, Component, computed, ElementRef, inject, OnDestroy, OnInit, Signal, ViewChild } from '@angular/core'
import { User } from '../../_models/user'
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery'
import { MemberService } from '../../_services/member.service'
import { Photo } from '../../_models/photo'
import { ActivatedRoute, Router } from '@angular/router'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MessageService } from '../../_services/message.service'
import { Subscription } from 'rxjs'
import { Message } from '../../_models/message'
import { AccountService } from '../../_services/account.service'
import { FormsModule } from '@angular/forms'
import { MessageComponent } from "./message/message.component"

@Component({
  selector: 'app-member-profile',
  imports: [GalleryModule, MatSidenavModule, MatCardModule, MatIconModule, MatButtonModule, FormsModule, MessageComponent],
  templateUrl: './member-profile.component.html',
  styleUrl: './member-profile.component.scss'
})
export class MemberProfileComponent implements OnInit, AfterViewChecked, OnDestroy {
  member!: User
  images: GalleryItem[] = []
  private memberService = inject(MemberService)
  private activeRoute = inject(ActivatedRoute)
  private router = inject(Router)
  private messageService = inject(MessageService)
  private accountService = inject(AccountService)
  private subscription!: Subscription
  messages: Message[] = []
  newMessage = ''

  scrollChatToBottom: boolean = false
  scrollChatToTop: boolean = false
  isChatOpen: boolean = false
  numberOfMessages: number = 0

  @ViewChild('chat') chat!: ElementRef
  isWsConnected: Signal<boolean>
  user: User
  constructor() {
    this.user = this.accountService.data()!.user
    this.isWsConnected = computed(() => this.messageService.isWSConnected())
    this.subscription = this.messageService.message$.subscribe({
      next: newMessage => this.messages.push(newMessage),
      error: err => console.error(`Error:${err}`)
    })
  }
  send() {
    if (this.newMessage.trim()) {
      const newMessage: Message = {
        sender: this.user.id,
        recipient: this.member.id,
        content: this.newMessage.trim()
      }
      this.messageService.sendMessage(newMessage)
      this.newMessage = ''
      this.scrollChatToBottom = true
    }
  }
  async getMoreChatHistory() {
    const currentPage = this.messageService.paginator().pagination.currentPage || 0
    const nextPage = currentPage + 1
    this.messageService.paginator().pagination.currentPage = nextPage
    await this.messageService.getMessageHistory(this.member.id!)

    const moreMessages = this.messageService.paginator().items
    this.numberOfMessages = this.messageService.paginator().pagination.length!
    this.messages = [...moreMessages.reverse(), ...this.messages]
    this.scrollChatToTop = true
  }
  async toggleChat() {
    this.isChatOpen = !this.isChatOpen
    if (this.isChatOpen) {
      const token = this.accountService.data()?.token!
      this.messageService.connect(this.member.id!, token, this.user.id!)
      this.messages = []
    } else {
      if (this.subscription)
        this.subscription.unsubscribe()
      this.messageService.close()
    }
    if (this.messages.length > 0) return
    console.log('load chat history')
    await this.messageService.getMessageHistory(this.member.id!)
    this.messages = [...this.messageService.paginator().items.reverse()]
    this.numberOfMessages = this.messageService.paginator().pagination.length!
  }
  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe()
    this.messageService.close()
    console.log('disconnect')
  }
  ngAfterViewChecked(): void {
    if (!this.chat) return
    const container = this.chat.nativeElement as Element
    if (this.scrollChatToTop) {
      container.scrollTop = 0
      this.scrollChatToTop = false
    }
    if (this.scrollChatToBottom) {
      container.scrollTop = container.scrollHeight
      this.scrollChatToBottom = false
    }
  }



  private initGalleryItem(photos: Photo[]) {
    for (const photo of photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
    }
  }

  async getMember() {
    const username = this.activeRoute.snapshot.paramMap.get('username')
    if (!username) return
    const member = await this.memberService.getMemberByUsername(username)
    if (!member) {
      this.router.navigate(['404'])
    } else {
      this.member = member
      if (this.member.photos)
        this.initGalleryItem(this.member.photos)
    }
  }
  ngOnInit(): void {
    this.getMember()
  }
}
