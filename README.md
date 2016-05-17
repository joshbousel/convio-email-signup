# Convio Survey Widget
This widget allows for addition of Convio survey forms to be used on WCS's primary CMS.

## Getting Started
The widget has a jQuery dependency that can bed installed via npm:
```
nmp install
```

main.js is the primary script for the widget. To compile the final output:
```
browserify main.js -o convio-signup.js
```

## Using the Widget
After referencing the script in the CMS, html must be added to create the form. Here's an example:
```
<div class="convio-survey" data-surveyid="14288" style="display: none;">
	<input type="text" data-id="first" data-req="true" data-map="cons_first_name" data-label="First Name">
	<input type="text" data-id="last" data-req="true" data-map="cons_last_name" data-label="Last Name">
	<input type="text" data-id="email" data-req="true" data-map="cons_email" data-label="Email">
	<div class="thanks">
		<p>Thank you for signing up</p>
	</div>
</div>
```

The main div has the following requirements:
- **class:** 'convio-survey'
- **data-surveyid:** The id of the Convio survery the form will submit to
- **style:** 'display: none;' *(optional: prevents flash of unstyled content)*

Next add inputs for each field you need on the form. Each field requires the following attributes:
- **type:** 'text' *Current only fields with the type of 'text' are supported*
- **data-id:** The id of the form field *For proper email validation, an email field must have this value set as 'email'*
- **data-req:** 'true' if the field is required, 'false' if it is not
- **data-map:** The corresponding field name in Convio *ie: 'cons_email'*
- **data-label:** The label to appear above the field

Finally, to display a thank you message, a div with the class of 'thanks' must be added. Any html within this div will display after the form is successfully submitted.