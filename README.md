In this project, I created a constructor/library-ish thing to help me build and manage tabular data and table elements like `tr` and `td`.

It essentially uses an object to create a local data store from which you can add and replace objects.

## Setup
```js
var table = new dataTable("elementId");
```
### Container Element
Pass the HTML id attribute of the `table`, `thead`, `tbody`, or `tfoot`. Reference table.container will return this DOM object.
```js
var container = table.container;
```

## Methods
### .add ( *object* , *callback* );
Add objects to be stored in the table data array. Passes the added object to the callback function.
Accepts two parameters. The object to add to the table array, and a callback function to run after adding the object.

### .cell ( *string* );
Create a new table cell.
Returns a `td` as DOM Object. Accepts one string parameter for placing `.innerHTML` into the cell.
### .getData ();
Returns the table’s `data` array of objects.
### .getTotalOfColumn ( *string* );
Returns the total sum of a provided object key for each object in the table’s `data` array.
### .length ();
Returns the number of objects in the table’s `data` array. Useful for counting how many rows in the table data.
### .remove ( *index*, *callback* );
Remove a specific index from the `data` array. Will pass the removed item to the callback function.
### .row ();
Create a new table row.
Returns a `tr` as DOM Object. Accepts no parameters.

## Use Example
```js
var table = new dataTable("table");
var columns = ["ID", "Name", "Phone Number"];
var container = table.container;

var row = table.row();

for ( var i = 0; i < columns.length; i++ ) {
    var cell = table.cell( columns[i] );
    row.appendChild( cell );
}

container.appendChild( row );
```
**Creates:**

| ID            | Name          | PhoneNumber | Email | Url  |
| ------------- |:------------- | ----------- | ----- | ---- |

---

# Weekend Challenge 1
For your weekend challenge, you will need to create an application that records employees along with their salary. We also want to add the salaries up so we know how much we’re spending each month.

The application should first have an input form that collects the following:

* Employee First Name

* Employee Last Name

* ID Number

* Job Title

* Annual Salary

A 'Submit' button should clear out the inputs and your logic should store that information. Then, that information should be appended to the DOM so the user of the application can see the information they just entered.

Finally, your logic should calculate all of the employee salaries and report back the Monthly cost of salaries.

# Hard Mode
Create a delete button that removes an employee from the DOM. Note that in hard mode, it need not remove that Employee's salary from the reported total.

# Pro Mode
Once the employee is deleted, also update the total spend on salaries to discount the removed employee's salary. This will require that the logic knows which element was removed. You will need to stretch yourself for this one. I also recommend that you look into jQuery's .data() function to help complete this. Note, you will need to do something both when the employee is added and when they are deleted to make your application 'smart'.

Good Luck, have a great weekend!
