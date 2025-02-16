# Mobile Sebaa Backend

Welcome to the Mobile Sebaa System Backend!

## Live URL https://mobile-sebaa-backend.vercel.app/

Live URL is

## Features

- User Authentication: Sign up, log in, and profile management.
- Admin Features: Create, update, and delete Shop entries.

- Authorization: Ensure users and admins can only access their permitted routes.
- Comprehensive Error Handling: Includes validation errors, not found routes, and general error responses.
- Data Validation: Uses Zod for input validation ensuring data consistency.

## Technology Stack

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **ODM & Validation Library:** Mongoose for MongoDB, Zod
- **Package Management:** npm
- **Authentication:** JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- **Node.js**
- **MongoDB**
- **npm**

## Admin Info

```bash

Admin  "email":"johndoe1@example.com",
Password: password123
```

## API Endpoints

## **User Routes**:

1. **Sign Up**

   - **Route**: /api/auth/signup (POST)
   - **Request Body**:
     ```json
     {
       "name": "John Doe",
       "email": "johndoe2@example.com",
       "phone": "1234567890",
       "password": "password123",
       "country": "Bangladesh"
     }
     ```
   - **Response**:

     ```json
     {
       "success": true,
       "statusCode": 201,
       "message": "Verification code sent to your email.",
       "data": {
         "name": "John Doe",
         "email": "johndoe2@example.com",
         "phone": "1234567890",
         "role": "User",
         "status": "in-progress",
         "isDeleted": false,
         "isVerified": false,
         "country": "Bangladesh",
         "_id": "676685258218b5347c0551e3",
         "createdAt": "2024-12-21T09:06:45.404Z",
         "updatedAt": "2024-12-21T09:06:45.404Z",
         "__v": 0
       }
     }
     ```

2.1. **Sign Up Verify Code**

**If All Ok**

- **Route**: /api/auth/verify-code (POST)
- **Request Body**:

  ```json
  {
    "email": "johndoe2@example.com",
    "code": "123456"
  }
  ```

- **Response**:

       ```json
       {
           "success": true,

  "statusCode": 200,
  "message": "User verified successfully.",
  "data": {
  "\_id": "676bc17635e5c5d4ba1e78fb",
  "name": "johndoe2",
  "email": "johndoe2@example.com",
  "phone": "1234567890",
  "role": "User",
  "status": "in-progress",
  "isDeleted": false,
  "isVerified": true,
  "country": "Bangladesh",
  "createdAt": "2024-12-25T08:25:26.407Z",
  "updatedAt": "2024-12-25T08:26:55.620Z",
  "\_v": 0,
  "password": ""
  }
  }

  ```

  2.2 **Sign Up Verify Code**
  ```

**If Code Expire 2 minutes**

- **Route**: /api/auth/verify-code (POST)
- **Request Body**:

  ```json
  {
    "email": "johndoe2@example.com",
    "code": "123456"
  }
  ```

- **Response**:

  ```json
  {
    "success": false,
    "message": "Invalid verification code.",
    "errorSources": [
      {
        "path": "",
        "message": "Invalid verification code."
      }
    ]
  }
  ```

  3. **Resend Verify Code**

**If Code Expire 2 minutes**

- **Route**: /api/auth/resend-code (POST)
- **Request Body**:

  ```json
  {
    "email": "johndoe2@example.com"
  }
  ```

- **Response**:

  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Verification code resent successfully.",
    "data": {
      "message": "Verification code resent successfully."
    }
  }
  ```

4. **User Login**
   - **Route**: /api/auth/login (POST)
   - **Request Body**:
     ```json
     {
       "email": "johndoe2@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "User is Logged in successfully",
       "data": {
         "_id": "670f8d19ce734daf8c67a449",
         "name": "John Doe",
         "email": "johndoe2@example.com",
         "phone": "1234567890",
         "status": "in-progress",
         "isDeleted": false,
         "createdAt": "2024-10-16T09:53:29.445Z",
         "updatedAt": "2024-10-16T09:53:29.445Z",
         "__v": 0
       },
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJqb2huZG9lMkBleGFtcGxlLmNvbSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTcyOTEwMDc4MCwiZXhwIjoxNzI5OTY0NzgwfQ.4D4WwgiY9KicIOLtXZJDg0AXOMoq82TN6bTJDdJfQrw"
     }
     ```
5. **Forget Password**
   - **Route**: /api/auth/forget-password(POST)
   - **Request Body**:
     ```json
     {
       "email": "johndoe2@example.com"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Password Reset code has been sent successfully."
     }
     ```
