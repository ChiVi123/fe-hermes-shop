export enum HeaderKeys {
  Authorization = 'Authorization',
  ContentType = 'Content-Type',
}
export enum ContentType {
  Json = 'application/json',
  FormUrlEncoded = 'application/x-www-form-urlencoded',
  MultipartFormData = 'multipart/form-data',
}
export enum FetchMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export const FETCH_ERROR = Symbol();
