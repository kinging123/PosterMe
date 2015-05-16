if(!localStorage.getItem('points'))localStorage.setItem('points', '0');
$('.pointCount').text(localStorage.getItem('points'));

var isFull = false,
	lastInput = false,
	objectId = 0,
	lengths = [0,0,0],
	userPoints = 0;

function resizeStuff () {
	var height = $(document).height();

	$('#container').height(height-70);

	$('.poster').height(height-70-260 - 25);
}
$(function () {
	resizeStuff();

	$(window).resize(function () {
		resizeStuff();
	});

	Parse.initialize('**************', '*************'); // Our secret key!

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


	$('.controllers .hint').click(function () {
		getClue();
	});

	$('.controllers .skip').click(function () {
		if(addPoints(-20))
			nextPoster();
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

			$('.poster img').attr('src',  image );

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




function getClue () {
	if(parseInt(localStorage.getItem('points')) < 5)return false;
	Parse.Cloud.run('getClue', {itemID: objectId}, {
		success: function (data) {
			data = JSON.parse(data);

			$($('.input-letter')[data.position]).val(data.char);

			addPoints(-5);

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
			data = JSON.parse(data);
			if(data[0] == true) {
				alert("Yay!");
				nextPoster();
			} else {
				alert("Wrong! try again...");
			}

			addPoints(data[1]);
		},

		error: function (error) {
			console.error(error);
		}
	});

	
}

function addPoints (amount) {
	sum = parseInt(localStorage.getItem('points'))+amount;
	if(sum < 0)
		return false;

	localStorage.setItem('points', sum);
	$('.pointCount').text(localStorage.getItem('points'));

	return true;
}


