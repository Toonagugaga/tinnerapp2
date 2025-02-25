import { Component, inject, OnInit, WritableSignal } from '@angular/core'
import { LikeService } from '../_services/like.service'
import { default_pageSizeOption, default_paginator, Paginator, UserQueryPagination } from '../_models/pagination'
import { User } from '../_models/user'
import { FormsModule } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator'
import { MatSelectModule } from '@angular/material/select'
import { MemberCardComponent } from '../member/member-card/member-card.component'

@Component({
  selector: 'app-following',
  imports: [MemberCardComponent, MatIconModule, MatSelectModule, MatPaginatorModule, MatExpansionModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './following.component.html',
  styleUrl: './following.component.scss'
})
export class FollowingComponent implements OnInit {
  private likeService = inject(LikeService)
  following: WritableSignal<Paginator<UserQueryPagination, User>>
  pageSize = default_pageSizeOption

  constructor() {
    this.following = this.likeService.following
  }
  ngOnInit(): void {
    this.onSearch()
  }
  async onSearch() {
    this.likeService.getFollowing()
  }
  onResetsearch() {
    this.following.set(default_paginator)
    this.onSearch()
  }
  onPageChange(event: PageEvent) {
    const copypaginator = this.following()
    copypaginator.pagination.currentPage = event.pageIndex + 1
    copypaginator.pagination.pageSize = event.pageSize
    this.following.set(copypaginator)

    this.onSearch()
  }
}

