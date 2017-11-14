import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { StoreModule } from '@ngrx/store';
// import { EffectsModule } from '@ngrx/effects';
// import { facilitiesReducer } from './+state/facilities.reducer';
// import { facilitiesInitialState } from './+state/facilities.init';
// import { FacilitiesEffects } from './+state/facilities.effects';

import { FormsModule } from '@angular/forms'
import { ColmenaUiModule } from '@colmena/admin-ui'
import { KpiRoutingModule } from './kpi-routing.module'

import { AlertComponent } from './components/alert.component'
import { DashboardComponent } from './components/dashboard.component'
import { FacilityListComponent } from './components/facility-list.component'
import { FacilityFormComponent } from './components/facility-form.component'
import { IndexComponent } from './components/index.component'
import { NotifyComponent } from './components/notifications.component'

import { HasKpiAccess } from './kpi.guards'
import { FacilitiesService } from './facilities.service'
import { FacilitiesResolver } from './facilities.resolvers'


@NgModule({
  imports: [
    CommonModule,
    //StoreModule.forFeature('facilities', facilitiesReducer, { initialState: facilitiesInitialState }),
    //EffectsModule.forFeature([FacilitiesEffects]),
    FormsModule,
    ColmenaUiModule,
    KpiRoutingModule,
  ],
  declarations: [
    AlertComponent,
    DashboardComponent,
    FacilityListComponent,
    FacilityFormComponent,
    IndexComponent,
    NotifyComponent,
  ],
  providers: [
    HasKpiAccess,
    FacilitiesService,
    FacilitiesResolver,
    //FacilitiesEffects
  ]
})
export class KpiModule { }
