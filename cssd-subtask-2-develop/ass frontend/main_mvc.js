//=====================================================================================
//main_mvc.js
//=====================================================================================
/*
This file contiains classes that compose the main MVC.
Functionally it implements:
    *The patient alerts and feed
    *Health history
    *Adding new health data
    *The analyitcs chart
*/

//The main model class 
/*
    *This modifies and updates the chart
    *It retrieves user and html page data
*/
class MainModel {

    //constructor: identifies the html page, sets the user and inits chart options
    constructor(user) { 
        var body = document.getElementsByTagName("body")
        this.user = user
        this.page = body[0].id

        this.std_toggled = false 
        this.var_toggled = false
        this.mean_toggled = false
    }

    get_doctor() {
        return this.user
    }

    get_patient() {
        return this.user
    }

    get_page() {
        return this.page
    }

    //sets a patient (for chart examination)
    set_patient(patient) {
        this.patient = patient
    }

    //gets a doctor's patient (for chart examination)
    get_doctors_patient() {
        return this.patient
    }

    //inits chart with patient data, the chart type ect...
    init_chart() {
        var health_type = 0

        const isDoctor = (model.get_doctor() instanceof Doctor)
        if (isDoctor)
        {
            var health_data = this.patient.get_health_data()
        }
        else
        {
            var health_data = this.user.get_health_data()
        }
        
        var init_data = [];
        var i;

        //sort dates
        var sorted_health_data = health_data_sort(health_data)
        for (i = 0; i < sorted_health_data.length; i++) {
            if (sorted_health_data[i].get_type() == health_type) {
                var date = sorted_health_data[i].get_TimeStamp()
                const regex = /\d+/g;
                var date_nums = date.match(regex)

                date = date_nums[2] + "-" + date_nums[1] + "-" + date_nums[0]

                const value = sorted_health_data[i].get_value()
                var dict = { x: date, y: value }
                init_data.push(dict)
            }
        }
        //gets the canvas for the chart
        var ctx = document.getElementById('myChart').getContext('2d');
        //creates the new chart with initial data
        //displays dates in MMM DD eg. SEP 16
        this.myChart = new Chart(ctx,
            {
                type: 'scatter',
                data:
                {
                    datasets:
                        [{
                            borderColor: 'rgba(255, 0, 0, 1)',
                            backgroundColor: 'rgba(255, 0, 0, 0.5)',
                            label: 'Beats Per Minute',
                            data: init_data,
                            borderWidth: 1
                        }]
                },
                options:
                {
                    scales:
                    {
                        yAxes:
                            [{
                                ticks:
                                {
                                    beginAtZero: true
                                }
                            }],
                        xAxes:
                            [{
                                type: 'time',
                                display: true,
                                time:
                                {
                                    unit: 'day',
                                    displayFormats:
                                    {
                                        day: 'MMM DD'
                                    }
                                },
                            }]
                    }
                }
            });
    }

