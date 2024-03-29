import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../core/services/location.service';
import { Observable, of } from 'rxjs';
import { LayoutService } from 'src/app/core/services/layout.service';
@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  constructor(
    private locationService: LocationService,
    private layoutService: LayoutService
  ) {
    this.isAuthenticated$ = of(true);
  }

  ngOnInit() {}

  toggleDrawer() {
    this.layoutService.toggleDrawer();
  }

  goBack() {
    this.locationService.goBack();
  }
}
