import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css'],
})
export class CustomPaginatorComponent implements OnInit {
  private _collectionSize = 0;
  private _pageSize = 5;
  private _currentPage = 1;
  private _maxSize = 2;
  private _firstLastButtons = false;
  private _nextPreviousButtons = true;
  private _small = false;

  totalPages: any[] = [];

  @Output() pageSelected = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    let arrayLength = this.collectionSize / this.pageSize;
    arrayLength = isNaN(arrayLength) ? 0 : arrayLength;
    this.totalPages = new Array(Math.ceil(arrayLength));
  }

  ngOnChanges(changes: SimpleChanges) {
    let arrayLength = this.collectionSize / this.pageSize;
    arrayLength = isNaN(arrayLength) ? 0 : arrayLength;
    this.totalPages = new Array(Math.ceil(arrayLength));
  }

  /** The total number of records */
  @Input()
  public set collectionSize(value: number) {
    this._collectionSize = value;
  }

  public get collectionSize(): number {
    return this._collectionSize;
  }

  /** The number of records to display */
  @Input()
  public set pageSize(value: number) {
    this._pageSize = value;
  }

  public get pageSize(): number {
    return this._pageSize;
  }

  /** Current page */
  @Input()
  public set currentPage(value: number) {
    this._currentPage = value;
  }

  public get currentPage(): number {
    return this._currentPage;
  }

  /** The number of buttons to show either side of the current page */
  @Input()
  public set maxSize(value: number) {
    this._maxSize = value;
  }

  public get maxSize(): number {
    return this._maxSize;
  }

  /** Display the First/Last buttons */
  @Input()
  public set firstLastButtons(value: boolean) {
    this._firstLastButtons = value;
  }

  public get firstLastButtons(): boolean {
    return this._firstLastButtons;
  }

  /** Display the Next/Previous buttons */
  @Input()
  public set nextPreviousButtons(value: boolean) {
    this._nextPreviousButtons = value;
  }

  public get nextPreviousButtons(): boolean {
    return this._nextPreviousButtons;
  }

  /** Display small pagination buttons */
  @Input()
  public set small(value: boolean) {
    this._small = value;
  }

  public get small(): boolean {
    return this._small;
  }

  /** Set page number */
  public selectPageNumber(pageNumber: number) {
    this.currentPage = pageNumber;
    this.pageSelected.emit(pageNumber);
  }

  /** Set next page number */
  public next() {
    const nextPage = this.currentPage + 1;
    nextPage <= this.totalPages.length && this.selectPageNumber(nextPage);
  }

  /** Set previous page number */
  public previous() {
    const previousPage = this.currentPage - 1;
    previousPage >= 1 && this.selectPageNumber(previousPage);
  }
}