    //changes the health data within the chart, also handles other statistical options
    change_chart_data(chart_ht) {
        var health_type = chart_ht.value

        const isDoctor = (model.get_doctor() instanceof Doctor)
        if (isDoctor)
        {
            var health_data = this.patient.get_health_data()
        }
        else {
            var health_data = this.user.get_health_data()
        }

        var data = [];
        var i;

        //sort dates
        var sorted_health_data = health_data_sort(health_data)
        console.log("sorted data ", sorted_health_data)

        for (i = 0; i < sorted_health_data.length; i++) {
            if (sorted_health_data[i].get_type() == chart_ht.value) {
                var date = sorted_health_data[i].get_TimeStamp()
                const regex = /\d+/g;
                var date_nums = date.match(regex)

                date = date_nums[2] + "-" + date_nums[1] + "-" + date_nums[0]

                const value = sorted_health_data[i].get_value()
                var dict = { x: date, y: value }
                data.push(dict)
            }

        }

        var label = "label did not set"
        switch (parseInt(health_type)) {
            case HealthDataType.BeatsPerMinute:
                label = "Beats Per Minute"
                break;
            case HealthDataType.SystolicPressure:
                label = "Systolic Pressure"
                break;
            case HealthDataType.DiasystolicPressure:
                label = "Diasystolic Pressure"
                break;
            case HealthDataType.Steps:
                label = "Steps"
                break;
            case HealthDataType.DistanceTravelled:
                label = "Distance Travelled"
                break;
            case HealthDataType.TimeSlept:
                label = "Time Slept"
                break;
            default:
                label = "Calories Burnt"
        }

        
        //remove current statistics
        this.myChart.data.datasets = this.myChart.data.datasets.filter(function (value, index, arr) { return value.label != "std"; })
        
        this.myChart.data.datasets = this.myChart.data.datasets.filter(function (value, index, arr) { return value.label != "var"; })
        this.myChart.data.datasets = this.myChart.data.datasets.filter(function (value, index, arr) { return value.label != "mean"; })
        
        this.myChart.data.datasets[0].data = data
        this.myChart.data.datasets[0].label = label
        
        //add statistics (from new dataset) where statistics are toggled on
        if (this.std_toggled) {
            this.push_std()
        }

        if (this.var_toggled) {

            this.push_var()
        }

        if (this.mean_toggled) {

            this.push_mean()
        }

        this.myChart.update()
    }
    //push standard deviation dataset to the graph
    push_std() {
        var data = []
        var mean = 0
        var health_data = this.myChart.data.datasets[0].data
        var i
        //calcuate the mean then std
        for (i = 0; i < health_data.length; i++) {
            mean += health_data[i].y
        }

        mean /= health_data.length

        var std = 0

        for (i = 0; i < health_data.length; i++) {
            std += Math.pow(health_data[i].y - mean, 2)
        }

        std = Math.pow(std / health_data.length, 0.5)

        for (i = 0; i < health_data.length; i++) {
            data.push({ x: health_data[i].x, y: mean - std })
        }

        var chartjs_dataset =
        {
            borderColor: 'rgba(50, 170, 100, 1)',
            backgroundColor: 'rgba(50, 170, 100, 0.5)',
            label: 'std',
            data: data,
            borderWidth: 1,
            fill: false,
            type: 'line'
        }
        //push - std boundary to chart
        this.myChart.data.datasets.push(chartjs_dataset)

        data = []

        for (i = 0; i < health_data.length; i++) {
            data.push({ x: health_data[i].x, y: mean + std })

        }

        chartjs_dataset =
            {
                borderColor: 'rgba(180, 50, 80, 1)',
                backgroundColor: 'rgba(180, 50, 80, 0.5)',
                label: 'std',
                data: data,
                borderWidth: 1,
                fill: false,
                type: 'line'
            }
        //push + std boundary to chart
        this.myChart.data.datasets.push(chartjs_dataset)
    }
    //push variance dataset to the graph
    push_var() {
        var data = []
        var mean = 0
        var health_data = this.myChart.data.datasets[0].data
        var i
        //calculate variance
        for (i = 0; i < health_data.length; i++) {
            mean += health_data[i].y
        }

        mean /= health_data.length

        var variance = 0

        for (i = 0; i < health_data.length; i++) {
            variance += Math.pow(health_data[i].y - mean, 2)
        }

        variance /= health_data.length

        for (i = 0; i < health_data.length; i++) {
            data.push({ x: health_data[i].x, y: mean - variance })

        }

        var chartjs_dataset =
        {

            borderColor: 'rgba(50, 170, 100, 1)',
            backgroundColor: 'rgba(50, 170, 100, 0.5)',
            label: "var",
            data: data,
            borderWidth: 1,
            fill: false,
            type: 'line'
        }
        //push - variance boundary
        this.myChart.data.datasets.push(chartjs_dataset)

        data = []

        for (i = 0; i < health_data.length; i++) {
            data.push({ x: health_data[i].x, y: mean + variance })

        }

        chartjs_dataset =
            {

                borderColor: 'rgba(180, 50, 80, 1)',
                backgroundColor: 'rgba(180, 50, 80, 0.5)',
                label: "var",
                data: data,
                borderWidth: 1,
                fill: false,
                type: 'line'
            }
        //push + variance boundary
        this.myChart.data.datasets.push(chartjs_dataset)
    }
    //push mean dataset to the graph
    push_mean() {
        var data = []
        var mean = 0
        var health_data = this.myChart.data.datasets[0].data
        var i

        for (i = 0; i < health_data.length; i++) {
            mean += health_data[i].y
        }

        mean /= health_data.length

        for (i = 0; i < health_data.length; i++) {
            data.push({ x: health_data[i].x, y: mean })
        }

        var chartjs_dataset =
        {

            borderColor: 'rgba(50, 170, 100, 1)',
            backgroundColor: 'rgba(50, 170, 100, 0.5)',
            label: 'mean',
            data: data,
            borderWidth: 1,
            fill: false,
            type: 'line'
        }
        //add mean to chart
        this.myChart.data.datasets.push(chartjs_dataset)

    }
    //changes the chart type, eg. line chart to scatter
    change_chart_type(chart_type) {
        //chart must be recreated to change type
        var ctx = document.getElementById('myChart').getContext('2d');
        this.myChart = new Chart(ctx,
            {
                type: chart_type.value,
                data:
                {
                    datasets: this.myChart.data.datasets
                },
                options:
                {
                    scales:
                    {
                        yAxes:
                            [{
                                ticks:
                                {
                                    beginAtZero: true
                                }
                            }],
                        xAxes:
                            [{
                                type: 'time',
                                display: true,
                                time:
                                {
                                    unit: 'day',
                                    displayFormats:
                                    {
                                        day: 'MMM DD'
                                    }
                                },
                            }]
                    }
                }
            });
    }
    //adds or removes std boundaries from the chart
    toggle_std()
    {
        if (this.std_toggled)
        { //remove std
            this.myChart.data.datasets = this.myChart.data.datasets.filter(function (value, index, arr) { return value.label != "std"; })
        }
        else
        { //add std
            console.log("std changing")
            this.push_std()
        }
        this.myChart.update()
        this.std_toggled = !this.std_toggled
    }
    //adds or removes variance boundaries from the chart
    toggle_var()
    {
        if (this.var_toggled)
        { //remove var
            this.myChart.data.datasets = this.myChart.data.datasets.filter(function (value, index, arr) { return value.label != "var"; })
        }
        else
        { //add var
            this.push_var()
        }
        this.myChart.update()
        this.var_toggled = !this.var_toggled
    }
    //adds or removes the mean from the chart
    toggle_mean()
    {
        if (this.mean_toggled)
        { //remove mean
            this.myChart.data.datasets = this.myChart.data.datasets.filter(function (value, index, arr) { return value.label != "mean"; })
        }
        else
        {   //add mean
            this.push_mean()

        }
        this.myChart.update()
        console.log(this.myChart)
        this.mean_toggled = !this.mean_toggled
    }
}
//The main view class 
/*
    *This modifies and updates the html pages
    *It calls the model through its functions
     for different data eg health.
*/
class MainView
{

