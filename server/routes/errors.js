'use strict';

class AppError extends Error {
  constructor (message, status) {
    super(message);
    
    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);
    
    // You can use any additional properties you want.
    // I'm going to use preferred HTTP status for this error types.
    // `500` is the default value if not specified.
    this.status = status;
    
  }
}

export class LoginTakenError extends AppError {
  constructor (message) {
    // Providing default message and overriding status code.
    super(message || 'Пользователь с таким логином уже существует.', 400);
  }
}

export class ShopsSaveError extends AppError {
  constructor (message) {
    // Providing default message and overriding status code.
    super(message || 'Данные о торговых точках указаны неверно.', 400);
  }
}

export class LicenceCodesAlreadyExistError extends AppError {
  constructor (message, duplicateCodes) {
    // Providing default message and overriding status code.
    const errorMessage = 'Лицензионные коды уже присутствуют в базе данных.' + 
      (duplicateCodes ? (' Дубликаты: ' + duplicateCodes.join(', ')) : '' );
    super(message || errorMessage, 400);
  }
}

export class NotAllLicencesAvailable extends AppError {
  constructor (message) {
    // Providing default message and overriding status code.
    super(message || 'Лицензионные коды одной или нескольких лицензий отсутствуют в базе. Обратитесь к администратору', 400);
  }
}

export class ServiceNotFound extends AppError {
  constructor (message) {
    // Providing default message and overriding status code.
    super(message || 'Сервис не найден', 400);
  }
}


