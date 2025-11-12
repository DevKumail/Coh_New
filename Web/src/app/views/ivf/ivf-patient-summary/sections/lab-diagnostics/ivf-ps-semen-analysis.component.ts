import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ivf-ps-semen-analysis',
  standalone: true,
  imports: [CommonModule],
  styles: [`
    .skeleton-loader {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
      border-radius: 4px;
    }
    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
  template: `
    <div class="px-2 py-2">
      <div class="card shadow-sm">
        <div class="card-header">Semen Analysis</div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-bordered text-center table-striped table-sm mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Volume (ml)</th>
                  <th>Concentration (million/ml)</th>
                  <th>Motility (%)</th>
                  <th>Progressive Motility (%)</th>
                  <th>Morphology (%)</th>
                  <th>pH</th>
                  <th>Liquefaction</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody class="table-group-divider">
                <!-- Skeleton Loader -->
                <ng-container *ngIf="isLoading">
                  <tr *ngFor="let i of [1,2,3]">
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                    <td><div class="skeleton-loader" style="height: 20px; width: 100%;"></div></td>
                  </tr>
                </ng-container>
                <!-- Actual Data -->
                <ng-container *ngIf="!isLoading">
                  <tr *ngFor="let r of rows">
                    <td>{{ r.date }}</td>
                    <td>{{ r.time }}</td>
                    <td>{{ r.volume }}</td>
                    <td>{{ r.concentration }}</td>
                    <td>{{ r.motility }}</td>
                    <td>{{ r.progressiveMotility }}</td>
                    <td>{{ r.morphology }}</td>
                    <td>{{ r.ph }}</td>
                    <td>{{ r.liquefaction }}</td>
                    <td>{{ r.notes }}</td>
                  </tr>
                  <tr *ngIf="rows.length===0">
                    <td colspan="10">No data found</td>
                  </tr>
                </ng-container>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class IvfPsSemenAnalysisComponent {
  isLoading = false;
  rows: any[] = [];
}
