// Error Message Handler
var errorAlert = function ( message, showAlert ) {
	// If show alert is true
	if ( showAlert === true ) {
		// Alert the user
		alert( message );
	}
	// Console.log the error message
	console.error( message );

	return false;
};

var table = function ( options ) {

	var data = [];

	// Simple node creation
	var createElement = function ( node, text ) { // I know, name space, shoot me.

		// Create an element with the given parameter
		var element = document.createElement( node );

		// Find the data type of text
		var textType = typeof text;

		// Only add the text to the DOM if it is something worthwile
		switch ( textType ) {
			case "string":
			case "number":
			case "symbol":
				element.innerHTML = text;
				break;
		}

		// Send the element back
		return element;

	};
	
	var addRow = function ( obj ) {

		// Push an object to the data array
		return data.push( obj );

	};

	var removeRow = function ( index ) {

		// If index is an object, I'm assuming it is a click event
		// So I need to get the attribute from the click event element
		if ( typeof index === "object" ) {
			index = this.getAttribute("data-index");
		}

		// Splice the indexed number from the data arry
		data.splice( index, 1 );

		// Update the table display		
		return refreshTable();

	};


	var removeRowEvent = function ( index ) {

		// If index is an object, I'm assuming it is a click event
		// So I need to get the attribute from the click event element
		if ( typeof index === "object" ) {
			index = this.getAttribute("data-index");
		}

		// Splice the indexed number from the data arry
		data.splice( index, 1 );

		// Update the table display		
		return refreshTable();

	};

	var refreshTable = function () {

		var container = document.getElementById( "data-display" );

		container.innerHTML = "";

		for( var i = 0; i < data.length; i++ ) {

			// Create the employee row
			var row = createElement( "tr" );

			var photo = createElement( "img" );
			photo.setAttribute( "src", "images/user-circle.svg");
			photo.setAttribute( "title", data[i].firstName + " " + data[i].lastName );
			photo.setAttribute( "alt", "Photo of " + data[i].firstName + " " + data[i].lastName );

			var photoCell = createElement( "td" );

			photoCell.appendChild( photo );

			row.appendChild( photoCell );

			// For Loop of Every Thing INside the Object
			for( var item in data[i] ) {
				var cell = createElement( "td", data[i][item] );
				row.appendChild( cell );
			}

			// Add monthly salary cell

			var monthlyCell = createElement( "td", Math.round( data[i].salary / 12 ) );
			row.appendChild( monthlyCell );

			// Add Actions Cells and Buttons
			var removeBtnImg = createElement( "img" );
			removeBtnImg.setAttribute( "src", "images/user-circle.svg");
			removeBtnImg.setAttribute( "title", "Remove " + data[i].firstName + " " + data[i].lastName );
			removeBtnImg.setAttribute( "alt", "Click to remove " + data[i].firstName + " " + data[i].lastName );

			var removeBtn = createElement( "button" );
			removeBtn.setAttribute("data-index", i);

			removeBtn.appendChild( removeBtnImg );
			removeBtn.addEventListener( "click", removeRow );

			var actionsCell = createElement( "td" );

			actionsCell.appendChild( removeBtn );

			row.appendChild( actionsCell );

			container.appendChild( row );

		}

		return data;

	};

	// Methods

	this.add = function ( obj, callback ) {
		if ( addRow( obj ) && typeof callback === "function" ) {
			return callback();
		} else {
			return false;
		}
	};

	this.remove = function ( index, callback ) {
		if ( removeRow( index ) && typeof callback === "function" ) {
			return callback();
		} else {
			return false;
		}
	};

	this.refresh = function () {
		(options.onRefresh)();
		return refreshTable();
	};

	this.getData = function () {
		return data;
	};

};

var employees = new table({
	onRefresh: this.getTotalMonthly
});

