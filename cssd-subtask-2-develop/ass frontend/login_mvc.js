class Login_Model
{
    constructor()
    {
        //get the body tag
        var body = document.getElementsByTagName("body")
        //get the page name
        this.page = body[0].id
        //keep a track of if logged in or not
        this.loggedin = false
        //store the variable that says if someone is logged in or not
        sessionStorage.setItem('logged_in?', "false");
    }

    waitForUser()
    {
        //return the doctor if a doctor
        if (this.doctor)
        {
            return this.doctor
        }
        //return a patient if a patient
        else if (this.patient)
        {
            return this.patient
        }
        else
        {
            return false
        }
    }

    user_login(id)
    {
        //get the dao
        var dao = new UserDao()
        //get the users information
        this.user = dao.get_user(id)
        //create and object using the users information
        var user_object = { "name": this.user.get_name(), "id": this.user.get_id(), "dob": this.user.get_dob() }
        //set logged in as true as someone is logging in
        this.loggedin = true
        //store that we are now logged in
        localStorage.setItem('logged_in?', "true");
        //store the user as a string
        localStorage.setItem('user', JSON.stringify(user_object));
        //go to the alerts page
        window.location.href = "index.html";
    }

    //check if we are logged in or not
    logged_in()
    {
        return this.loggedin
    }

    //return a user object if there is a user
    get_user()
    {
        if (this.user)
        {
            return this.user
        }
        else
        {
            return false
        }
    }

    //find the doctors ID
    find_doctor_match(uname, psw)
    {
        //names of doctors
        var name_array = ["Robert Slack"]
        //doctors passwords are all 123
        var password = "123"
        //set id as null
        var id = null;
        //loop through all the doctors to find if any have the same name and password given
        for (var x = 0; x < name_array.length; ++x)
        {
            if (uname == name_array[x] && psw == password)
            {
                id = x;
            }
        }
        //return ID
        return id
    }

    //find the patient ID
    find_patient_match(uname, psw) {
        //names of patient
        var name_array = ["Bob Stanley", "Jessica Null", "Chris Java"
            , "Judge Holden", " Pilar Ternera", "Susan Plant"]
        //patients passwords are all 123
        var password = "123"
        //set id as null
        var id = null;
        //loop through all the patient to find if any have the same name and password given
        for (var x = 0; x < name_array.length; ++x)
        {
            if (uname == name_array[x] && psw == password)
            {
                id = x;
            }
        }
        //return ID
        return id
    }

    //check if patients username and password is correct
    check_patient_details()
    {
        //get the patient username and password text boxes from their form
        var pat_uname = document.getElementById("pat_uname").value
        var pat_psw = document.getElementById("pat_psw").value

        //check there is data entered
        if (pat_uname != "" && pat_psw != "") {
            //find users id if there is no user match return null
            var temp_id = this.find_patient_match(pat_uname, pat_psw)

            //make sure a user id has been returned
            if (temp_id != null)
            {
                this.user_login(temp_id)
            }
            else
            {
                alert("Incorrect Username or Password")
            }
        }
        else
        {
            alert("Username or Password empty")
        }
    }

    //check if doctors username and password is correct
    check_doctor_details()
    {
        //get the doctors username and password text boxes from their form
        var doc_uname = document.getElementById("doc_uname").value
        var doc_psw = document.getElementById("doc_psw").value

        //check there is data entered
        if (doc_uname != "" && doc_psw != "")
        {
            //find users id if there is no user match return null
            var temp_id = this.find_doctor_match(doc_uname, doc_psw)

             //make sure a user id has been returned
            if (temp_id != null)
            {
                this.user_login(temp_id)
            }
            else
            {
                alert("Incorrect Username or Password")
            }
        }
        else
        {
            alert("Username or Password empty")
        }
    }

    
}

class Login_View
{
    constructor()
    {
        
    }
}

class Login_Controller
{
    constructor()
    {
        //create a model
        this.model = new Login_Model()
        //create a view
        this.view = new Login_View()
        //ensure the page is the selection page for logging in
        if (this.model.page == "selection_page")
        {
            //get the buttons from the doctor and patient forms
            var patient_login = document.getElementById("patient_login") 
            var doctor_login = document.getElementById("doctor_login") 
       
            //add click events to the buttons
            patient_login.addEventListener("click", () => { this.model.check_patient_details() })
            doctor_login.addEventListener("click", () => { this.model.check_doctor_details() })
        }
    }
}

//create a login controller
controller = new Login_Controller()
