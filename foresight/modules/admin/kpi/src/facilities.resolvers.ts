import { Injectable } from '@angular/core'
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router'
import { Observable } from 'rxjs/Observable'

import { ContentEvent, FacilitiesService } from './facilities.service'

@Injectable()
export class FacilitiesResolver implements Resolve<ContentEvent> {
  constructor(private service: FacilitiesService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ContentEvent> {
    return this.service.getItem(route.params.id)
  }
}
