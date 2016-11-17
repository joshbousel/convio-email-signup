var $ = require('jquery');

$(function(){
	var $emailContainer = $('.convio-survey');
	var surveyID = $emailContainer.attr('data-surveyid');
	var buttonLabel = ($emailContainer.attr('data-button-label') == 'undefined') ? $emailContainer.attr('data-button-label') : 'Submit';
	var reqs = [];
	var maps = [];
	var options;
	var states = ['AK','AL','AR','AZ','CA','CO','CT','DC','DE','FL','GA','HI','IA','ID','IL','IN','KS','KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH','NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VA','VT','WA','WI','WV','WY','AS','FM','GU','MH','MP','PR','PW','VI','AA','AE','AP','AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT','None'];
	var $thanks = $('.convio-survey .thanks');
	var formHTML = '<div class="form-container">';
	formHTML += '<style>.convio-survey { width: 80%; margin: 0 auto 15px; } .convio-survey .form-row { margin: 0 0 25px; } .convio-survey .input-full { width: 100%; } .convio-survey .input-text { box-shadow: none; border: 1px solid #e8e7e5; transition: border 0.2s ease-out; -webkit-appearance: none; -moz-appearance: none; appearance: none; } .convio-survey .input-text:focus { outline: none; border: 1px solid #A2A2A2; } .convio-survey .error { background-color: #cd4e38; border-radius: 4px; padding: 3px 15px; color: #fff; margin: 0 0 15px; } .convio-survey .hidden { visibility: hidden; opacity: 0; height: 0; } .convio-survey .input-error { border: 1px solid #cd4e38; } .convio-survey div, .convio-survey .error:not(.hidden) { opacity: 1; transition: opacity 0.2s ease-out; } .convio-survey .form-thanks { text-align: center; } .convio-survey select { background-image: url(/assets/icons/24/arrow-down-cb2c84cb2617db1cfd9f10dc924a3791.svg); background-position: 98% 65%; background-repeat: no-repeat; } .convio-survey .btn-large { color: #fff; }</style>';
	formHTML += '<p class="error hidden"></p>';

	$('.convio-survey input').each(function(){
		var $input = $(this);
		var id = $input.attr('data-id');
		reqs.push($input.attr('data-req'));
		maps.push($input.attr('data-map'));
		
		formHTML += '<div class="form-row"><label class="color-primary type-small" for="'+id+'">'+$input.attr('data-label')+'</label>';
		
		if ($input.attr('type') == 'select' || $input.attr('type') == 'state') {
			if ($input.attr('type') == 'state') {
				options = states;
			} else {
				options = $input.attr('data-options').split('::');
			}
			
			var selected =  $input.attr('data-selected');
			
			if ($input.attr('type') == 'state') {
				options = states;
			}
			
			formHTML += '<select name="'+id+'" id="'+id+'" class="input-text input-full">';
			
			for (var i = 0; i < options.length; i++) {
				formHTML += '<option value="'+options[i]+'"';
				
				if (options[i] == selected) {
					formHTML += ' selected';
				}
				
				formHTML += '>'+options[i]+'</option>';
			}
			
			formHTML += '</select>';
		} else {
			formHTML += '<input type="'+$input.attr('type')+'" class="input-text input-full" name="'+id+'" id="'+id+'">';
		}
		formHTML += '</div>';
	});

	formHTML += '<a href="#" class="btn-large btn-large--submit fill-callout inline-block">'+buttonLabel+'</a>';
	formHTML += '</div>';
	formHTML += '<div class="form-thanks wysiwyg hidden">'+$thanks.html()+'</div>';
	$emailContainer.html(formHTML).show();
	
	$('.convio-survey .btn-large--submit').on('click',function(e){
		e.preventDefault();

		var vals = [];
		var $email = $('.convio-survey #email');
		var errorClass = 'input-error';
		var errorBlock = $('.convio-survey .error');
		var errorCount = 0;
		var totalInputs = 0;
		var offset = $('.convio-survey').offset();
		
		$('.convio-survey .input-full').each(function(i){
			var $input = $(this);
			var val = $input.val();
			vals.push(val);
			$input.removeClass(errorClass);
			totalInputs++;
			
			if (reqs[i] == 'true' && val == '') {
				$input.addClass(errorClass);
				errorCount++;
			}
		});
		
		if (errorCount != 0) {
			errorBlock.removeClass('hidden');
			errorBlock.html('Please complete the following fields:');
			$('html, body').animate({ scrollTop: offset.top }, 250);
		} else {
			if ($email.length && !isValidEmail($email.val())) {
				$email.addClass(errorClass);
				errorBlock.removeClass('hidden');
				errorBlock.html('That email address is not valid!');
				$('html, body').animate({ scrollTop: offset.top }, 250);
			} else {
				var url = 'https://secure3.convio.net/wcs/site/SSurvey?cons_info_component=t&SURVEY_ID='+surveyID+'&ACTION_SUBMIT_SURVEY_RESPONSE=Submit';
								
				for (var i = 0; i < totalInputs; i++) {
					url += '&'+maps[i]+'='+vals[i];
				}
							
				url = encodeURI(url);
				url = url.replace('#','%23');
				
				$.ajax({
					type: "POST",
					url: url
				}).always(function(){
					$('.convio-survey .form-thanks').removeClass('hidden');
					$('.convio-survey .form-container').addClass('hidden');
					$('html, body').animate({ scrollTop: offset.top }, 250);
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