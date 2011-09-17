/* javascript for kwetter microblogger */


var Kwetter = {};

Kwetter.limit = 3; 			// default load limit
Kwetter.since = '2010-12-31 12:00:00';	// default date limit
Kwetter.reloadTimeout = 5000;
Kwetter.previousdata = null;

Kwetter.reloadTimeoutID;
Kwetter.formID;
Kwetter.formInputAvatar;
Kwetter.formInputMessage;
Kwetter.resultID;
Kwetter.loadMoreID;
Kwetter.maxID;
Kwetter.avatar;

Kwetter.addedRules = new Object();

Kwetter.start = function(formID,inputAvatar,inputMessage,resultID,loadMoreID,maxID)
{
	Kwetter.formID=formID;
	Kwetter.formInputAvatar=inputAvatar;
	Kwetter.formInputMessage=inputMessage;
	Kwetter.resultID=resultID;
	Kwetter.loadMoreID=loadMoreID;
	Kwetter.maxID=maxID;

	var form = jQuery(Kwetter.formID);
	Kwetter.avatar = form.find(Kwetter.formInputAvatar);
	var message = form.find(Kwetter.formInputMessage);
	form.submit(Kwetter.post);
	Kwetter.search(Kwetter.avatar);
	jQuery(loadMoreID).click(function() {
			Kwetter.limit = 2 * Kwetter.limit;
			Kwetter.search(Kwetter.avatar);
			});
	Kwetter.clear(message);
}

Kwetter.post = function(event)
{
	event.preventDefault();
	var action = jQuery(Kwetter.formID).attr("action");
	var form = jQuery(this);
	message = form.find(Kwetter.formInputMessage).val();
	if (message) {
		jQuery.post(action, {avatar:Kwetter.avatar.val(), command:'post', message:message},
				function(data) { Kwetter.search(Kwetter.avatar); });
	}
}

Kwetter.search = function (elem, search, since, limit)
{
	var action = jQuery(Kwetter.formID).attr("action");
	var avatar = typeof(elem) != 'undefined' ? elem.val() : Kwetter.avatar.val();
	var def_string = typeof(search) != 'undefined' ? search : '';
	var def_since = since || Kwetter.since;
	var def_limit = limit || Kwetter.limit;

	var postargs = { avatar: avatar, command: 'search', since: def_since, limit: def_limit };
	if (def_string) postargs['string'] = def_string;

	jQuery.post(action, postargs, Kwetter.update);

}
Kwetter.timeline = function (elem, since)
{
	var action = jQuery(Kwetter.formID).attr("action");
	var avatar = elem.val();
	if (! since) since='2010-12-31 12:00:00';
	jQuery.post(action, { avatar: avatar, command: 'timeline', since: since, }, Kwetter.update);
}

Kwetter.clear = function (elem)
{
	if (elem.attr("placeholder")) {
		elem.val(elem.attr("placeholder"));
		jQuery(Kwetter.maxID).html(140);
	}
	elem.click(function() { 
		window.clearTimeout(Kwetter.reloadTimeoutID);
		if (elem.val() == elem.attr("placeholder"))
			elem.val(''); 
	});
	elem.keyup(Kwetter.counter);
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
	jQuery(Kwetter.maxID).html(rest);
}

Kwetter.update = function (data)
{
	if (Kwetter.previousdata == data) {
		Kwetter.reload(Kwetter.reloadTimeout);
		return;
	}
	Kwetter.previousdata = data;

	var row;
	var kwet;
	var pdata = jQuery.parseJSON(data);

	var ids = Object();
	var out = '<div id="timeline_container">';
	var url = /\b(http:\/\/\S+)/gi;
	for (var k=0; k< pdata['messages'].length; k++) {
		row = pdata['messages'][k];
		kwet = row[1];
		if (kwet.match(url))
			kwet = kwet.replace(url,"<a href=\"$1\">$1</a>");
		ids[row[0]] = row[0];

		out = out + '<span class="kwetter_msgcontainer' + ' avatar-' + row[0] + '">';
		out = out + '<div class="commentImage"><a href="author/' + row[0] + '">';
		out = out + '<img src="@@avatar/icon/' + row[0] + '"></a></div>';
		out = out + '<span class="kwetter_avatar">' + row[3] + '</span>';
		out = out + '<span class="kwetter_message">' + kwet + '</span>';
		out = out + '<span class="kwetter_datetime">' + row[2] +'</span>';
		out = out + '</span>';
	}
	out = out + '</div>';
	jQuery(Kwetter.resultID).hide().html(out).fadeIn(400);
	Kwetter.clear(jQuery(Kwetter.formID).find(Kwetter.formInputMessage));
	Kwetter.reload(Kwetter.reloadTimeout);
}

Kwetter.reload = function (delay)
{
	Kwetter.reloadTimeoutID = window.setTimeout(Kwetter.search, delay, Kwetter.avatar);
}


