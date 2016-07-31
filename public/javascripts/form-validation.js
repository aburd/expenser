var constraints = {
	'add-description':{
		presence: true,
		length: {
			minimum: 5
		}
	},
	'add-date': {
		presence: true,
		format: {
			pattern: /\d{4}-\d{2}-\d{2}/,
			message: "Not a valid date."
		}
	},
	'add-amount': {
		presence: true,
		format: {
			pattern: /\d+(\.\d*)?/,
			message: "Amount must be a number"
		}
	},
	'add-category': {
		presence: true
	}	
}

// Hook up the form
var form = document.querySelector('form[name="add-expense"]')
form.addEventListener("submit", function(ev){
	// Prevent page refresh
	ev.preventDefault()
	// Get values from form
	var submission = getSubmission(ev)
	handleFormSubmit(form, submission)
})

// Get values from form
function getSubmission(event){
	var formObj = {}
	$(event.target).find('input, select, textarea').each((i, el)=>{
		formObj[el.name] = el.value
	})
	return formObj
}

// Hook up all inputs to validate on the fly
var inputs = document.querySelectorAll('form[name="add-expense"] input, form[name="add-expense"] select, form[name="add-expense"] textarea');
// Date picker has a seperate event for change
$("#datepicker").datepicker({
	  onSelect: function(dateText) {
			var errors = validate(form, constraints) || {}
			showErrorsForInput(this, errors[this.name] )
	  }
});
// All other controls can use the 'change' event
for(var i = 0; i < inputs.length; i++){
	
	inputs[i].addEventListener("change", function(){
		var errors = validate(form, constraints) || {}

		showErrorsForInput(this, errors[this.name] )

		if(errors == {}){
			$(form).find('button[type="submit"]').prop('disabled', false)
		}
	})
}

// Function called to show errors on an individual control
function showErrorsForInput(input, errorArr){
	var formGroup = getFormGroup(input)
	// reset the group
	resetGroup(formGroup)
	if(errorArr != undefined){
		formGroup.classList.add('has-error')
		// append any errors
		errorArr.forEach(function(error){
			var errEl = document.createElement('p')
			errEl.className = 'error'
			errEl.innerHTML = error
			formGroup.appendChild(errEl)	
		})	
	} else {
		formGroup.classList.add('has-success')
	}
	
}

function getFormGroup(input) {
	if(input.parentNode == null )
		return document
	else if(input.parentNode.classList.contains('form-group'))
		return input.parentNode
	else
		getFormGroup(input.parentNode)
}

function resetGroup(formGroup) {
	formGroup.classList.remove('has-error')
	formGroup.classList.remove('has-success')
	// take out any error msgs
	_.each(document.querySelectorAll('.error'), function(error){
		error.parentNode.removeChild(error)
	})
}

function handleFormSubmit(form, submission) {
	var errors = validate(form, constraints)
	// handle errors
	$(form).find('input, select, textarea').each((i, el)=>{
		showErrorsForInput(el, errors && errors[el.name] )
	})
	if(!errors){
		// Submit form
    $.ajax({
      url: 'expenses/add',
      type: 'POST',
      data: submission,
      success: resetFormFromSucess(form)
    })
    function resetFormFromSucess(theForm){
    	console.log('Form submitted.')
	    // Reset form
			$(theForm).find('button[type="submit"]').prop('disabled', true)
			$(theForm).find('input, select, textarea').val('')
			$(theForm).find('input, select, textarea').removeClass('has-success')	
    }
		
	}

}