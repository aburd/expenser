// General
$(window).keydown(function(e) {
	if(e.ctrlKey == true){
    var key = (e.keyCode) ? e.keyCode : e.which;
    $('.key.c' + key).addClass('keydown');
  }
});

$(window).keyup(function(e) {
	if(e.ctrlKey == true){

		var key = (e.keyCode) ? e.keyCode : e.which;
    $('.key.c' + key).removeClass('keydown');

    switch(key){
	    // New Expense
	    case 69:
	    	$('#new-expense-row').slideToggle(500)
	    	break
			// New Category
			case 67:
	    	$('#new-category-row').slideToggle(500)
	    	break
			// Expense Measurer
			case 77:
	    	$('#expense-measure-row').slideToggle(500)
	    	break 	
	  	// New Income
	  	case 73:
	    	$('#new-income-row').slideToggle(500)
	    	break
    }

	}
});

