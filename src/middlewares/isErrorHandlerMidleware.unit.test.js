import { jest } from "@jest/globals";
import { errorHandler } from "./isErrorHandlerMiddleware.js";


test("should handle UnauthorizedError" , async()=>{

  const req = {};

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const next = jest.fn;
  const controller = jest.fn().mockImplementation(()=>{
    
    const err = new Error('invalid token');
    err.name = 'UnauthorizedError';
    throw err;
  });

  await errorHandler(controller)(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
});

test("should handle NotFoundError" , async()=>{

  const req = {};

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const next = jest.fn;
  const controller = jest.fn().mockImplementation(()=>{
    
    const err = new Error('Not found');
    err.name = 'NotFoundError';
    throw err;
  });

  await errorHandler(controller)(req, res, next);

  expect(res.status).toHaveBeenCalledWith(404);
});

test("should handle ForbiddenError" , async()=>{

  const req = {};

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const next = jest.fn;
  const controller = jest.fn().mockImplementation(()=>{
    
    const err = new Error('forbidden error');
    err.name = 'ForbiddenError';
    throw err;
  });

  await errorHandler(controller)(req, res, next);

  expect(res.status).toHaveBeenCalledWith(403);
});

test("should handle InternalServerError" , async()=>{

  const req = {};

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const next = jest.fn;
  const controller = jest.fn().mockImplementation(()=>{
    
    const err = new Error('Something went wrong');
    err.name = 'InternalServerError';
    throw err;
  });

  await errorHandler(controller)(req, res, next);

  expect(res.status).toHaveBeenCalledWith(500);
});