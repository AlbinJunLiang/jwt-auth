
<center>
  <h1>Design and Implementation of an Authentication System Using REST API and JSON Web Tokens</h1>
</center>

> This repository reviews the theory behind a simple token-based authentication system. The studied functionalities include user registration, login, password change, and account recovery using a one-time password (OTP). It also includes the use of `refresh tokens` for access token renewal.

---

## Table of Contents

1. [Description](#description)
2. [Important Security Aspects](#important-security-aspects)
   1. [Token Storage Strategy](#important-security-aspects)
   2. [Token Expiration Policy](#important-security-aspects)
   3. [Cookie Configuration](#important-security-aspects)
   4. [CORS Configuration](#cors-configuration)
3. [Authentication Method Design](#authentication-method-design)
   1. [System Components](#authentication-method-design)
   2. [Database Design](#authentication-method-design)
   3. [Backend Framework](#authentication-method-design)
4. [Functionality Diagrams](#functionality-diagrams)
   1. [User Registration](#1-new-user-registration)
   2. [User Authentication](#2-user-authentication)
   3. [Authenticated Password Change](#3-authenticated-password-change)
   4. [Account Recovery](#4-account-recovery)
      1. [Recovery Flow](#recovery-flow)
   5. [Session Refresh Method](#session-refresh-method)
   6. [Autonomous Access Token Update](#autonomous-access-token-update)
   7. [Session Expiration Detection](#session-expiration-detection)
5. [References](#references)

---

## Description

This exercise is implemented using **Express.js**; however, in theory, it can be applied to other backend frameworks and server-side programming languages.

## Important Security Aspects

In production environments, it is recommended not to store tokens directly in the browser. Instead, **cookies** with the `HttpOnly` attribute should be used to prevent them from being accessed or compromised through **XSS** attacks.

Regarding tokens, it is recommended to define expiration times:
- `access_token`: **10–30 minutes**
- `refresh_token`: **7–15 days**

The minimum recommended **cookie configurations** are:

- **httpOnly**: `true`  
  Prevents access through `document.cookie` and blocks XSS attacks.
- **secure**: `true`  
  Ensures cookies are only sent over **HTTPS**.
- **sameSite**: `'strict'` / `'lax'`  
  Controls whether cookies are sent with cross-site requests.  
  `'Strict'` is more secure, while `'Lax'` offers a balanced default.
- **maxAge**:  
  Defines the cookie expiration time.

When consuming the API, the client must include:

```js
credentials: 'include'
````

Otherwise, the server will reject the request.

### CORS Configuration

To prevent unauthorized use of the service from other domains:

* **origin**: Defines allowed domains.
  Using `*` disables cookie usage.
* **credentials**: Must be set to `true` to allow cookies.
* **methods**: Defines allowed HTTP methods (GET, POST, PUT, DELETE, etc.).

Using an **ORM** such as Sequelize helps mitigate **SQL injection** attacks.

## Authentication Method Design

Main components:

* **Database:**
  Stores user email, **hashed** password, role, and other relevant data.
  In this implementation, the `refresh_token` is an **opaque token** stored in the database.
  The **OTP** used for account recovery is also stored.

* **Backend framework:**
  Environments such as **Node.js** or **.NET** are required to manage HTTPS requests, generate tokens, and enforce access control.

## Functionality Diagrams

### 1. New User Registration

1. **Data persistence:**
   User data is stored in the database.
2. **Security (hashing):**
   The password is stored using hashing algorithms such as bcrypt.
3. **Automatic login (optional):**

   * The controller invokes the authentication service.
   * `access` and `refresh` tokens are generated.
   * Improves user experience (UX).

<p align="center">
  <img src="docs/register.png" width="80%" title="Register">
</p>

### 2. User Authentication

The user submits their **email and password**.
If the credentials are valid, the system generates an **access token** and a **refresh token**, which is stored in the database along with its expiration date.

<p align="center">
  <img src="docs/login.png" width="80%" title="Login">
</p>

### 3. Authenticated Password Change

The process uses the **access token** to identify the user:

1. **Restricted access:** Only authenticated users can change their password.
2. **Integrity:** The user identity is extracted directly from the signed token.

<p align="center">
  <img src="docs/update.png" width="80%" title="Update">
</p>

### 4. Account Recovery

The user requests a six-digit **OTP** code, which is sent to their email address.
This code allows identity validation without prior system access.

If the code expires, the user must request a new one.

#### Recovery Flow

```pseudocode
START
  request email
  generate OTP
  send OTP
  wait for OTP and new password

  IF OTP is valid AND not expired THEN
      update password
      mark OTP as used
  ELSE
      show error
  END IF
END
```

## Session Refresh Method

When the **access token** expires and the server responds with `401` or `403`, the client uses the **refresh token** to obtain new tokens.

```pseudocode
FLOW SessionRenewal

START
  client requests resource with access token

  IF access token is valid
      allow access
  ELSE
      request refresh token

      IF refresh token is valid
          generate new tokens
          retry request
      ELSE
          redirect to login
      END IF
  END IF
END
```

## Autonomous Access Token Update

Two approaches can be used:

* **Time-based validation:**
  The client detects when the token is close to expiring and proactively requests a new one.

* **Request-based renewal:**
  Upon receiving a `401` or `403` response, token renewal is triggered automatically using an interceptor or asynchronous function.

## Session Expiration Detection

A session is considered expired when:

* The token has expired, or
* Token renewal fails after receiving an unauthorized response.

In both cases, the system redirects the user to the login page.

## References

* Ayebola, J. (2025, November 25). *How to Build a Secure Authentication System with JWT and Refresh Tokens*. freeCodeCamp.org.
  [https://www.freecodecamp.org/news/how-to-build-a-secure-authentication-system-with-jwt-and-refresh-tokens/](https://www.freecodecamp.org/news/how-to-build-a-secure-authentication-system-with-jwt-and-refresh-tokens/)

* JWT. (2024, November 30). *JSON Web Token Introduction*. JWT.io.
  Retrieved January 14, 2026, from [https://www.jwt.io/introduction](https://www.jwt.io/introduction)

* S, T. (2018, February 26). *Where to store access-token in React.js?* Stack Overflow.
  [https://stackoverflow.com/questions/48983708/where-to-store-access-token-in-react-js](https://stackoverflow.com/questions/48983708/where-to-store-access-token-in-react-js)