6. **Reset Password**
   - **Route**: /api/auth/reset-password(POST)
   - **Request Body**:
     ```json
     {
       "email": "johndoe2@example.com",
       "code": "123456",
       "newPassword": "password001"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Password reset successfully!"
     }
     ```
7. **Get Profile**
   - **Route**: /api/users/me (GET)
   - **Request Headers**: Authorization:Bearer jwt_token
   - **Response**:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "User profile retrieved successfully",
       "data": {
         "_id": "670f8d19ce734daf8c67a449",
         "name": "John Doe",
         "email": "johndoe2@example.com",
         "phone": "1234567890",
         "role": "Admin",
         "status": "in-progress",
         "isDeleted": false,
         "createdAt": "2024-10-16T09:53:29.445Z",
         "updatedAt": "2024-10-16T09:53:29.445Z",
         "__v": 0
       }
     }
     ```
8. **Update Profile**
   - **Route**: /api/users/me (PUT)
   - **Request Headers**: Authorization:Bearer jwt_token
   - **Request Body**:
     ```json
     {
       "name": "John Updated",
       "phone": "0987654325"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Profile updated successfully",
       "data": {
         "_id": "670f8d19ce734daf8c67a449",
         "name": "John Updated",
         "email": "johndoe1@example.com",
         "phone": "0987654325",
         "role": "Admin",
         "status": "in-progress",
         "isDeleted": false,
         "createdAt": "2024-10-16T09:53:29.445Z",
         "updatedAt": "2024-10-16T19:11:06.257Z",
         "__v": 0
       }
     }
     ```
9. **Profile Image** (The application is not working on free hosting; it only functions on servers that support file handling.)

   - **Route**: /api/users/upload-image (PUT)
   - **Request Headers**: Authorization:Bearer jwt_token
   - **Request Body**:

     ```form-data file

     ```

   - **Response**:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Image uploaded successfully",
       "data": {
         "_id": "676bcb8339ac022b416134ac",
         "name": "John",
         "email": "johndoe1@example.com",
         "phone": "1234567890",
         "role": "User",
         "status": "in-progress",
         "isDeleted": false,
         "isVerified": true,
         "country": "Bangladesh",
         "createdAt": "2024-12-25T09:08:19.256Z",
         "updatedAt": "2025-01-10T18:20:36.636Z",
         "__v": 0,
         "profileImg": "https://res.cloudinary.com/dvfnxtovx/image/upload/v1736533235/johndoe1%40example-file-image.jpg"
       }
     }
     ```

10. **GET ALL USER (ADMIN ONLY)**

    - **Route**: /api/users (GET)
    - **Request Headers**: Authorization:Bearer jwt_token
    - **Response**:

      ```json
      {
        "success": true,
      "statusCode": 200,
      "message":  "All User profile retrieved successfully",
      "data": {
         "users": [

             {
                 "_id": "670f8d19ce734daf8c67a449",
                 "name": "John Updated",
                 "email": "johndoe1@example.com",
                 "phone": "0987654325",
                 "role": "Admin",
                 "status": "in-progress",
                 "isDeleted": false,
                 "createdAt": "2024-10-16T09:53:29.445Z",
                 "updatedAt": "2024-10-16T19:11:06.257Z",
                 "__v": 0
             },
             {
                 "_id": "670ff66729b8f919e5f39a4b",
                 "name": "Doe",
                 "email": "doe@example.com",
                 "phone": "1234567890",
                 "role": "User",
                 "status": "in-progress",
                 "isDeleted": false,
                 "createdAt": "2024-10-16T17:22:47.723Z",
                 "updatedAt": "2024-10-16T17:22:47.723Z",
                 "__v": 0
             }
             ...other users...
         ],
         "totalUsers": 9
      }
      }
      ```

11. **DELETE USER**

    - **Route**: /api/users/me (DELETE)
    - **Request Headers**: Authorization:Bearer jwt_token
    - **Response**:

      ```json
      {
        "success": true,
        "statusCode": 200,
        "message": "User Deleted successfully",
        "data": {
          "_id": "670ff66729b8f919e5f39a4b",
          "name": "Doe",
          "email": "doe@example.com",
          "phone": "1234567890",
          "role": "User",
          "status": "in-progress",
          "isDeleted": true,
          "createdAt": "2024-10-16T17:22:47.723Z",
          "updatedAt": "2024-10-16T20:15:56.936Z",
          "__v": 0
        }
      }
      ```

