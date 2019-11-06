import { Component, OnInit } from '@angular/core';
import { IState } from 'src/app/core/models/state';
import { ConstantsService } from 'src/app/core/core.module';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.scss']
})
export class LeftPaneComponent implements OnInit {

  states: IState[];
  selectedState = 'National';
  constructor(
    private constantsService: ConstantsService,
  ) { }

  ngOnInit() {
    this.states = this.constantsService.getStates();
  }

  onStateChange(selectedState: string) {
    console.log(selectedState);
  }

}
