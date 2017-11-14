import { Component, ViewChild, OnInit } from '@angular/core'
import { FormService, UiService } from '@colmena/admin-ui'
import { FacilitiesService } from '../facilities.service'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-kpi-facility-list',
  template: `
    <div class="card">
      <div class="card-block">
        <ui-data-grid #grid (action)="action($event)" [service]="service"></ui-data-grid>
      </div>
    </div>
`,
  styles: []
})
export class FacilityListComponent implements OnInit {
  @ViewChild('grid') private grid

  public facilities = [1, 2, 3]
  constructor(
    private formService: FormService,
    private ui: UiService,
    private service: FacilitiesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.service.domain = { id: 'default' }
    this.service.getFiles()
  }

  ngOnInit() {

  }

  action(event) {
    switch (event.action) {
      case 'edit':
        return this.router.navigate([event.item.id], {
          relativeTo: this.route.parent,
        })
      case 'add':
        return this.router.navigate(['create'], {
          relativeTo: this.route.parent,
        })
      case 'delete':
        const successCb = () =>
          this.service.deleteItem(
            event.item,
            () => this.grid.refreshData(),
            err => this.ui.alerts.notifyError({
              title: 'Error Deleting item',
              body: err.message,
            })
          )
        const question = {
          title: 'Are You Sure?',
          text: 'The action can not be undone.',
        }
        return this.ui.alerts.alertQuestion(question, successCb, () => ({}))
      default:
        return console.log('Unknown Event Action', event)
    }
  }
}