    constructor() {}
    //page: index.html, history.html
    //use:  creates a column for some column data in the div
    create_feed_div_col(col_data, optional_col_type)
    {
        if (typeof optional_col_type === 'undefined')
        {
            optional_col_type = 'default';
        }
    
        var col_div = document.createElement("div")
        col_div.classList.add("col")
    
        if (optional_col_type == "type")
        {
            var img = document.createElement("img")
            
            //choose image from type
            switch (col_data)
            {
                case HealthDataType.BeatsPerMinute: 
                    img.src = "images/heart.jpg"
                    col_data = "BeatsPerMinute"
                    break;
                case HealthDataType.SystolicPressure: 
                    img.src = "images/heart-squeeze.jpg"
                    col_data = "SystolicPressure"
                    break;
                case HealthDataType.DiasystolicPressure:
                    img.src = "images/heart-expand.jpg"
                    col_data = "DiasystolicPressure"
                    break;
                case HealthDataType.Steps: 
                    img.src = "images/steps.jpg"
                    col_data = "Steps"
                    break;
                case HealthDataType.DistanceTravelled: 
                    img.src = "images/distance.jpg"
                    col_data = "Distance Travelled"
                    break;
                case HealthDataType.TimeSlept: 
                    img.src = "images/sleep.jpg"
                    col_data = "Time Slept"
                    break;
                default:
                    img.src = "images/exercise.jpg"
                    col_data = "Calories Burnt"
                
            } 
    
            
            img.classList.add("img-rounded")
            img.alt = "Responsive image" 
            img.style = "width:10%"
            col_div.appendChild(img)
        }
    
        var node = document.createTextNode(col_data)
        col_div.appendChild(node)
        return col_div
    }
    //page: index.html, history.html
    //use:  creates a div in the feeds
    create_feed_div(type, value, time_stamp, patient)
    {
        if (typeof patient === 'undefined')
        {
            patient = 'default';
        }

        var feed_div = document.createElement("div")
        feed_div.classList.add("row",  "border",  "justify-content-center")
    
        var type_div = this.create_feed_div_col(type, "type") 
        feed_div.appendChild(type_div)
    
        var value_div = this.create_feed_div_col(value) 
        feed_div.appendChild(value_div)
    
        var time_stamp_div = this.create_feed_div_col(time_stamp) 
        feed_div.appendChild(time_stamp_div)

        if (patient !== 'default')
        {
            var patient_div = this.create_feed_div_col(patient) 
            feed_div.appendChild(patient_div)
        }
        
        var parent = document.getElementById("Feed")

        parent.appendChild(feed_div)
    }
    //pages: index.html, history.html
    //use: shows patient health data
    //     patient is optional parameter
    //     patient is assumed when user is the patient
    show_feed(health_data, patient) {
        if (typeof patient === 'undefined')
        {
            patient = 'default';
        }

        this.health_data = health_data
        var i;
        for (i = 0; i < this.health_data.length; i++)
        {
            var type = this.health_data[i].get_type()
            var value = this.health_data[i].get_value()
            var time_stamp = this.health_data[i].get_TimeStamp()

            if (patient !== 'default')
            {
                //add patient div to feed div
                var patient_div = document.getElementById("patient-div")
                patient_div.hidden = false;

                var patient_name = patient.get_name()
                this.create_feed_div(type, value, time_stamp, patient_name);
            }
            else
            {
                this.create_feed_div(type, value, time_stamp);
            }
        }
    }
    //page: inputdata.html
    //use: changes the selected health data type
    change_health_data(selector)
    {
        const val = selector.value  
        var input_div = document.getElementById("input-div")
        const input_section = input_div.children[1]  
        const new_input_section = document.createElement("input")
    
        //differ between single and multiple data types:
        //therefore time slept and everything else:

        if (val == "Time Slept") {
            new_input_section.classList.add("form-control", "form-control-lg")
            new_input_section.type = "time"  
        } 
        else
        {
            new_input_section.classList.add("form-control", "form-control-lg")
            new_input_section.type = "text"      
        }
    
        input_div.replaceChild(new_input_section, input_section)
    }
    //page: inputdata.html
    //use:  helper function for enter_data(), handles different types of data
    check_hd_correct(data, health_type)
    {
        
        if (health_type == "Time Slept")
        {
            const regex = /\d+/g;
            if (data)
            {
                data = data.match(regex)
                data[0] = Number(data[0]) //hours
                data[1] = Number(data[1]) //mins
            }
        }
        else
        {
            data = Number(data)
        }
        return data
    }
    //page: inputdata.html
    //use:  provides patient a form for entering health data
    enter_data(selector, model)
    {
        var form = document.getElementById("input-form")
        var msg = document.getElementById("health-data-msg")
        const health_type = selector.value 
        
        const input_div = document.getElementById("input-div")
        const input_section = input_div.children[1]  
        var data = input_section.value
        
        //handle errors before the data is sent
        if (data = this.check_hd_correct(data, health_type))
        {
            //add data to data base and recieve response
            const response = model.get_patient().log_data(health_type, data)

            //inform user whether data was sent or not
            if (response == "good")
            {
                form.hidden = true
                
                //change the health data message
                msg.textContent = "Data Was Sent Correctly"

                //display enter new data option
                var more_data = document.getElementById("button-more-data")
                //console.log(more_data)
                more_data.hidden = false
            } 
            else
            {
                msg.textContent = "Data Could Not be Sent At This Time"
            }
        } 
        else
        {
            msg.textContent = "Input Must Not Be Blank and It must Be Numerical"   
        }
    }
    //page: inputdata.html
    //use:  returns patient back to the form for entering health data
    enter_more_data(more_data)
    {
        var form = document.getElementById("input-form")
        more_data.hidden = true

        //show the health data form
        var msg = document.getElementById("health-data-msg")
        msg.textContent = "Enter Health Data Manually"
        form.hidden = false;
    }
    //page: history.html
    //use:  Fetches the health history of a specific patient
    fetch_patient(patient, model)
    {
        //set the doctors current patient
        model.set_patient(patient)
        //clear current feed
        var parent = document.getElementById("Feed")
        var i;
        for (i = 1; i < parent.childElementCount; i)
        {
            parent.children[i].remove()
        }
     
        var patients_div = document.getElementById("patients-div")

        patients_div.hidden = true

        var patient_div = document.getElementById("Feed")
        const div_string = patient.get_name() + "'s Health History"
        document.getElementById("patient-header").textContent = div_string
        const health_data = patient.get_health_data()
        this.show_feed(health_data)

        patient_div.hidden = false

        var patients_btn = document.getElementById("button-diff-patient")
        patients_btn.hidden = false

        var analytics_btn = document.getElementById("btn-analytics")
        analytics_btn.hidden = false

    }
    //page: history.html
    //use:  fetchs a list of patients which the doctor can click on
    //      to inspect
    populate_health_history(doctor, model)
    {
        var patients = doctor.get_patients() 
        var selector = document.getElementById("patient-selector")
        var i;
        for (i = 0; i < patients.length; i++)
        {
            var patient_option = document.createElement("option")
            var option_string = patients[i].get_name()
            option_string += " "
            option_string += patients[i].get_age()
            option_string += " "
            option_string += patients[i].get_dob()
            patient_option.text = option_string

            this.patient = patients[i]
            patient_option.addEventListener("dblclick", () => { this.fetch_patient(this.patient, model)})

            selector.append(patient_option)
        }
    }
    //page: history.html
    //use:  returns a doctor back to the list of patients
    fetch_all_patients()    
    {
        console.log("fetch all patients")
        var patient_div = document.getElementById("Feed")
        patient_div.hidden = true

        var patients_btn = document.getElementById("button-diff-patient")
        patients_btn.hidden = true

        var analytics_btn = document.getElementById("btn-analytics")
        analytics_btn.hidden = true

        document.getElementById("patient-header").textContent = "Select a Patient"

        var chart_div = document.getElementById('chart-div')
        chart_div.hidden = true

        var patients_div = document.getElementById("patients-div")
        patients_div.hidden = false        
    }
    //page: history.html
    //use:  shows and initalises the chart
    fetch_chart(model)
    {
        var chart_div = document.getElementById('chart-div')
        chart_div.hidden = false
        var ana_btn = document.getElementById('btn-analytics')
        ana_btn.hidden = true
        model.init_chart()
    }

}
//The main controller class 
/*
    *This accepts and handles user interactions
    *It controls the model and view
*/
class MainController
{
    //loads model and view, determines whether use is doctor or patient
    constructor(model, view)
    {
        this.model = model;
        this.view = view;

        const isDoctor = (model.get_doctor() instanceof Doctor)
        if (isDoctor)
        {
            this.doctor = model.get_doctor()
            this.patient_list = this.doctor.get_patients("")
        }
        else
        {
            this.patient = model.get_patient()
            this.health_data = this.patient.get_health_data()
        }

        if (model.get_page() != "selection_page") {

            if (!isDoctor)
            {
                //unhide the input data page link on the patients side
                var add_data_link = document.getElementById("add-data-link")
                add_data_link.hidden = false

                //unhide the simulated sensor page link on the patients side
                var sensor_link = document.getElementById("sensor-link")
                sensor_link.hidden = false
            }
            //logout button in the top right corner takes the user back to the selection page
            var logout_btn = document.getElementById("logout_btn")
            logout_btn.addEventListener("click", () => controller.logout_account())
        }

        if (model.get_page() == "inputdata")
        {
            this.selector = document.getElementById("selector")
            var selector = this.selector
            this.selector.addEventListener("change", function () {view.change_health_data(selector)})

            this.health_data_button = document.getElementById("button")   
            var selector = this.selector 
            this.health_data_button.addEventListener("click", function () { view.enter_data(selector, model) })

            var more_data = document.getElementById("button-more-data")
            more_data.addEventListener("click", function () { view.enter_more_data(more_data) })
        }

        if (model.get_page() == "index")
        {
            if (isDoctor)
            {

                var i;
                var health_data
                var patient 
                for (i = 0; i < this.patient_list.length; i++)
                {
                    patient = this.patient_list[i]
                    health_data = patient.get_health_data()
                    this.view.show_feed(health_data, patient)
                }

            }
            else
            {
                this.view.show_feed(this.health_data)   
            }
        }
      
       
        if (model.get_page() == "history")
        {
            var analytics_btn = document.getElementById("btn-analytics")
            analytics_btn.addEventListener("click", () => this.view.fetch_chart(this.model))
            analytics_btn.hidden = false

            var chart_ht = document.getElementById("ht-selector") //chart_ht -> chart health type
            chart_ht.addEventListener("change", () => this.model.change_chart_data(chart_ht))

            var chart_type = document.getElementById("ct-selector")//chart_type -> eg scatter/line
            chart_type.addEventListener("change", () => this.model.change_chart_type(chart_type))

            var std_btn = document.getElementById("std")
            std_btn.addEventListener("click", () => this.model.toggle_std())

            var var_btn = document.getElementById("var")
            var_btn.addEventListener("click", () => this.model.toggle_var())

            var mean_btn = document.getElementById("mean")
            mean_btn.addEventListener("click", () => this.model.toggle_mean())

            //populate doctor's patients history
            if (isDoctor)
            {
                this.view.populate_health_history(model.get_doctor(), model)

                analytics_btn.hidden = true

                var patients_btn = document.getElementById("button-diff-patient")
                patients_btn.addEventListener("click", () => this.view.fetch_all_patients())
            }
            else
            { //populate patients health history
                var pat_feed = document.getElementById("Feed")
                pat_feed.hidden = false

                this.health_data = this.patient.get_health_data()
                this.view.show_feed(this.health_data)

                var pat_head = document.getElementById("patient-header")
                pat_head.style.display = "none" 
                var pat_table = document.getElementById("patients-div")
                pat_table.style.display = "none" 
            }
        }
    }


    logout_account()
    {
        //set logged_in as false in browsers local storage
        localStorage.setItem('logged_in?', "false")
        //remove the current users information from the browsers local storage
        localStorage.removeItem('user')
        //return to selection page
        window.location.href = "selection_page.html"
    }
}

//run the file
var logged_in = localStorage.getItem("logged_in?");
//load stuff when logged in
if (logged_in == "true") {

    var user_json = localStorage.getItem('user');
    user_object = JSON.parse(user_json)

    dao = new UserDao()
    user = dao.get_user(parseInt(user_object.id))

    model = new MainModel(user)
    view = new MainView()
    controller = new MainController(model, view)
}

