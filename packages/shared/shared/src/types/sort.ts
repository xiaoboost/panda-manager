/** 排序方式 */
export enum SortBy {
  name,
  lastModified,
  size,
}

/** 排序选项 */
export interface SortOption {
  by: SortBy;
  asc: boolean;
}
