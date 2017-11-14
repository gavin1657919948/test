import { NgModule } from '@angular/core'
import { Store } from '@ngrx/store'

const moduleName = 'kpi'

const link = (...links) => (['/', moduleName, ...links])

export const navLinks = [
  { icon: 'icon-note', title: 'Facilities', link: 'facilities', type: 'warning' },
  { icon: 'icon-info', title: 'Alerts', link: 'alerts', type: 'danger' },
  { icon: 'icon-bubble', title: 'Notifications', link: 'notifications', type: 'success' },
]

const moduleConfig = {
  name: 'Kpi',
  icon: 'icon-wrench',
  packageName: `@colmena/module-admin-${moduleName}`,
  topLinks: [
    { weight: 8, label: 'Kpi', icon: 'icon-wrench', link: link() }
  ],
  sidebarLinks: [
    { weight: 8, label: 'Kpi', icon: 'icon-wrench', link: link() }
  ],
  dashboardLinks: {
    system: [
      { label: 'Kpi', type: 'danger', icon: 'icon-wrench', link: link() }
    ]
  },
}
@NgModule()
export class KpiConfigModule {
  constructor(protected store: Store<any>) {
    this.store.dispatch({ type: 'APP_LOAD_MODULE', payload: { moduleName, moduleConfig } })
  }
}