12. **Blocked USER (ADMIN ONLY)**

    - **Route**: /api/users/status (PUT)
    - **Request Headers**: Authorization:Bearer jwt_token
    - **Request Body**:

    ```json
    {
      "email": "doe@example.com",
      "status": "blocked" or "in-progress"
    }
    ```

    - **Response**:

      ```json
      {
        "success": true,
        "statusCode": 200,
        "message": "User status successfully updated to blocked.",
        "data": {
          "_id": "670ff66729b8f919e5f39a4b",
          "name": "Doe",
          "email": "doe@example.com",
          "phone": "1234567890",
          "role": "User",
          "status": "blocked",
          "isDeleted": true,
          "createdAt": "2024-10-16T17:22:47.723Z",
          "updatedAt": "2024-10-16T21:03:01.869Z",
          "__v": 0
        }
      }
      ```

## **Shop Routes**:

1.  **Create Shop (Admin and Sp Only)**

        - **Route**: /api/shop/create-shop (POST)
        - **Request Headers**: Authorization:Bearer jwt_token
        - **Request Body**:

    possible Value of
    ServiceCategory {
    DisplayProblem = 'Display Problem',
    MotherboardProblem = 'Motherboard Problem',
    TouchPadProblem = 'Touch pad Problem',
    NetworkProblem = 'Network Problem',
    GreenLineIssue = 'Green line Issue',
    ChargingProblem = 'Charging Problem',
    CameraProblem = 'Camera Problem',
    BatteryProblem = 'Battery Problem',
    Other = 'Other',
    }

    ````json
    {
    "ownerName": "John Doe",
    "shopName": "ProFit Sports",
    "address": "123 Main Street, Springfield",
    "notes": "Specializes in fitness equipment and sportswear",
    "mobile": "1234567890",

            "shopLocation": {
              "lat": 37.7749,
              "long": -122.4194
            },

            "selectedDivision": "North Division",
            "selectedDistrict": "Springfield District",
            "selectedTown": "Downtown",
            "serviceCategory": ["Display Problem", "Other"]
          }
          ```
    ````

- **Response**:

  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Shop registered successfully Please Wait For Admin Approve",
    "data": {
      "createdBy": "670f8d19ce734daf8c67a449",
      "ownerName": "John Doe",
      "shopName": "ProFit Sports",
      "address": "123 Main Street, Springfield",
      "notes": "Specializes in fitness equipment and sportswear",
      "mobile": "1234567890",
      "shopLocation": {
        "lat": 37.7749,
        "long": -122.4194
      },
      "selectedDivision": "North Division",
      "selectedDistrict": "Springfield District",
      "selectedTown": "Downtown",
      "serviceCategory": ["Display Problem", "Other"],
      "isDeleted": false,
      "status": "Pending",
      "_id": "671234f432776724a262563d",
      "addDate": "2024-10-18T10:14:12.126Z",
      "createdAt": "2024-10-18T10:14:12.135Z",
      "updatedAt": "2024-10-18T10:14:12.135Z",
      "__v": 0
    }
  }
  ```

