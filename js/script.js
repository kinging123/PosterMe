var isFull = false,
	lastInput = false,
	objectId = 0,
	lengths = [0,0,0];
$(function () {
	Parse.initialize('7qm08CMRj7OIpwwMnapjlVFNyAEz68ntlm0UOsdJ', 'ZMRq4gZPgnPyWO5IGezljL6SxiXzFsfiJZS4nJUj');

	nextPoster();


	/*$('.keyboard .input input').keyup(function () {
		$(this).parent().next('.form-group').find('input').focus();
	});*/
	
	$('.letter').click(function () {
		isFull = true;
		$('.input-letter').each(function () {
			if($(this).val().length < 1)
				isFull = false;
		});

		if(isFull) {
			return false;
		}
		

		for(var i=0, input = $('.input-letter')[i];$(input).val().length >= 1;i++, input = $('.input-letter')[i]) {


		}

		$(input).val($(this).text());


		isFull = true;
		$('.input-letter').each(function () {
			if($(this).val().length < 1)
				isFull = false;
		});

		if(isFull) {
			checkAnswer();
		}

	});

	$('.backspace').click(function () {
		$('.input-letter').each(function () {
			if($(this).val().length >=1)
				lastInput = $(this);
		});

		lastInput.val('');
	});




});


function nextPoster () {
	Parse.Cloud.run('getImage', {}, {
		success: function (data) {
			data = JSON.parse(data);

			image = data.img;
			letters = data.letters;
			objectId = data.objectId;
			lengths = data.name_length;

			$('.poster').css('background-image', 'url(' + image + ')');

			for (var i = 0; i < letters.length; i++) {
				$this = $('.letter')[i];
				$($this).text(letters[i]);
			};

			$input = $('.keyboard .input');

			$input.empty();

			for (var i = 0; i < lengths.length; i++) {
				for (var ii = 0; ii < lengths[i]; ii++) {
					$input.append('<div class="form-group has-warning">'+
              						'<input class="input-letter form-control" type="text" maxlength="1" placeholder="" />'+
						          '</div>');
				};

				$input.append('<div class="divider"></div>');
			};

		},

		error: function (error) {
			console.error(error);
		}
	});
}

function checkAnswer () {
	var answer = '',
		i = 0,
		ii = 0;

	$('.input-letter').each(function () {
		answer += $(this).val();
		i++;
		if(i >= lengths[ii]) {
			i = 0;
			ii++;
			answer += ' ';
		}
	});

	Parse.Cloud.run('submitAnswer', {itemID: objectId, guess: answer.trim()}, {
		success: function (data) {
			if(data == 'true') {
				alert("Yay!");
				nextPoster();
			} else {
				alert("Wrong! try again...");
			}
		},

		error: function (error) {
			console.error(error);
		}
	});

	
}