//$(document).ready(function () {
$(function() {

	var $projects = $('.projects-container'), $projectsCards = $projects.children(".project");
	//$projectsCards.after($("<hr>"));

	$projectsCards.sort(sortByPrice_desc);
	$(".project+hr").detach();
	$projectsCards.detach().appendTo($(".projects-container"));
	//$projectsCards.after($("<hr>"));

	function sortByPrice_asc(a,b) {
		var an = a.getAttribute('data-price');
		var bn = b.getAttribute('data-price');
		console.log(an+", "+bn);
		return an-bn;
	}

	function sortByPrice_desc(a,b) {
		var an = a.getAttribute('data-price');
		var bn = b.getAttribute('data-price');
		console.log(an+", "+bn);
		return bn-an;
	}

	function sortByName_az(a,b) {
		var an = a.getAttribute('data-name');
		var bn = b.getAttribute('data-name');
		console.log(an+", "+bn);
		if(an > bn) {
			return 1;
		}

		if(an < bn) {
			return -1;
		}

		return 0;
	}

	function sortByName_za(a,b) {
		var an = a.getAttribute('data-name');
		var bn = b.getAttribute('data-name');
		console.log(an+", "+bn);
		if(an < bn) {
			return 1;
		}

		if(an > bn) {
			return -1;
		}

		return 0;
	}

	 function sortByMedium_az(a,b) {
		var an = a.getAttribute('data-medium');
		var bn = b.getAttribute('data-medium');
		console.log(an+", "+bn);
		if(an > bn) {
			return 1;
		}

		if(an < bn) {
			return -1;
		}

		return 0;
	}

	function sortByMedium_za(a,b) {
		var an = a.getAttribute('data-medium');
		var bn = b.getAttribute('data-medium');
		console.log(an+", "+bn);
		if(an < bn) {
			return 1;
		}

		if(an > bn) {
			return -1;
		}

		return 0;
	}

	function sortBySize_asc(a,b) {
		var an = a.getAttribute('data-size');
		var bn = b.getAttribute('data-size');
		console.log(a.getAttribute('data-name') + ": "+an+", "+b.getAttribute('data-name')+": "+bn);
		console.log(an-bn);

		return an-bn;
	}

	function sortBySize_desc(a,b) {
		var an = a.getAttribute('data-size');
		var bn = b.getAttribute('data-size');
		console.log(a.getAttribute('data-name') + ": "+an+", "+b.getAttribute('data-name')+": "+bn);
		console.log(an-bn);

		return bn-an;
	}

	function sortByDate_asc(a,b) {
		var an = a.getAttribute('data-date');
		var bn = b.getAttribute('data-date');
		console.log(an+", "+bn);
		if(an > bn) {
			return 1;
		}
		if(an < bn) {
			return -1;
		}
		return 0;
	}

	function sortByDate_desc(a,b) {
		var an = a.getAttribute('data-date');
		var bn = b.getAttribute('data-date');
		console.log(an+", "+bn);
		if(an < bn) {
			return 1;
		}
		if(an > bn) {
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
		var selected = $(this).find("a#sortItem").text();
		$("#dropdownMenu").text(selected);
		$("#dropdownMenu").append(' <span class="caret"></span>');
		$(this).find("a#sortItem").text(inButton);

		switch(selected) {
			case "Price: highest first":
				$projectsCards.sort(sortByPrice_desc);
				break;
			case "Price: lowest first":
				$projectsCards.sort(sortByPrice_asc);
				break;
			case "Name: A-Z":
				$projectsCards.sort(sortByName_az);
				break;
			case "Name: Z-A":
				$projectsCards.sort(sortByName_za);
				break;
			case "Medium: A-Z":
				$projectsCards.sort(sortByMedium_az);
				break;
			case "Medium: Z-A":
				$projectsCards.sort(sortByMedium_za);
				break;
			case "Size: lowest first":
				$projectsCards.sort(sortBySize_asc);
				break;
			case "Size: highest first":
				$projectsCards.sort(sortBySize_desc);
				break;
			case "Oldest":
				$projectsCards.sort(sortByDate_asc);
				break;
			case "Most Recent":
				$projectsCards.sort(sortByDate_desc);
				break;
			default:
				break;
		}

		$(".project+hr").detach();
		$projectsCards.detach().appendTo($(".projects-container"));
		//$projectsCards.after($("<hr>"));
	});


	





});
//});