2. **Get Shop Which is Created By Sp(Service Provider)**

   - **Route**: /api/shop/my-shop (GET)
   - **Request Headers**: Authorization:Bearer jwt_token
   - **Response**:

     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Shop Information retrieved successfully",
       "data": {
         "shopLocation": {
           "lat": 37.7749,
           "long": -122.4194
         },
         "_id": "671234f432776724a262563d",
         "createdBy": "670f8d19ce734daf8c67a449",
         "ownerName": "John Doe",
         "shopName": "ProFit Sports",
         "address": "123 Main Street, Springfield",
         "notes": "Specializes in fitness equipment and sportswear",
         "mobile": "1234567890",
         "selectedDivision": "North Division",
         "selectedDistrict": "Springfield District",
         "selectedTown": "Downtown",
         "serviceCategory": ["Display Problem", "Other"],
         "isDeleted": false,
         "status": "Pending",
         "addDate": "2024-10-18T10:14:12.126Z",
         "createdAt": "2024-10-18T10:14:12.135Z",
         "updatedAt": "2024-10-18T10:14:12.135Z",
         "__v": 0
       }
     }
     ```

3. **Update Shop (Admin and Sp(Service Provider) Only)**
   - **Route**: /api/shop/my-shop/:id (PUT)
   - **Request Headers**: Authorization:Bearer jwt_token
   - **Request Body**:
     ```json
     {
       "selectedDivision": "Dhaka",
       "selectedDistrict": "Dhaka",
       "selectedTown": "Gulshan-2"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Shop info updated successfully",
       "data": {
         "shopLocation": {
           "lat": 37.7749,
           "long": -122.4194
         },
         "_id": "671234f432776724a262563d",
         "createdBy": "670f8d19ce734daf8c67a449",
         "ownerName": "John Doe",
         "shopName": "ProFit Sports",
         "address": "123 Main Street, Springfield",
         "notes": "Specializes in fitness equipment and sportswear",
         "mobile": "1234567890",
         "selectedDivision": "Dhaka",
         "selectedDistrict": "Dhaka",
         "selectedTown": "Gulshan-2",
         "serviceCategory": ["Display Problem", "Other"],
         "isDeleted": false,
         "status": "Pending",
         "addDate": "2024-10-18T10:14:12.126Z",
         "createdAt": "2024-10-18T10:14:12.135Z",
         "updatedAt": "2024-10-19T19:13:24.282Z",
         "__v": 0
       }
     }
     ```
4. **Get All Shop**

   - **Route**: /api/shop
   - **Response**:

     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "All Shop retrieved successfully",
       "data": {
         "shop": [
           {
             "serviceCategory": [],
             "isDeleted": false,
             "_id": "66bb0246e2c28886cf28d8d5",
             "shopName": "polin telecom",
             "ownerName": "polin",
             "email": "",
             "mobile": "01714750650",
             "alterMobile": "",
             "address": "Johir complex\n",
             "notes": "",
             "selectedDivision": "Rangpur",
             "selectedDistrict": "Gaibandha",
             "selectedTown": "Gobindaganj",
             "userEmail": "mobilesebabd@gmail.com",
             "status": "Approve",
             "addDate": "2024-08-13T06:50:44.440Z"
           },
           {
             "shopLocation": {
               "lat": 37.7749,
               "long": -122.4194
             },
             "_id": "671234f432776724a262563d",
             "createdBy": "670f8d19ce734daf8c67a449",
             "ownerName": "John Doe",
             "shopName": "ProFit Sports",
             "address": "123 Main Street, Springfield",
             "notes": "Specializes in fitness equipment and sportswear",
             "mobile": "1234567890",
             "selectedDivision": "Dhaka",
             "selectedDistrict": "Dhaka",
             "selectedTown": "Gulshan-2",
             "serviceCategory": ["Display Problem", "Other"],
             "isDeleted": false,
             "status": "Pending",
             "addDate": "2024-10-18T10:14:12.126Z",
             "createdAt": "2024-10-18T10:14:12.135Z",
             "updatedAt": "2024-10-19T19:13:24.282Z",
             "__v": 0
           }

             ...other Shop...
         ],
         "totalShop": 1040
       }
     }
     ```

5. **Search Field**

   - **Route**: /api/shop?searchTerm=Rangpur
   - **Response**:

     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Shop are retrieved successfully",
       "data": {
         "shop": [
           {
             "serviceCategory": [],
             "isDeleted": false,
             "_id": "663c6a633bc2bdd9b614b087",
             "shopName": "sumon telecom",
             "ownerName": "sumon chandro roy",
             "email": "",
             "mobile": "01738255027",
             "alterMobile": "",
             "address": "kha211-12(2nd floor),Zila parished super market, Rangpur",
             "notes": "",
             "selectedDivision": "Rangpur",
             "selectedDistrict": "Rangpur",
             "selectedTown": "Rangpur Sadar",
             "userEmail": "s01717976341@gmail.com",
             "status": "Approve",
             "addDate": "2024-03-26T17:20:34.899Z"
           },

           {
             "serviceCategory": [],
             "isDeleted": false,
             "_id": "663c6a633bc2bdd9b614b085",
             "shopName": "Maliha enterprise",
             "ownerName": "Md. Rana",
             "email": "",
             "mobile": "01773-322283",
             "alterMobile": "",
             "address": "uno-310,(3rd floor),Zila parished super market, Rangpur",
             "notes": "",
             "selectedDivision": "Rangpur",
             "selectedDistrict": "Rangpur",
             "selectedTown": "Rangpur Sadar",
             "userEmail": "s01717976341@gmail.com",
             "status": "Approve",
             "addDate": "2024-03-26T17:20:34.899Z"
           }

              ...other Shop...
         ],
         "totalShop": 156
       }
     }
     ```

6. **Pagination and Limit**

   - **Route**: /api/shop?page=1&limit=3
   - **Response**:

     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Shop are retrieved successfully",
       "data": {
         "shop": [
           {
             "serviceCategory": [],
             "isDeleted": false,
             "_id": "66030466e193a84fdd9e9940",
             "shopName": "Robi telecom",
             "ownerName": "Robi ghos",
             "email": "",
             "mobile": "01811917042",
             "alterMobile": "",
             "address": "B-6,Rajjak plaza (3rd floor)",
             "notes": "",
             "selectedDivision": "Dhaka",
             "selectedDistrict": "Dhaka",
             "selectedTown": "Savar",
             "userEmail": "s01717976341@gmail.com",
             "status": "Approve",
             "addDate": "2024-03-26T17:22:46.858Z"
           },
           {
             "serviceCategory": [],
             "isDeleted": false,
             "_id": "6603049ce193a84fdd9e9941",
             "shopName": "Robi telecom",
             "ownerName": "Niloy",
             "email": "",
             "mobile": "01713709892",
             "alterMobile": "",
             "address": "B-6,Rajjak plaza (3rd floor)",
             "notes": "",
             "selectedDivision": "Dhaka",
             "selectedDistrict": "Dhaka",
             "selectedTown": "Savar",
             "userEmail": "s01717976341@gmail.com",
             "status": "Approve",
             "addDate": "2024-03-26T17:23:41.317Z"
           },
           {
             "serviceCategory": [],
             "isDeleted": false,
             "_id": "661a1efc162f21c775d07af8",
             "shopName": "Mokka telecom",
             "ownerName": "RK kudrat",
             "email": "",
             "mobile": "01772133876",
             "alterMobile": "",
             "address": "A-45,Rajjak plaza (3rd floor)",
             "notes": "",
             "selectedDivision": "Dhaka",
             "selectedDistrict": "Dhaka",
             "selectedTown": "Savar",
             "userEmail": "s01717976341@gmail.com",
             "status": "Approve",
             "addDate": "2024-04-13T05:58:20.781Z"
           }
         ],
         "totalShop": 1039
       }
     }
     ```

