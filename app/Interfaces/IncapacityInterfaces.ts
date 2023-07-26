export interface IIncapacity {
  id?: number;
  employmentId: number;
}

export interface IIncapacityFilters {
  page: number;
  perPage: number;
  employmentId: number;
}
