import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TableRepresentationComponent } from './tabs/table-representation/table-representation.component';
import { SummedRepresentationComponent } from './tabs/summed-representation/summed-representation.component';
import { GraphicalRepresentationComponent } from './tabs/graphical-representation/graphical-representation.component';

@Component({
  selector: 'app-culture',
  standalone: true,
  imports: [CommonModule, NgbNavModule, TableRepresentationComponent, SummedRepresentationComponent, GraphicalRepresentationComponent],
  templateUrl: './culture.component.html',
  styleUrl: './culture.component.scss'
})
export class CultureComponent {

}
