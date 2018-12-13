export type Context = string | object;

export type Type = string | string[];

export interface Distribution {
  '@type': Type;
  _byteSize: number;
  _digest: {
    _algorithm: string;
    _value: string;
  };
  _downloadURL: string;
  _mediaType: string;
  _originalFileName: string;
}

export interface PaginationSettings {
  from: number;
  size: number;
}

export interface PaginatedList<T> {
  total: number;
  results: T[];
}
