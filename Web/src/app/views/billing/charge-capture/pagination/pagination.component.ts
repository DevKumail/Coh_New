import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
   imports: [CommonModule,FormsModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
 @Input() totalItems!: number;
@Input() pageSizeOptions: number[] = [10, 25, 50];
@Input() initialPageSize: number = 10;
@Output() pageData = new EventEmitter<{ start: number, end: number, currentPage: number, pageSize: number }>();

currentPage: number = 1;
pageSize: number = 10;
pageNumbers: number[] = [];

ngOnChanges() {
  this.pageSize = this.initialPageSize;
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
  const endValue = this.start + this.pageSize;
  return endValue > this.totalItems ? this.totalItems : endValue;
}

generatePageNumbers() {
  this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
}

emitPageData() {
  this.pageData.emit({
    start: this.start,
    end: this.end,
    currentPage: this.currentPage,
    pageSize: this.pageSize
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
