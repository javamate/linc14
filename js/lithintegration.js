$(document).ready(function() {
	var communityUrl = 'http://linc03.dev.lcloud.com';
	var v1ApiBase = communityUrl + '/restapi/vc';
	var v2ApiBase = communityUrl + '/api/2.0b/search?q=';
	$.post(v1ApiBase +'/authentication/sessions/login?user.login=linc&user.password=LithiumNow!&restapi.response_format=json&restapi.response_style=-types', function(data) {
		console.log('Authentication response:');
		console.log(data);
		$('#sessionKey').val(data.response.value);
	});
	$('#lithBoxPostButton').click('click.lithintegration', function() {
		console.log('post button clicked');
		var postData = { 
			'message.body' : $('#lithBoxPost').val(),
			'message.subject' : document.title
		};
		console.log(postData);
		$.post(v1ApiBase + '/messages/id/'+$('#messageId').val()+'/reply?restapi.session_key='+$('#sessionKey').val()+'&restapi.response_format=json&restapi.response_style=-types', postData, function(data) {
			console.log(data);
			var html = '<div class="reply"><p class="author">'+data.response.message.author.login+'</p><p class="body">'+data.response.message.body+'</p></div>';
			$('#lithBoxMessages').prepend(html);
		});
	});
	$.get(v2ApiBase + 'SELECT id, body, author FROM messages WHERE topic.id = "139" and depth > 0', function(data) {
		var $responseData = $(data.response.data.items);
		console.log("raw get response data:");
		console.log(data);
		$.each($responseData, function(key, value) {
			console.log(value);
			$('#lithBoxMessages').append('<div class="reply"><p class="author">'+value.author.login+'</p><p class="body">'+value.body+'</p></div>');
		});
	});
});