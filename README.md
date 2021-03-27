# Polydian Backend
A server to generate new notes out of any website.

## Database schema

- User table schema
```
  username: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  hash: {type: String, required: true},
  salt: {type: String, required: true}
```
- AuthToken table schema
```
  authToken: {type: String, required: true},
  username: {type: String, required: true}
```

## API Endpoints

#### ```/users/all```
An API endpoint to fetch all users

#### ```/users/create```
An API endpoint that creates a new entry in the users table and an entry in the auth token table for the user.

#### ```/users/delete/all```
An API endpoint that deletes all users and auth tokens from the users table and the auth token tables.

#### ```/users/login```
An API endpoint to authenticate a user, and return an auth token corresponding to the user.

#### ```/users/password/update```
An API endpoint to update password for a user.

