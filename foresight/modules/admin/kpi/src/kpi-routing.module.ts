import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HasKpiAccess } from './kpi.guards'

import { AlertComponent } from './components/alert.component'
import { DashboardComponent } from './components/dashboard.component'
import { FacilityListComponent } from './components/facility-list.component'
import { FacilityFormComponent } from './components/facility-form.component'
import { IndexComponent } from './components/index.component'
import { NotifyComponent } from './components/notifications.component'

import { FacilitiesResolver } from './facilities.resolvers'


export const routes: Routes = [{
  path: '',
  canActivate: [HasKpiAccess],
  children: [
    {
      path: '',
      component: IndexComponent,
      data: {
        title: 'kpi',
      },
      children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        {
          path: 'alerts',
          component: AlertComponent,
          data: { title: 'Alerts' }
        },
        {
          path: 'dashboard',
          component: DashboardComponent,
          data: { title: 'Dashboard' }
        },
        {
          path: 'facilities',
          data: { title: 'Facilities' },
          children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            {
              path: 'list',
              component: FacilityListComponent,
              data: { title: 'List' },
            },
            {
              path: 'create',
              component: FacilityFormComponent,
              data: { title: 'Create' },
            },
            {
              path: ':id',
              data: { title: 'Facility' },
              resolve: {
                facility: FacilitiesResolver,
              },
              component: FacilityFormComponent
            }
          ]
        },
        {
          path: 'notifications',
          component: NotifyComponent,
          data: { title: 'Notifications' }
        },
      ]
    },
  ],
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KpiRoutingModule { }
