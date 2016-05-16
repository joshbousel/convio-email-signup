var $ = require('jquery');

$(function(){
	var $emailContainer = $('.convio-email-signup');
	var dataFields = $emailContainer.attr('data-fields').toLowerCase();
	var surveyID = $emailContainer.attr('data-surveyid');
	var thankYouMessage = $emailContainer.attr('data-thankyou') != '' ? $emailContainer.attr('data-thankyou') : 'Thank you for signing up';
	var hasFirstName = dataFields.indexOf("first") >= 0 ? true : false;
	var hasLastName = dataFields.indexOf("last") >= 0 ? true : false;
	var hasEmail = dataFields.indexOf("email") >= 0 ? true : false;
	var formHTML;
	
	var formHTML = '<div class="form-container">';		
	formHTML += '<style>.convio-email-signup { width: 80%; margin: 0 auto 15px; } .convio-email-signup .form-row { margin: 0 0 25px; } .convio-email-signup .input-full { width: 100%; } .convio-email-signup .input-text { box-shadow: none; border: 1px solid #e8e7e5; transition: border 0.2s ease-out; -webkit-appearance: none; -moz-appearance: none; appearance: none; } .convio-email-signup .input-text:focus { outline: none; border: 1px solid #A2A2A2; } .convio-email-signup .error { background-color: #cd4e38; border-radius: 4px; padding: 3px 15px; color: #fff; margin: 0 0 15px; } .convio-email-signup .hidden { visibility: hidden; opacity: 0; height: 0; } .convio-email-signup .input-error { border: 1px solid #cd4e38; } .convio-email-signup div, .convio-email-signup .error:not(.hidden) { opacity: 1; transition: opacity 0.2s ease-out; } .convio-email-signup .form-thanks { text-align: center; } </style>';
	
	formHTML += '<p class="error hidden">Hello</p>';
	
	if (hasFirstName) {
		formHTML += '<div class="form-row"><label class="color-primary type-small" for="first">First Name</label><input type="text" class="input-text input-full" name="first" id="first"></div>';
	}
	if (hasLastName) {
		formHTML += '<div class="form-row"><label class="color-primary type-small" for="last">Last Name</label><input type="text" class="input-text input-full" name="last" id="last"></div>';
	}
	if (hasEmail) {
		formHTML += '<div class="form-row"><label class="color-primary type-small" for="email">Email</label><input type="text" class="input-text input-full" name="email" id="email"></div>';
	}
	
	formHTML += '<a href="#" class="btn-large fill-callout inline-block">Submit</a>';
	formHTML += '</div>';
	formHTML += '<div class="form-thanks hidden">'+thankYouMessage+'</div>';
	
	$emailContainer.html(formHTML);
	
	$('.convio-email-signup .btn-large').on('click',function(e){
		e.preventDefault();
		
		var $first = $('.convio-email-signup #first');
		var $last = $('.convio-email-signup #last');
		var $email = $('.convio-email-signup #email');
		var errorClass = 'input-error';
		var errorBlock = $('.convio-email-signup .error');
		var errorCount = 0;
		
		$first.removeClass(errorClass);
		$last.removeClass(errorClass);
		$email.removeClass(errorClass);
		
		if (hasFirstName && $first.val() == '') {
			$first.addClass(errorClass);
			errorCount++;
		}
		if (hasLastName && $last.val() == '') {
			$last.addClass(errorClass);
			errorCount++;
		}
		if (hasEmail && $email.val() == '') {
			$email.addClass(errorClass);
			errorCount++;
		}
		if (errorCount != 0) {
			errorBlock.removeClass('hidden');
			errorBlock.html('Please complete the following fields:');
		} else {
			if (hasEmail && !isValidEmail($email.val())) {
				$email.addClass(errorClass);
				errorBlock.removeClass('hidden');
				errorBlock.html('That email address is not valid!');
			} else {
				var url = 'http://e.wcs.org/site/Survey?cons_info_component=t&SURVEY_ID='+surveyID+'&ACTION_SUBMIT_SURVEY_RESPONSE=Submit';	
				
				if (hasFirstName) {
					url += '&cons_first_name='+$first.val();
				}
				if (hasLastName) {
					url += '&cons_last_name='+$last.val();
				}
				if (hasEmail) {
					url += '&cons_email='+$email.val();
				}
							
				url = encodeURI(url)
				url = url.replace('#','%23');
				
				$.ajax({
					type: "POST",
					url: url
				}).always(function(){
					$('.convio-email-signup .form-thanks').removeClass('hidden');
					$('.convio-email-signup .form-container').addClass('hidden');
				});
			}
		}
	});
	
	function isValidEmail(str) {
		var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
		if (filter.test(str)) {
			return true;
		} else {
			return false;
		}
	}
});