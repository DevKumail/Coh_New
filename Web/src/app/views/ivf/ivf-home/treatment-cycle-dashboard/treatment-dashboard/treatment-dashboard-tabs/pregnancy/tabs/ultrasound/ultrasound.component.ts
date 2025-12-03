import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ultrasound',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ultrasound.component.html',
  styleUrl: './ultrasound.component.scss'
})
export class UltrasoundComponent {
  carouselId = 'ultrasoundCarousel';
  images: { src: string; alt: string; name: string }[] = [
    { src: 'assets/images/placeholder-image.png', alt: 'Ultrasound 1', name: 'US_2025_001.png' },
    { src: 'assets/images/placeholder-image.png', alt: 'Ultrasound 2', name: 'US_2025_002.png' },
    { src: 'assets/images/placeholder-image.png', alt: 'Ultrasound 3', name: 'US_2025_003.png' },
    { src: 'assets/images/placeholder-image.png', alt: 'Ultrasound 4', name: 'US_2025_004.png' },
    { src: 'assets/images/placeholder-image.png', alt: 'Ultrasound 5', name: 'US_2025_005.png' },
    { src: 'assets/images/placeholder-image.png', alt: 'Ultrasound 6', name: 'US_2025_006.png' },
    { src: 'assets/images/placeholder-image.png', alt: 'Ultrasound 7', name: 'US_2025_007.png' },
    { src: 'assets/images/placeholder-image.png', alt: 'Ultrasound 8', name: 'US_2025_008.png' },
  ];
}
