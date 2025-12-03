import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BirthComponent as BirthTabComponent } from './tabs/birth/birth.component';
import { FollowUpComponent } from './tabs/follow-up/follow-up.component';

@Component({
  selector: 'app-birth',
  standalone: true,
  imports: [CommonModule, BirthTabComponent, FollowUpComponent],
  templateUrl: './birth.component.html',
  styleUrl: './birth.component.scss'
})
export class BirthComponent {
  @ViewChild(BirthTabComponent) birthTab?: BirthTabComponent;
  @ViewChild(FollowUpComponent) followUpTab?: FollowUpComponent;

  onSave() {
    const birth = this.birthTab ? (this.birthTab as any).form?.getRawValue?.() : null;
    const followUp = this.followUpTab ? (this.followUpTab as any).form?.getRawValue?.() : null;
    const payload = { birth, followUp };
    console.log('Birth save:', payload);
    // TODO: send payload to API
  }
}
