import { Component, inject, OnInit, WritableSignal } from '@angular/core'
import { LikeService } from '../_services/like.service'
import { default_pageSizeOption, default_paginator, Paginator, UserQueryPagination } from '../_models/pagination'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { User } from '../_models/user'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { MemberCardComponent } from '../member/member-card/member-card.component'

@Component({
  selector: 'app-follower',
  imports: [MemberCardComponent, MatIconModule, MatSelectModule, MatPaginatorModule, MatExpansionModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './follower.component.html',
  styleUrl: './follower.component.scss'
})
export class FollowerComponent implements OnInit {
  private likeService = inject(LikeService)
  followers: WritableSignal<Paginator<UserQueryPagination, User>>
  pageSize = default_pageSizeOption

  constructor() {
    this.followers = this.likeService.followers
  }
  ngOnInit(): void {
    this.onSearch()
  }
  async onSearch() {
    this.likeService.getFollowers()
  }
  onResetsearch() {
    this.followers.set(default_paginator)
    this.onSearch()
  }
  onPageChange(event: PageEvent) {
    const copypaginator = this.followers()
    copypaginator.pagination.currentPage = event.pageIndex + 1
    copypaginator.pagination.pageSize = event.pageSize
    this.followers.set(copypaginator)

    this.onSearch()
  }
}
