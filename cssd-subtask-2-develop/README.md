# CSSD Subtask 2
Case Studies in Software Design: Subtask 2.

Base Requirements:
1) Automatically storing data from a single sensor. 
Your developed system should be able to automatically (e.g. at a set time interval) store data from a single (simulated) sensor.

2) Manually enter health data. 
A user should be able to manually enter some health data which should be stored in the system.

3) Viewing health data history. 
A health professional should be able to select a patient and view that patients health data history (e.g. sensor values over time).

<br>

# API Installation

The API portion of this project requires node.js to be installed on the host system. Visit the official [Node.js](https://nodejs.dev/how-to-install-nodejs) documentation for information on how to install it for your system.

Once installed, follow these steps.

1. `cd` to the backend directory.
2. Run `npm install` to install all required dependencies.

3. Run `npm start` to run the API server.


<br>

# API Documentation

The API server runs on localhost at port 5000. The base URL is `http://127.0.0.1:5000/api` (note the appended `/api` after the port). The endpoints documented below will omit this root path from their endpoints.

All responses from the API are JSON formatted. It will always have a `message` property which describes the success of the operation in a short sentence. This property will not be included in the below documentation. 

## User

Endpoints relating to the management of user accounts.

### User Registration

    POST /user

#### Request URL Parameters

n/a

#### Request Body Parameters

| Key         | Type   | Value            | Required | Comments                                 |
|-------------|--------|------------------|----------|------------------------------------------|
| username    | string | any              | Y        | Unique login                             |
| firstName   | string | any              | Y        |                                          |
| lastName    | string | any              | Y        |                                          |
| password    | string | any              | Y        | Plaintext password                       |
| dateOfBirth | string | Date             | Y        | String representation of JavaScript Date |
| type        | string | Patient \|<br>Doctor | Y        |                                          |

#### JSON Reply

| Key   | Type   | Comments                                            |
|-------|--------|-----------------------------------------------------|
| added | bool   | True when the new account was added to the database |
| user  | object | A sanitised user object stripped of sensitive data  |

### Find Users

    GET /user

#### Request URL Parameters

n/a

#### Request Body Parameters

n/a

#### JSON Reply

| Key   | Type     | Comments                                                                    |
|-------|----------|-----------------------------------------------------------------------------|
| found | bool     | True when the database found users (even if there are none in the database) |
| users | object[] | An array of sanitised user object stripped of sensitive data                |

### Find User

    GET /user/:userId

#### Request URL Parameters

| Key     | Comments                  |
|---------|---------------------------|
| :userId | The ID of the user to get |

#### Request Body Parameters

n/a

#### JSON Reply

| Key   | Type     | Comments                                           |
|-------|----------|----------------------------------------------------|
| found | bool     | True when the database found the user              |
| users | object[] | A sanitised user object stripped of sensitive data |

### Test User Password

    POST /user/auth

#### Request URL Parameters

n/a

#### Request Body Parameters

| Key      | Type   | Value | Required | Comments |
|----------|--------|-------|----------|----------|
| username | string | any   | Y        |          |
| password | string | any   | Y        |          |

#### JSON Reply

| Key           | Type   | Comments                                                                 |
|---------------|--------|--------------------------------------------------------------------------|
| authenticated | bool   | True when the given password matched the hashed password in the database |
| user          | object | A sanitised user object stripped of sensitive data                       |

## Health Data

Endpoints relating to the management of health data records.

### Submit Health Data for User

    POST /user/:userId/healthdata

#### Request URL Parameters

| Key     | Comments                  |
|---------|---------------------------|
| :userId | The ID of the user to get |

#### Request Body Parameters

| Key   | Type   | Value                                                                                                                                         | Required | Comments                                                                                                 |
|-------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------|----------|----------------------------------------------------------------------------------------------------------|
| type  | string | BeatsPerMinute \|<br> SystolicPressure \|<br> DiasystolicPressure \|<br> Steps \|<br> DistanceTravelled \|<br> TimeSlept \|<br> CaloriesBurnt |     Y    | Denotes the type of health data being recorded                                                           |
| value | number | any                                                                                                                                           | Y        | The value of the health data type being recorded                                                         |
| date  | string | Date                                                                                                                                          | N        | The date of which the health data was recorded at. Defaults to the current date and time if not supplied |

#### JSON Reply

| Key        | Type   | Comments                                                  |
|------------|--------|-----------------------------------------------------------|
| added      | bool   | True when the health data point was added to the database |
| healthData | object | The health data object that was added to the database     |


### Get All Health Data for User

    GET /user/:userId/healthdata

#### Request URL Parameters

| Key     | Comments                  |
|---------|---------------------------|
| :userId | The ID of the user to get |

#### Request Body Parameters

n/a

#### JSON Reply

| Key               | Type     | Comments                                                      |
|-------------------|----------|---------------------------------------------------------------|
| found             | bool     | True when the database found health data records for the user |
| healthDataRecords | object[] | An array of health data objects for the user                  |

### Get All Health Data

    GET /healthdata

#### Request URL Parameters

n/a

#### Request Body Parameters

| Key    | Type   | Value                                                                                                                                         | Required | Comments                                                                |
|--------|--------|-----------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------------------------------------------------------------|
| type   | string | BeatsPerMinute \|<br> SystolicPressure \|<br> DiasystolicPressure \|<br> Steps \|<br> DistanceTravelled \|<br> TimeSlept \|<br> CaloriesBurnt | N        | Filters the returned records to be of the given type (if present)       |
| userId | string | any                                                                                                                                           | N        | Filters the returned records to be ones for the given user (if present) |


#### JSON Reply

| Key               | Type     | Comments                                         |
|-------------------|----------|--------------------------------------------------|
| found             | bool     | True when the database found health data records |
| healthDataRecords | object[] | An array of health data objects                  |



<br>
---

Your developed system should implement those parts of the static model need to allow this functionality, 
as well as following the flows shown in the dynamic model and storyboards. 
Your UI should also match that shown in the storyboards and wire frames.
