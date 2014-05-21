$(document).ready(function() {
	var communityUrl = 'http://linc03.dev.lcloud.com';
	var v1ApiBase = communityUrl + '/restapi/vc';
	var v2ApiBase = communityUrl + '/api/2.0b/search?q=';
	$.post(v1ApiBase +'/authentication/sessions/login?user.login=linc&user.password=LithiumNow!&restapi.response_format=json&restapi.response_style=-types', function(data) {
		console.log('Authentication response:');
		console.log(data);
		$('#sessionKey').val(data.response.value);
	});
	var pageHash = btoa(window.location.href);
	console.log(pageHash);
	$.get(v2ApiBase + 'SELECT * FROM messages where body matches "'+pageHash+'"', function(data) {
		if (data.response.data.size > 0) {
			$('#messageId').val(data.response.data.items[0].id);
			console.log("found a message");
			$.get(v2ApiBase + 'SELECT id, author, body, post_time FROM messages WHERE topic.id = "'+$('#messageId').val()+'" and depth > 0 order by post_time desc', function(data) {
				var $responseData = $(data.response.data.items);
				console.log("raw get response data:");
				console.log(data);
				$.each($responseData, function(key, value) {
					console.log(value);
					$('#lithBoxMessages').append('<div class="reply"><p class="author">'+value.author.login+' said:</p><p class="body">'+value.body+'</p><p class="time">at '+value.post_time+'</p></div>');
				});
			});
		} else {
			console.log("didn't find a message for this page; creating one");
			var postData = { 
					'message.body' : 'Check out this content at ' + window.location.href + '<br/>'+pageHash,
					'message.subject' : document.title,
					'tag.add' : pageHash
			};
			console.log(postData);
			$.post(v1ApiBase + '/boards/id/Appliances/messages/post?restapi.session_key='+$('#sessionKey').val()+'&restapi.response_format=json&restapi.response_style=-types', postData, function(data) {
				console.log(data);
				console.log("message id for page is " + data.response.message.id);
				$('#messageId').val(data.response.message.id);
				$.get(v2ApiBase + 'SELECT id, author, body, post_time FROM messages WHERE topic.id = "'+$('#messageId').val()+'" and depth > 0 order by post_time desc', function(data) {
					var $responseData = $(data.response.data.items);
					console.log("raw get response data:");
					console.log(data);
					$.each($responseData, function(key, value) {
						console.log(value);
						$('#lithBoxMessages').append('<div class="reply"><p class="author">'+value.author.login+' said:</p><p class="body">'+value.body+'</p><p class="time">at '+value.post_time+'</p></div>');
					});
				});
			});
		}
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
			var html = '<div class="reply"><p class="author">'+data.response.message.author.login+' said:</p><p class="body">'+data.response.message.body+'</p<p class="time">at '+value.post_time+'</p>></div>';
			$('#lithBoxMessages').prepend(html);
			$('#lithBoxPost').val('');
		});
	});
});