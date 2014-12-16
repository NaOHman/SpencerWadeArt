$(document).ready(function() {
	console.log("ready");
	
});

var sendEmail = function() {
	var name, from, subject, message;
	//$("#send_email").click(function() {
		sendername=$("#sendername").val();
		from=$("#from").val();
		subject=$("#subject").val();
		message=$("#message").val();
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
				alert("Bah");
			}
		})
	//})
}