7. **Delete Shop(Admin and Sp Only)**
   - **Route**: /api/shop/my-shop/:id (DELETE)
   - **Request Headers**: Authorization:Bearer jwt_token
   - **Response**:
     ```json
     {
       "success": true,
       "statusCode": 200,
       "message": "Shop Deleted successfully",
       "data": {
         "shopLocation": {
           "lat": 37.7749,
           "long": -122.4194
         },
         "_id": "671234f432776724a262563d",
         "createdBy": "670f8d19ce734daf8c67a449",
         "ownerName": "John Doe",
         "shopName": "ProFit Sports",
         "address": "123 Main Street, Springfield",
         "notes": "Specializes in fitness equipment and sportswear",
         "mobile": "1234567890",
         "selectedDivision": "Dhaka",
         "selectedDistrict": "Dhaka",
         "selectedTown": "Gulshan-2",
         "serviceCategory": ["Display Problem", "Other"],
         "isDeleted": true,
         "status": "Pending",
         "addDate": "2024-10-18T10:14:12.126Z",
         "createdAt": "2024-10-18T10:14:12.135Z",
         "updatedAt": "2024-10-19T20:38:43.359Z",
         "__v": 0
       }
     }
     ```
8. **'Approve','Pending','Rejected'(Admin Only)**
   - **Route**: /api/shop/status/:id (PUT)
   - **Request Headers**: Authorization:Bearer jwt_token

- **Request Body**:

  ```json
  {
    "status": "Pending"
  }
  ```

  - **Response**:
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Shop status successfully updated to Pending.",
      "data": {
        "shopLocation": {
          "lat": 37.7749,
          "long": -122.4194
        },
        "_id": "671234f432776724a262563d",
        "createdBy": "670f8d19ce734daf8c67a449",
        "ownerName": "John Doe",
        "shopName": "ProFit Sports",
        "address": "123 Main Street, Springfield",
        "notes": "Specializes in fitness equipment and sportswear",
        "mobile": "1234567890",
        "selectedDivision": "Dhaka",
        "selectedDistrict": "Dhaka",
        "selectedTown": "Gulshan-2",
        "serviceCategory": ["Display Problem", "Other"],
        "isDeleted": true,
        "status": "Pending",
        "addDate": "2024-10-18T10:14:12.126Z",
        "createdAt": "2024-10-18T10:14:12.135Z",
        "updatedAt": "2024-10-19T21:28:56.060Z",
        "__v": 0
      }
    }
    ```

9. **Country Search**
   - **Route**: [/api/country?search=af] (GET)

- **Request Body**:

  - **Response**:
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "All Countries retrieved successfully",
      "data": [
        {
          "_id": "6799ea92c293d78acbe703e7",
          "name": "Afghanistan",
          "code": "AF",
          "dial_code": "+93",
          "flag": "https://flagcdn.com/w320/af.png"
        },
        {
          "_id": "6799ea92c293d78acbe7040c",
          "name": "South Africa",
          "code": "ZA",
          "dial_code": "+27",
          "flag": "https://flagcdn.com/w320/za.png"
        }
      ]
    }
    ```
