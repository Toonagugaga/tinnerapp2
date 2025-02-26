import { computed, inject, Injectable, signal, Signal } from '@angular/core'
import { User } from '../_models/user'
import { AccountService } from './account.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { default_paginator, Paginator, UserQueryPagination } from '../_models/pagination'
import { cacheManager } from '../_helper/cache'
import { parseQuery } from '../_helper/helper'

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  user: Signal<User | undefined>
  following = signal<Paginator<UserQueryPagination, User>>(default_paginator)
  followers = signal<Paginator<UserQueryPagination, User>>(default_paginator)

  http: HttpClient = inject(HttpClient)
  accountService: AccountService = inject(AccountService)
  private baseApiUrl = environment.baseUrl + 'api/like/'

  constructor() {
    this.user = computed(() => this.accountService.data()?.user)
  }
  public IsFollowing(id: string): boolean {
    const user = this.user()
    if (!user) return false
    const following = (user.following as string[])
    return following.includes(id)
  }

  toggleLike(target_id: string): boolean {
    const user = this.user()
    if (!user) return false
    const url = this.baseApiUrl
    this.http.put(url, { target_id }).subscribe()

    const following = (user.following as string[])
    const isFollowingTarget = following.includes(target_id)
    if (isFollowingTarget) {
      console.log(`remove ${target_id} from following list`)
      user.following = following.filter(id => id !== target_id)
    } else {
      console.log(`add ${target_id} from following list`)
      following.push(target_id)
      user.following = following
    }
    this.accountService.SetUser(user)
    return user.following.includes(target_id)
  }
  getDataFromApi(type: 'following' | 'follower') {
    const setSignal = (cacheData: Paginator<UserQueryPagination, User>) => {
      if (type === 'following')
        this.following.set(cacheData)
      else
        this.followers.set(cacheData)
    }
    const pagination = type === 'following' ? this.following().pagination : this.followers().pagination
    const key = cacheManager.createKey(pagination)
    const cacheData = cacheManager.load(key, type)

    if (cacheData) {
      console.log(`⟶ Load ${type} data from cache`)
      setSignal(cacheData as Paginator<UserQueryPagination, User>)
      return
    }

    console.log(`⟶ Load ${type} data from api`)
    const url = this.baseApiUrl + type + parseQuery(pagination)
    this.http.get<Paginator<UserQueryPagination, User>>(url).subscribe({
      next: response => {
        const key = cacheManager.createKey(response.pagination)
        cacheManager.save(key, type, response)
        setSignal(response)
      }
    })
  }

  getFollowers() {
    this.getDataFromApi('follower')
  }
  getFollowing() {
    this.getDataFromApi('following')
  }
}
