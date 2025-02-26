import { HttpClient } from '@angular/common/http'
import { inject, Injectable, signal } from '@angular/core'
import { environment } from '../../environments/environment'
import { default_paginator, Paginator, UserQueryPagination } from '../_models/pagination'
import { User } from '../_models/user'
import { cacheManager } from '../_helper/cache'
import { parseQuery, parseUserPhoto } from '../_helper/helper'
import { firstValueFrom } from 'rxjs'

type dataCategory = 'member' | 'follower' | 'following'
@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient)
  private url = environment.baseUrl + 'api/' //user
  paginator = signal<Paginator<UserQueryPagination, User>>(default_paginator)
  private getData(category: dataCategory) {
    const pagination = this.paginator().pagination
    //cache
    let key = cacheManager.createKey(pagination)
    const cacheData = cacheManager.load(key, category)
    if (cacheData) {
      console.log(`load ${category} from cache !!`)
      this.paginator.set(cacheData as Paginator<UserQueryPagination, User>)
      return
    }
    //get from server
    console.log(`load ${category} from server !!`)
    const url = this.url + 'user/' + parseQuery(pagination)
    this.http.get<Paginator<UserQueryPagination, User>>(url).subscribe({
      next: response => {
        key = cacheManager.createKey(pagination)
        cacheManager.save(key, category, response)
        this.paginator.set(response)
      }
    })
  }

  getMembers() {
    this.getData('member')
  }
  async getMemberByUsername(username: string): Promise<User | undefined> {
    const member = this.paginator().items.find(obj => obj.username === username)
    if (member) {
      console.log('get from cache')
      return member
    } else {
      console.log('get from api')
      try {
        const url = this.url + 'user/' + username
        const _member = await firstValueFrom(this.http.get<User>(url))
        return parseUserPhoto(_member)
      } catch (error) {
        console.error('Get member Error', error)
      }
    }
    return undefined
  }
}