employees.submitForm = function () {

	// Get all Inputs and Set Them As Variables
	var employeeIdInput	= document.getElementById("employeeIdInput");
	var firstNameInput	= document.getElementById("firstNameInput");
	var lastNameInput	= document.getElementById("lastNameInput");
	var jobTitleInput	= document.getElementById("jobTitleInput");
	var salaryInput		= document.getElementById( "salaryInput" );

	if ( employeeIdInput.value === "" &&
		 firstNameInput.value === "" && 
		 lastNameInput.value === "" &&
		 jobTitleInput.value === "" &&
		 salaryInput.value === "") {
			errorAlert("All form fields required.", true);
			return false;
	}

	// Sanitize Salary Input to ensure it is a number
	// If we can't make a number, send an error and notify user

	var salaryCheck = salaryInput.value;
	var employeeSalary = 0;

	//console.log( "Begin Salary Check:", salaryCheck );

	salaryCheck = salaryCheck.split("");

	if( salaryCheck[0] === "$" ) {
		salaryCheck.shift();
	}

	// Loop to check the other digits
	for ( var i = 0; i < salaryCheck.length; i++ ) {
		// Establish each digit
		var digit = parseInt( salaryCheck[i] );
		
		// If the digit is not a number
		if ( isNaN( salaryCheck[i] ) ) {
			// Alert the user, leave everything in the form
			errorAlert( "Salary must be a number.", true );
			return false; // 
		} else {
			// Rebuild the new salaryInput with an integer
			employeeSalary += salaryCheck[i];
		}
	}

	// Coerce the built salary to an integer
	employeeSalary = parseInt( employeeSalary );

	// If the final result is not a number
	if ( isNaN( employeeSalary ) ) {
		errorAlert( "There was a problem with the salary." );
		return false;
	}

	// console.log( "Sanitized Salary:", employeeSalary );

	// Create the object

	var newEmployee = {
		employeeId: employeeIdInput.value,
		firstName: firstNameInput.value,
		lastName: lastNameInput.value,
		jobTitle: jobTitleInput.value,
		salary: employeeSalary
	};

	// Add it to the table data
	this.add( newEmployee, function() {
		// Refresh the table
		// Update the Total Monthly Expenditure
		var container = document.getElementById( "total-monthly" );

		// console.log( employees.getTotalMonthly() );

		container.innerHTML = employees.getTotalMonthly();

		// Clear form
		employeeIdInput.value	= "";
		firstNameInput.value	= "";
		lastNameInput.value		= "";
		jobTitleInput.value		= "";
		salaryInput.value		= "";

	});

	this.refresh();
};

employees.getTotalMonthly = function () {
	var total = 0;
	var data = this.getData();
	for( var i = 0; i < data.length; i++ ) {
		total += data[i].salary;
	}
	return Math.round( total / 12 );
};


// Add some fake data to play with
function mrRobot() {

	employees.add({
		id: "01",
		firstName: "Elliot",
		lastName: "Alderson",
		jobTitle: "Mr. Robot",
		salary: 0
	});

	employees.add({
		id: "02",
		firstName: "Darlene",
		lastName: "Alderson",
		jobTitle: "Hacker Chick",
		salary: 100000
	});

	employees.add({
		id: "03",
		firstName: "Angela",
		lastName: "Moss",
		jobTitle: "Marketing Director",
		salary: 95000
	});

	employees.add({
		id: "04",
		firstName: "Tyrell",
		lastName: "Wellick",
		jobTitle: "Unemployeed",
		salary: 250000
	});

	employees.add({
		id: "05",
		firstName: "Joanna",
		lastName: "Wellick",
		jobTitle: "Housewife",
		salary: 0
	});

	employees.add({
		id: "06",
		firstName: "Phillip",
		lastName: "Price",
		jobTitle: "Chief Executive Office",
		salary: 9000000
	});

	employees.add({
		id: "07",
		firstName: "Gideon",
		lastName: "Goddard",
		jobTitle: "Deceased",
		salary: 0
	});

	employees.add({
		id: "08",
		firstName: "Ollie",
		lastName: "Parker",
		jobTitle: "Computer Analyst",
		salary: 65000
	});

	var container = document.getElementById( "total-monthly" );

	container.innerHTML = employees.getTotalMonthly();

	employees.refresh();

}