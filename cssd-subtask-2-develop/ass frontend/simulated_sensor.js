class Sensor
{
    constructor()
    {
        //get the body of the page
        var body = document.getElementsByTagName("body")
        //get the page name
        this.page = body[0].id
        //get the drop down menu for selecting which type of health data
        this.selection = document.getElementById("selector")
        //for holding the asynchronis function setInterval
        this.generationInstance

        //ensure the page is the simulated sensor page
        if (this.page == "simulated_sensor")
        {
            //get the button for starting the data generation
            var generate_btn = document.getElementById("generate_btn") 
            //get the button for stooping the generation of data
            var stop_btn = document.getElementById("stop_btn") 

            //add events to the buttons so when clicked the function as called
            generate_btn.addEventListener("click", () => { this.generateData()})
            stop_btn.addEventListener("click", () => { this.stopGeneratingData()})
        }
    }

    //generate random beats per minute
    generateBPM()
    {
        var bpm = Math.floor((Math.random() * 120) + 1)
        console.log(bpm)
    }

    //generate random systolic pressures
    generateSysPres()
    {
        var sp = Math.floor((Math.random() * 150) + 1)
        console.log(sp)
    }

    //generate random dystolic pressures
    generateDysPres()
    {
        var dp = Math.floor((Math.random() * 100) + 1)
        console.log(dp)
    }

    //generate random steps
    generateSteps()
    {
        var steps = Math.floor((Math.random() * 20) + 1)
        console.log(steps)
    }

    //generate random distance travalled
    generateDistTrav()
    {
        var distance = Math.floor((Math.random() * 2) + 1)
        console.log(distance + "m")
    }

    //generate random time slept
    generateTimeSlept()
    {
        var time = Math.floor((Math.random() * 1) + 1)
        console.log(time)
    }

    //generate random calories burnt
    generateCalBurnt()
    {
        var calories = Math.floor((Math.random() * 20) + 1)
        console.log(calories)
    }

    //decide which health data type is selected then generate that type randomly every second
    generateData()
    {
        switch (this.selection.value)
        {
            case "0":
                sensor.generationInstance = setInterval(sensor.generateBPM, 1000)
                break;
            case "1":
                sensor.generationInstance = setInterval(sensor.generateSysPres, 1000)
                break;
            case "2":
                sensor.generationInstance = setInterval(sensor.generateDysPres, 1000)
                break;
            case "3":
                sensor.generationInstance = setInterval(sensor.generateSteps, 1000)
                break;
            case "4":
                sensor.generationInstance = setInterval(sensor.generateDistTrav, 1000)
                break;
            case "5":
                sensor.generationInstance = setInterval(sensor.generateTimeSlept, 1000)
                break;
            case "6":
                sensor.generationInstance = setInterval(sensor.generateCalBurnt, 1000)
                break;
            default:
                break;
        }
        //make the stop button visible
        stop_btn.style.display = "block"
        //make sure they cannot click the generate button twice
        generate_btn.disabled = true
        //ensure the user cannot interact with the drop down menu
        this.selection.disabled = true
    }

    //stop data generation
    stopGeneratingData()
    {
        //hide stop button
        stop_btn.style.display = "none"
        //reactivate the generate button
        generate_btn.disabled = false
        //reactivate the drop down menu
        this.selection.disabled = false
        //stop the setInterval function
        clearInterval(this.generationInstance);
    }
}

//create a sensor
sensor = new Sensor()