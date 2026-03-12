/**
 * Test user credentials and data fixtures.
 *
 * These are the publicly documented credentials for the FashionHub demo app.
 * In a real project this would be loaded from a secrets vault or encrypted file.
 */

export interface UserCredentials {
  username: string;
  password: string;
}

export const validUser: UserCredentials = {
  username: 'demouser',
  password: 'fashion123',
};

export const invalidUsers = {
  wrongPassword: {
    username: 'demouser',
    password: 'wrongpassword',
  } as UserCredentials,

  wrongUsername: {
    username: 'nonexistentuser',
    password: 'fashion123',
  } as UserCredentials,

  emptyCredentials: {
    username: '',
    password: '',
  } as UserCredentials,

  emptyUsername: {
    username: '',
    password: 'fashion123',
  } as UserCredentials,

  emptyPassword: {
    username: 'demouser',
    password: '',
  } as UserCredentials,
};
