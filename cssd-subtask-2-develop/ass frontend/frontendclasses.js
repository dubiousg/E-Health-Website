//=====================================================================================
//frontendclasses.js
//=====================================================================================
/*
This file contains classes that compose the frontend other than the MVC classes.
It also contains a modified quicksort algorithm that sorts health data chronologically.
Functionally it implements:
    *health quicksort - as mentioned
    *interaction between frontend and backend
    *provides classes to contain user and doctor data
    *provides classes to contain healthdata
*/

//an object that is used globally to compare health types
const HealthDataType = {
    BeatsPerMinute: 0,
    SystolicPressure: 1,
    DiasystolicPressure: 2,
    Steps: 3,
    DistanceTravelled: 4,
    TimeSlept: 5,
    CaloriesBurnt: 6
}

//The Health Data Class
/*
    *retrieves health data
    *holds health data: type, date and value
*/
class HealthData {
    constructor() {

        if (0.7 < Math.random()) {
            this.type = 0
            this.value = Math.floor((Math.random() * 100) + 1);
        } else if (0.1 < Math.random()) {
            this.type = 6
            this.value = Math.floor((Math.random() * 100) + 1);
        } else {
            this.type = 5
            this.value = Math.floor((Math.random() * 600) + 60);
        }

        var d = new Date()
        this.timeStamp = String(Math.floor((Math.random() * 28) + 1))
        this.timeStamp += "/" + String(Math.floor((Math.random() * 12) + 1))
        this.timeStamp += "/" + d.getFullYear();

    }

    get_type() {
        return this.type;
    }

    get_value() {
        return this.value;
    }

    get_TimeStamp() {
        return this.timeStamp;
    }
}

class Message {

    constructor(id, title, body, author_id, recipient_id) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.author_id = author_id;
        this.recipient_id = recipient_id;
    }

}

class Feed {

    constructor(user_id) {
        this.user_id = user_id;
        get_alerts();
    }

    get_alerts() {

    }

    refesh() {
        get_alerts();
    }

}

//The User Class
/*
    *is a base class to patient and doctor
    *holds user data 
    *calculates user age from dob
*/
class User {

    constructor(id, name, dob, password) {
        this.id = id;
        this.name = name;
        this.dob = dob;
        this.password = password
    }

    get_id() {
        return this.id;
    }

    get_name() {
        return this.name;
    }

    get_first_name() {
        return this.id;
    }

    get_last_name() {
        return this.id;
    }

    get_dob() {
        return this.dob;
    }

    get_age() {
        var date = this.dob
        const regex = /\d+/g;
        var date_nums = date.match(regex)
        var age = 120 - parseInt(date_nums[2])

        return age 
    }

    get_messages() {

    }
}
//The Patient Class
/*
    *holds health data within a list
    *holds health data: type, date and value
    *derived from user class
*/
class Patient extends User
{
    constructor(id, name, dob, password)
    {
        //call the user constructor which is the base class
        super(id, name, dob, password)
        this.health_data = []
        var i
        this.password = password
        for (i = 0; i < 20; i++)
        {
            this.health_data.push(new HealthData())
        }

        //this.health_data = dbs.get_one("nosql string");
    }

    log_data(type, value)
    {
        //dbs.insert("nosql str");
        return "good"
    }

    get_health_data(healthDataType)
    {
        return this.health_data;
    }

}
//The doctor Class
/*
    *holds patients within a list
    *can retrieve patients
    *derived from user class
*/
class Doctor extends User
{
    constructor(id, name, dob, password)
    {
        //call the user constructor which is the base class
        super(id, name, dob, password);

        this.patients = []
        var i
        this.password = password
        this.patients.push(new Patient(1, "Bob Stanley", "1.11.98", "123"))
        this.patients.push(new Patient(2, "Jessica Null", "5.01.31", "123"))
        this.patients.push(new Patient(3, "Chris Java", "7.2.74", "123"))
        this.patients.push(new Patient(4, "Judge Holden", "9.10.91", "123"))
        this.patients.push(new Patient(5, "Pilar Ternera", "13.06.67", "123"))
        this.patients.push(new Patient(6, "Susan Plant", "23.04.58", "123"))
    }

    notify(user_id, message)
    {

    }

    get_patients(search_name)
    {
        //dbs.insert("sql str");
        return this.patients
    }
}
//The User Database Access Object Class
/*
    *is used to interact with the database
    *can retrieve, delete, update, add users
    *can get all users
*/
class UserDao {
    constructor() { }

    get_all_users() {

    }

    update_user(user) {

    }

    delete_user(user) {

    }

    add_user(user) {

    }

    get_user(id) {
        switch (id)
        {
            case 0:
                this.p = new Doctor(id, "Robert Slack", "dob", "123")
                break;
            case 1:
                this.p = new Patient(id, "Bob Stanley", "dob", "123")
                break;
            case 2:
                this.p = new Patient(id, "Jessica Null", "dob", "123")
                break;
            case 3:
                this.p = new Patient(id, "Chris Java", "dob", "123")
                break;
            case 4:
                this.p = new Patient(id, "Judge Holden", "dob", "123")
                break;
            case 5:
                this.p = new Patient(id, " Pilar Ternera", "dob", "123")
                break;
            case 6:
                this.p = new Patient(id, "Susan Plant", "dob", "123")
                break;
            default:
                break;
        }
        return this.p;
    }

}

//return max number of days based on date
function calc_days(health_data_entry) {
    return health_data_entry[0] * 365 + health_data_entry[1] * 31 + health_data_entry[2]
}

//swap items
function swap(items, firstIndex, secondIndex) {
    var temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
}

//partition the items and swap them
function partition(items, left, right) {

    var pivot = calc_days(items[Math.floor((right + left) / 2)])
    i = left,
        j = right;

    while (i <= j) {

        while (calc_days(items[i]) < pivot) {
            i++;
        }

        while (calc_days(items[j]) > pivot) {
            j--;
        }

        if (i <= j) {
            swap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

//perform the quicksort
function quickSort(items, left, right) {

    var index;

    if (items.length > 1) {

        index = partition(items, left, right);

        if (left < index - 1) {
            quickSort(items, left, index - 1);
        }

        if (index < right) {
            quickSort(items, index, right);
        }

    }

    return items;
}


//sort health data according to dates
function health_data_sort(health_data) {
    var data_storage = []
    var i
    for (i = 0; i < health_data.length; i++) {
        var date = health_data[i].get_TimeStamp()
        const regex = /\d+/g;
        var date_nums = date.match(regex)

        //store date and health data: year, month, day, health data
        var push_this = [parseInt(date_nums[2]), parseInt(date_nums[1]), parseInt(date_nums[0]), health_data[i]]
        
        data_storage.push(push_this)

    }

    var sorted_data_storage = quickSort(data_storage, 0, data_storage.length - 1)
    var sorted_data = []
    for (i = 0; i < sorted_data_storage.length; i++) {
        sorted_data.push(sorted_data_storage[i][sorted_data_storage[i].length - 1])
    }

    return sorted_data
}

