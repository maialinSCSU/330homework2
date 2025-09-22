/* NOTES
changes don't save over the course of a server reset
*/
const http = require('http');
const url = require('url');

const availableTimes = {
    Monday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Tuesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Wednesday: ["1:00", "1:30", "2:00", "2:30", "3:00", "4:00", "4:30"],
    Thursday: ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    Friday: ["1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"], 
};

const appointments = [
    {name: "James", day: "Wednesday", time: "3:30" },
    {name: "Lillie", day: "Friday", time: "1:00" }];


//Server object
let serverObj =  http.createServer(function(req,res){
	console.log(req.url);
	let urlObj = url.parse(req.url,true);
	//array of valid days and times
	let validDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; 
	let validTimes = ["1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"]; 
	//check if urlObj is a valid day
	 if (!(urlObj.query.name && urlObj.query.day && urlObj.query.time)) {

	 		error(res,400,"Missing query string");
            //console.log("Missing query string");
      }else if (!(validDays.includes(urlObj.query.day) || validTimes.includes(urlObj.query.time)))
        {
            error(res, 400, "Invalid query entry");
            //console.log("Invalid query entry");
        }
        else {
            switch (urlObj.pathname) {
                    case "/schedule":
                            schedule(urlObj.query,res);
                            break;
                    case "/cancel":
                            cancel(urlObj.query,res);
                            break;
                    case "/check":
                            check(urlObj.query, res);
                            break;
                    default:
                            error(res,404,"pathname unknown");

    } }
});

function schedule(qObj,res) {
	if (availableTimes[qObj.day].some(time => time == qObj.time))
	{
		//all works until you reach res
		availableTimes[qObj.day] = availableTimes[qObj.day].filter(item => item !== qObj.time); 

		let newAppt = {name: qObj.name, day: qObj.day, time: qObj.time};

		appointments.push(newAppt);
		//currently experiening issues with res 
		//res.write("scheduled");
		//res.end();
		console.log("scheduled");
	}
	else {
		//error(res,400,"Can't schedule");
		console.log("cant schedule");
	}
}

function cancel(qObj, res) {

	if (appointments.some(appt => appt.name === qObj.name && appt.day === qObj.day && appt.time === qObj.time))
	{
		appointments.filter(appt => !(appt.name === qObj.name && appt.day === qObj.day && appt.time === qObj.time)) //works
		
		availableTimes[qObj.day].push(qObj.time);
		//res.write("Appointment has been cancelled");
		//res.end();
		console.log("appointment has been cancellled");
	}
	else {
		//res.write("Appointment not found");
		//res.end();
		console.log("appointment not found")
	}
}

function check(qObj, res) {
	if (availableTimes[qObj.day].some(time => time == qObj.time))//works
	{
		//res.write("Available");
		//res.end();
		console.log("Available");
	}
	else {
		//res.write("Unavailable");
		//res.end();
		console.log("unavailable");
	}
}

function error(response,status,message) {
	response.writeHead(status,{'content-type':'text/plain'});
	response.write(message);
	response.end();
}

serverObj.listen(80,function(){console.log("listening on port 80")});
