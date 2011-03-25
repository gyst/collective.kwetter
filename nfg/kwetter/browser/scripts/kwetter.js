/* javascript for kwetter microblogger */


var Kwetter = {};

Kwetter.reloadTimeoutID;
Kwetter.addedRules = new Object();
Kwetter.updateStylesheet = function(ids) 
{
	for (var name in ids) {
		cls = '.avatar-' + name;
		if (! Kwetter.addedRules[name]) {
			document.styleSheets[0].insertRule(cls + "{background: url(" + window.location.href + "/avatar/icon/" + name + ") no-repeat scroll 0 0;}",0);
			Kwetter.addedRules[name] = 1;
		}
	}
}

Kwetter.post = function(event)
{
	event.preventDefault();
	var action = jQuery('#timeline').attr("action");
	var form = jQuery(this);
	message = form.find('textarea[name="m"]').val();
	avatar = form.find('input[name="a"]');
	if (message) {
		jQuery.post(action, {avatar:avatar.val(), command:'post', message:message},
				function(data) { Kwetter.search(avatar); });
	}
}

Kwetter.search = function (elem, search, since, limit)
{
	var action = jQuery('#timeline').attr("action");
	var avatar = elem.val();
	var def_string = typeof(search) != 'undefined' ? search : '';
	var def_since = since || '2010-12-31 12:00:00';
	var def_limit = limit || 3;

	var postargs = { avatar: avatar, command: 'search', since: def_since, limit: def_limit };
	if (def_string)
		postargs['string'] = def_string;

	jQuery.post(action, postargs, Kwetter.update);

}
Kwetter.timeline = function (elem, since)
{
	var action = jQuery('#timeline').attr("action");
	var avatar = elem.val();
	if (! since)
		since='2010-12-31 12:00:00';

	jQuery.post(action, { avatar: avatar, command: 'timeline', since: since, }, Kwetter.update);
}

Kwetter.clear = function (elem)
{
	if (elem.attr("placeholder")) {
		elem.val(elem.attr("placeholder"));
		jQuery('#charsAllowed').html(140);
	}
	elem.click(function() { 
		window.clearTimeout(Kwetter.reloadTimeoutID);
		elem.val(''); 
	});
	elem.keypress(Kwetter.counter);
}

Kwetter.counter = function (event)
{
	var elem = jQuery(this);
	var curr = elem.val();
	var rest = 140 - curr.length;
	if (rest <= 0) {
		elem.val(curr.substring(0,139));
		rest = 0;
	}
	jQuery('#charsAllowed').html(rest);
}

Kwetter.update = function (data)
{
	// double decode...
	data = jQuery.parseJSON(data);
	data = jQuery.parseJSON(data);
	var ids = Object();
	var current = jQuery('#result').html();
	var out = '<div id="timeline_container">';
	for (var message in data['messages']) {
		var row = data['messages'][message];
		ids[row[0]] = row[0];
		out = out + '<span class="kwetter_msgcontainer' + ' avatar-' + row[0] + '">';
		out = out + '<span class="kwetter_avatar">' + row[0] + '</span>';
		out = out + '<span class="kwetter_message">' + row[1] + '</span>';
		out = out + '<span class="kwetter_datetime">' + row[2] +'</span>';
		out = out + '</span>';
	}
	out = out + '</div>';
	if (current != out) {
		jQuery('#result').hide().html(out).fadeIn(400);
	}
	message = jQuery('#timeline').find('textarea[name="m"]');
	Kwetter.clear(message);
	Kwetter.updateStylesheet(ids);
	Kwetter.reload(5000);
}

Kwetter.reload = function (delay)
{
	var avatar = jQuery('#timeline').find('input[name="a"]');
	Kwetter.reloadTimeoutID = window.setTimeout(Kwetter.search, delay, avatar);
}
