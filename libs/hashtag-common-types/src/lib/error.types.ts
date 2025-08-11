export interface IError {
  name: string;
  message: string;
  errors: string[];
  statusCode: number;
  isOperationalError: boolean;
}
