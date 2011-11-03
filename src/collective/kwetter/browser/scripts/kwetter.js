/* javascript for kwetter microblogger */


var Kwetter = {};

Kwetter.limit = 3; 			// default load limit
Kwetter.since = '2010-12-31 12:00:00';	// default date limit
Kwetter.string = '';
Kwetter.reloadTimeout = 5000;
Kwetter.previousdata = null;

Kwetter.reloadTimeoutID;
Kwetter.formID;
Kwetter.formInputAvatar;
Kwetter.formInputMessage = null;
Kwetter.formInputSearch = null;
Kwetter.resultID;
Kwetter.loadMoreID;
Kwetter.maxID = null;
Kwetter.avatar;

/*
 * helpers 
 *
 */

Kwetter.clear = function (elem)
{
	if (elem.attr("placeholder")) {
		elem.val(elem.attr("placeholder"));
		if (Kwetter.maxID)
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
	if (Kwetter.maxID)
		jQuery(Kwetter.maxID).html(rest);
}

/*
 *
 * commands
 *
 */

Kwetter.post = function(event)
{
	event.preventDefault();
	var action = jQuery(Kwetter.formID).attr("action");
	var form = jQuery(this);
	message = form.find(Kwetter.formInputMessage).val();
	if (message) {
		jQuery.post(action, { 
				avatar:Kwetter.avatar.val(), 
				command:'post', 
				message:message
			},
			function(data) { Kwetter.search(); });
	}
}

Kwetter.update_search = function(event)
{
	event.preventDefault();
	var action = jQuery(Kwetter.formID).attr("action");
	var form = jQuery(this);
	Kwetter.string = form.find(Kwetter.formInputSearch).val();
	Kwetter.search();

}
Kwetter.search = function ()
{
	var action = jQuery(Kwetter.formID).attr("action");
	var postargs = { avatar: Kwetter.avatar.val(), command: 'search', since: Kwetter.since, limit: Kwetter.limit, string: Kwetter.string };
	jQuery.post(action, postargs, Kwetter.show_timeline);
}

Kwetter.start_search = function(formID, inputAvatar, formInputSearch, resultID, loadMoreID)
{
	Kwetter.formID=formID;
	Kwetter.formInputAvatar=inputAvatar;
	Kwetter.formInputSearch=formInputSearch;
	Kwetter.resultID=resultID;
	Kwetter.loadMoreID=loadMoreID;

	var form = jQuery(Kwetter.formID);
	Kwetter.avatar = form.find(Kwetter.formInputAvatar);
	Kwetter.string = form.find(Kwetter.formInputSearch).val();
	form.submit(Kwetter.update_search);
	Kwetter.search();
	jQuery(loadMoreID).click(function() { Kwetter.limit = 2 * Kwetter.limit; Kwetter.search(); });
	Kwetter.clear(form.find(Kwetter.formInputSearch));
}

Kwetter.timeline = function ()
{
	var action = jQuery(Kwetter.formID).attr("action");
	var postargs = { avatar: Kwetter.avatar.val(), command: 'timeline', since: Kwetter.since, limit: Kwetter.limit };
	jQuery.post(action, postargs, Kwetter.show_timeline);
}


Kwetter.start_timeline = function(formID,inputAvatar,inputMessage,resultID,loadMoreID,maxID)
{
	Kwetter.formID=formID;
	Kwetter.formInputAvatar=inputAvatar;
	Kwetter.formInputMessage=inputMessage;
	Kwetter.resultID=resultID;
	Kwetter.loadMoreID=loadMoreID;
	Kwetter.maxID=maxID;

	var form = jQuery(Kwetter.formID);
	Kwetter.avatar = form.find(Kwetter.formInputAvatar);
	form.submit(Kwetter.post);
	Kwetter.search();
	jQuery(loadMoreID).click(function() { Kwetter.limit = 2 * Kwetter.limit; Kwetter.search(); });
	Kwetter.clear(form.find(Kwetter.formInputMessage));
}

Kwetter.updates = function()
{
	var action = jQuery(Kwetter.formID).attr("action");
	var postargs = { avatar: Kwetter.avatar.val(), command: 'updates', since: Kwetter.since, limit: Kwetter.limit };
	jQuery.post(action, postargs, Kwetter.show_updates);
}

Kwetter.start_updates = function(formID,inputAvatar,resultID,loadMoreID)
{
	Kwetter.formID=formID;
	Kwetter.formInputAvatar=inputAvatar;
	Kwetter.resultID=resultID;
	Kwetter.loadMoreID=loadMoreID;

	var form = jQuery(Kwetter.formID);
	Kwetter.avatar = form.find(Kwetter.formInputAvatar);
	jQuery(loadMoreID).click(function() { Kwetter.limit = 2 * Kwetter.limit; Kwetter.updates(); });
	Kwetter.updates();
}

Kwetter.show_timeline = function (data)
{
	if (Kwetter.previousdata == data) {
		Kwetter.reloadTimeoutID = window.setTimeout(Kwetter.search, Kwetter.reloadTimeout);
		return;
	}
	Kwetter.previousdata = data;

	var row;
	var kwet;
	var pdata = jQuery.parseJSON(data);

	var out = '<div id="' + Kwetter.resultID + '">';
	var url = /\b(http:\/\/\S+)/gi;
	var tag = /(\#\S+)/g;
	for (var k=0; k< pdata['messages'].length; k++) {
		row = pdata['messages'][k];
		kwet = row[1];
		if (kwet.match(url))
			kwet = kwet.replace(url,"<a href=\"$1\">$1</a>");
		if (kwet.match(tag)) {
			kwet = kwet.replace(tag,"<a href=\"@@search?s=$1\">$1</a>");
			kwet = kwet.replace('s=#','s=%23');
		}

		out = out + '<span class="kwetter_msgcontainer' + ' avatar-' + row[0] + '">';
		out = out + '<div class="kwetter_Image"><a href="@@author/' + row[0] + '">';
		out = out + '<img src="@@avatar/icon/' + row[0] + '"></a></div>';
		out = out + '<div class="kwetter_Block">';
		out = out + '<span class="kwetter_avatar"><a href="@@author/' + row[0] + '">' + row[3] + '</a></span>';
		out = out + '<span class="kwetter_message">' + kwet + '</span>';
		out = out + '<span class="kwetter_datetime">' + row[2] +'</span>';
		out = out + '</div></span>';
	}
	out = out + '</div>';
	jQuery(Kwetter.resultID).hide().html(out).fadeIn(400);
	Kwetter.reloadTimeoutID = window.setTimeout(Kwetter.search, Kwetter.reloadTimeout);
	if (Kwetter.formInputMessage) {
		inputElem = jQuery(Kwetter.formID).find(Kwetter.formInputMessage);
		if (inputElem)
			Kwetter.clear(inputElem);
	}
}

Kwetter.show_updates = function(data)
{
	if (Kwetter.previousdata == data) {
		window.setTimeout(Kwetter.updates, Kwetter.reloadTimeout);
		return;
	}
	Kwetter.previousdata = data;

	var row;
	var kwet;
	var pdata = jQuery.parseJSON(data);

	var out = '<div id="' + Kwetter.resultID + '">';
	var url = /\b(http:\/\/\S+)/gi;
	var tag = /(\#\S+)/g;
	for (var k=0; k< pdata['messages'].length; k++) {
		row = pdata['messages'][k];
		kwet = row[1];
		if (kwet.match(url))
			kwet = kwet.replace(url,"<a href=\"$1\">$1</a>");
		if (kwet.match(tag)) {
			kwet = kwet.replace(tag,"<a href=\"@@search?s=$1\">$1</a>");
			kwet = kwet.replace('s=#','s=%23');
		}

		out = out + '<span class="kwetter_msgcontainer' + ' avatar-' + row[0] + '">';
		out = out + '<span class="kwetter_message">' + kwet + '</span>';
		out = out + '<span class="kwetter_datetime">' + row[2] +'</span>';
		out = out + '</span>';
	}
	out = out + '</div>';
	console.log(out);
	jQuery(Kwetter.resultID).hide().html(out).fadeIn(400);
	Kwetter.reloadTimeoutID = window.setTimeout(Kwetter.updates, Kwetter.reloadTimeout);
}

