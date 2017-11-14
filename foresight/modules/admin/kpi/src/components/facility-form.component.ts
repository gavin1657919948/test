import { Component, OnInit } from '@angular/core'
import { FormService, UiService } from '@colmena/admin-ui'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-kpi-facility-form',
  template: `
    <div class="col-md-6">
    facility-form
    </div>
    <div class="col-md-6">
    asdf
    </div>
  `,
  styles: []
})
export class FacilityFormComponent implements OnInit {

  public item: any = {}
  public formConfig: any = {}

  constructor(
    private formService: FormService,
    private ui: UiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('this.route.snapshot.data=', this.route.snapshot.data)
  }

  handleAction(event) {

  }
}
