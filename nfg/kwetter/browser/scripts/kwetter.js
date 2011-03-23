/* javascript for kwetter microblogger */


var reloadTimeoutID;

function kwetter_post(event)
{
	event.preventDefault();
	var action = $('#timeline').attr("action");
	var $form = $(this);
	message = $form.find('textarea[name="m"]').val();
	avatar = $form.find('input[name="a"]');
	if (message) {
		$.post(action, {avatar:avatar.val(), command:'post', message:message},
				function(data) { kwetter_search(avatar); });
	}
}

function kwetter_search(elem, search, since, limit)
{
	var action = $('#timeline').attr("action");
	var avatar = elem.val();
	var def_string = typeof(search) != 'undefined' ? search : '';
	var def_since = since || '2010-12-31 12:00:00';
	var def_limit = limit || 3;

	var postargs = { avatar: avatar, command: 'search', since: def_since, limit: def_limit };
	if (def_string)
		postargs['string'] = def_string;

	$.post(action, postargs, kwetter_update);

}
function kwetter_timeline(elem, since)
{
	var action = $('#timeline').attr("action");
	var avatar = elem.val();
	if (! since)
		since='2010-12-31 12:00:00';

	$.post(action, { avatar: avatar, command: 'timeline', since: since, }, kwetter_update);
}

function kwetter_clear(elem)
{
	if (elem.attr("placeholder")) {
		elem.val(elem.attr("placeholder"));
		$('#charsAllowed').html(140);
	}
	elem.click(function() { 
		window.clearTimeout(reloadTimeoutID);
		elem.val(''); 
	});
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
	// double decode...
	data = jQuery.parseJSON(data);
	data = jQuery.parseJSON(data);
	var current = $('#result').html();
	var out = '<div id="timeline_container">';
	for (var message in data['messages']) {
		var row = data['messages'][message];
		out = out + '<span class="kwetter_msgcontainer">';
		out = out + '<span class="kwetter_avatar">' + row[0] + '</span>';
		out = out + '<span class="kwetter_message">' + row[1] + '</span>';
		out = out + '<span class="kwetter_datetime">' + row[2] +'</span>';
		out = out + '</span>';
	}
	out = out + '</div>';
	if (current != out) {
		$('#result').hide().html(out).fadeIn('fast');
	}
	message = $('#timeline').find('textarea[name="m"]');
	kwetter_clear(message);
	kwetter_reload(5000);
}

function kwetter_reload(delay)
{
	var avatar = $('#timeline').find('input[name="a"]');
	reloadTimeoutID = window.setTimeout(kwetter_search, delay, avatar);
}
