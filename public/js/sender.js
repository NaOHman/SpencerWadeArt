$(document).ready(function() {
	console.log("ready");
	
});

function validateEmail(email) { 
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

var sendEmail = function() {
	var name, from, subject, message;
	//$("#send_email").click(function() {
		sendername=$("#sendername").val();
		from=$("#from").val();
		subject=$("#subject").val();
		message=$("#message").val();

		if(!sendername) {
			alert("Name is required.");
			return;
		}	
		if(!from) {
			alert("Email is required.");
			return;
		}
		else {
			if(!validateEmail(from)) {
				alert("Please enter a valid email.");
				return;
			} 
		}
		if(!message) {
			alert("Message is required.");
			return;
		}
		//TODO need some kind of url variable not hardcoded
		var url = "https://localhost/send";
		$.ajax({
			url: url,
			type: 'get',
			data: {sendername: sendername, from:from,subject:subject,message:message},
			success: function(data) {
				alert("Sent!");
				$("#sendername").val("");
				$("#from").val("");
				$("#subject").val("");
				$("#message").val("");
			},
			error: function(e) {
				alert("There was a problem sending the email");
			}
		})
	//})
}
