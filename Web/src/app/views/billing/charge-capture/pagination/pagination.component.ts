import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems!: number;
  @Input() pageSize: number = 10; // Fixed page size
  @Output() pageData = new EventEmitter<{ start: number, end: number, currentPage: number }>();

  currentPage: number = 1;
  pageNumbers: number[] = [];

  ngOnChanges() {
  // this.pageSize = this.initialPageSize;
    this.generatePageNumbers();
    this.emitPageData();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get start(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get end(): number {
    return Math.min(this.start + this.pageSize, this.totalItems);
  }

  generatePageNumbers() {
    this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  emitPageData() {
    this.pageData.emit({
      start: this.start,
      end: this.end,
      currentPage: this.currentPage
    });
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.emitPageData();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.emitPageData();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.emitPageData();
    }
}

onPageSizeChange(event: any) {
  this.pageSize = +event.target.value;
  this.currentPage = 1;
  this.generatePageNumbers();
  this.emitPageData();
  }

}
