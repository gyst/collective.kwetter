/* javascript for kwetter microblogger */


function kwetter_post(event)
{
	event.preventDefault();
	var action = $('#timeline').attr("action");
	var $form = $(this);
	message = $form.find('input[name="m"]').val();
	avatar = $form.find('input[name="a"]');
	$.post(action, {avatar:avatar.val(), command:'post', message:message},
			function(data) { kwetter_timeline(avatar); });
}

function kwetter_timeline(elem)
{
	var action = $('#timeline').attr("action");
	var avatar = elem.val();
	$.post(action, { avatar: avatar, command: 'timeline', since: '2010-12-31 12:00:00', }, 
			kwetter_update);

}

function kwetter_clear(elem)
{
	if (elem.attr("placeholder"))
		elem.val(elem.attr("placeholder"));
	elem.click(function() { elem.val(''); });
	elem.keypress(kwetter_counter);
}

function kwetter_counter(event)
{
	var elem = $(this);
	var curr = elem.val();
	var rest = 140 - curr.length;
	if (rest <= 0) {
		elem.val(curr.substring(0,139));
		rest = 0;
	}
	$('#charsAllowed').html(rest);
}

function kwetter_update(data)
{
	$('#result').html(data);
	/*
	var out = '<div id="timeline_container">';
	for (var message in data['messages']) {
		out = out + 'message<br/>';
	}
	out = out + '</div>';
	$('#result').html(out);
	*/
}
