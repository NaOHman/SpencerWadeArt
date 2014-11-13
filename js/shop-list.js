//$(document).ready(function () {
$(function() {

	var $projects = $('.projects-container'), $projectsCards = $projects.children(".project");
	$projectsCards.after($("<hr>"));

	function sortByName(a,b) {
		var an = a.getAttribute('data-name');
		var bn = b.getAttribute('data-name');
		if(an > bn) {
			return 1;
		}

		if(an < bn) {
			return -1;
		}

		return 0;
	}

	 function sortByMedium(a,b) {
		var an = a.getAttribute('data-medium');
		var bn = b.getAttribute('data-medium');
		if(an > bn) {
			return 1;
		}

		if(an < bn) {
			return -1;
		}

		return 0;
	}

	/*TODO: this doesn't work if data-size="200.25" for example*/
	function sortBySize(a,b) {
		var an = a.getAttribute('data-size');
		var bn = b.getAttribute('data-size');
		if(an > bn) {
			return 1;
		}
		if(an < bn) {
			return -1;
		}
		return 0;
	}

	function sortByDate(a,b) {
		var an = a.getAttribute('data-date');
		var bn = b.getAttribute('data-date');
		if(an > bn) {
			return 1;
		}
		if(an < bn) {
			return -1;
		}
		return 0;
	}



	/*
	$projectsCards.sort(function(a,b) {
		var an = a.getAttribute('data-name');
		var bn = b.getAttribute('data-name');
		if(an > bn) {
			return 1;
		}

		if(an < bn) {
			return -1;
		}

		return 0;
	});
	*/


	$(".dropdown-menu li").on('click', function() {
		var inButton = $("#dropdownMenu").text();
		var selected = $(this).find("a").text();
		$("#dropdownMenu").text(selected);//<span class="caret"></span>);
		$("#dropdownMenu").append(' <span class="caret"></span>');
		$(this).find("a").text(inButton);

		if(selected=="Name") {
			$projectsCards.sort(sortByName);
		}
		else if(selected=="Medium") {
			$projectsCards.sort(sortByMedium);
		}
		else if(selected=="Size") {
			$projectsCards.sort(sortBySize);
		}

		$(".project+hr").detach();
		$projectsCards.detach().appendTo($(".projects-container"));
		$projectsCards.after($("<hr>"));
	});


	





});
//});