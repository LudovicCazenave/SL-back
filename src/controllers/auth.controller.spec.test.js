import { authController } from "./auth.controller.js";
import { jest } from "@jest/globals";
import { jwtMiddleware } from "../middlewares/jwtMiddleware.js";
import jwt from "jsonwebtoken";
import argon2 from 'argon2';
import { User } from "../models/user.model.js";


test("should add successfully new customer to the database", async() => {
  const req = {
    body : {
      email: "ludovic.cazenave@oclock.school",
      password: "Azerty12@",
      firstname: "Ludovic",
      gender: "Homme",
      age: 60,
      height: 180,
      marital: "Séparé",
      pet: true,
      city: "MARSEILLE",
      gender_match: "Femme",
      labels: ["Nature", "Culturel"]
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.signUp(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
});

test("should return an error missed field", async()=> {
  const req = {
    body : {
      email: "ludovic@oclock.school",
      password: "Azerty12@",
      firstname: "Ludovic",
      gender: "Homme",
      age: 60,
      height: 180,
      marital: "Séparé",
      pet: true,
      city: "MARSEILLE"
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  }

  await authController.signUp(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

test("should return an error password too short", async()=> {
  const req = {
    body : {
      email: "ludovic@mail.com",
      password: "Azey12@",
      firstname: "Ludovic",
      gender: "Homme",
      age: 60,
      height: 180,
      marital: "Séparé",
      pet: true,
      city: "MARSEILLE",
      gender_match: "Femme"
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.signUp(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

test("should return an error email already in the database", async() => {
  const req = {
    body : {
      email: "claude65@example.com",
      password: "Cl@ude1958!",
      firstname: "Ludovic",
      gender: "Homme",
      age: 60,
      height: 180,
      marital: "Séparé",
      pet: true,
      city: "MARSEILLE",
      gender_match: "Femme"
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.signUp(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

test("should return an error email does not exist in the database", async() => {
  const req = {
    body : {
      email: "claude@example.com",
      password: "Cl@ude1958!",
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.signIn(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
});

test("should return 404 if password is not good", async() => {
  const req = {
    body : {
      email: "claude@example.com",
      password: "Cl@ude195!",
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.signIn(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
});

test("should return 200 if password is correct and generate JWT", async() => {
  const req = {
    body : {
      email: "claude@example.com",
      password: "Cl@ude1958!",
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    cookie: jest.fn()
  };

  const user = {
    password: await argon2.hash("Cl@ude1958!"),
    firstname: "Claude",
    id: "3"
  };

 
  jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(user))
  jest.spyOn(argon2, 'verify').mockResolvedValue(true); // Simulate valid password
  jest.spyOn(jwt, 'sign').mockReturnValue("fake.jwt.token");

  await authController.signIn(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ 
    message: 'Connexion réussie.', 
    logged: true, 
    pseudo: user.firstname,
    token: "fake.jwt.token"
  });
  expect(res.cookie).toHaveBeenCalledWith("token", "fake.jwt.token", expect.objectContaining({
    maxAge: 1000 * 60 * 60 * 3,
    httpOnly: true
  }));
});

test("Should return 400 if password is missing", async() => {
  const req = {
    body : {
      email: "claude@example.com",
    }
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.signIn(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
});

test("Should return 200 and user info if token is valid", async () => {
  const req = {
    user: {
      userId: "12345",
      firstname: "John",
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.verifyToken(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ userId: "12345", firstname: "John" });
});

test("Should return 401 if token is invalid", async () => {
  const req = {};
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.verifyToken(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide.' });
});

test("Should clear cookie and return 200 on logout", async () => {
  const req = {};
  const res = {
    clearCookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  await authController.logout(req, res);

  expect(res.clearCookie).toHaveBeenCalledWith('token', { httpOnly: true });
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Succès' });
});

test("Should call next if token is valid", () => {
  const req = {
    cookies: {
      token: "valid.token.here",
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();
  
  jest.spyOn(jwt, 'verify').mockReturnValue({ userId: "12345", firstname: "John" });
  
  jwtMiddleware(req, res, next);
  
  expect(req.user).toEqual({ userId: "12345", firstname: "John" });
  expect(next).toHaveBeenCalled();
});

test("Should return 401 if token is invalid", () => {
  const req = {
    cookies: {
      token: "invalid.token.here",
    }
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  jest.spyOn(jwt, 'verify').mockImplementation(() => {
    throw new Error("Invalid token");
  });

  jwtMiddleware(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: 'Token invalide.' });
  expect(next).not.toHaveBeenCalled();
});

test("Should return 401 if token is not provided", () => {
  const req = {
    cookies: {}
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  const next = jest.fn();

  jwtMiddleware(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: 'Token non fourni.' });
  expect(next).not.toHaveBeenCalled();
});