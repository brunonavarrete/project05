+(function(){
	// back to results
	function backToResults(){
		$('#album-data').fadeOut(400);
		$('body,html').attr('style','');
	}
	// search
	$('.search-form').submit(function(e){
		// preventDefault
			e.preventDefault();
		// query
			var query = $('#search').val();
			// if input is not empty
			if( query.length ){ 
				// getJSON
				query = 'album:'+query;
				$.getJSON('https://api.spotify.com/v1/search',
					{
						q: query,
						type: 'album',
					},
					function( data ){
						var items = data.albums.items;
						// results
							if( Object.keys( items ).length ){ 
								var listItemsHTML = '';
								$.each( items, function( i, album ){
									listItemsHTML += '<li class="album" data-id="'+album.id+'">';
									listItemsHTML += '<div class="album-wrap">';
									listItemsHTML += '<img class="album-art" src="'+album.images[0].url+'">';
									listItemsHTML += '</div>';
									listItemsHTML += '<span class="album-title">'+album.name+'</span>';
									for (var i = 0; i < album.artists.length; i++) {
										listItemsHTML += '<span class="album-artist">'+album.artists[i].name+'</span>';
									};
									listItemsHTML += '</li>';      
								});
								$('#albums').html( listItemsHTML );
							} else { // no results
								$('#albums').html( '<li class="no-albums desc"><i class="material-icons icon-help">help_outline</i>No albums found that match: [ '+query.replace('album:','')+' ]</li>' );
							}
						// back to results
							backToResults();
						// scrollTop to beginning
							$(window).scrollTop(0);
					}

					);
			} else {
				$('#albums').html( '<li class="desc"><i class="material-icons icn-album">album</i>Search for your favorite albums!</li>' );
			}
	});
	// show data
	$(document).on('click','li.album',function(){
		var id = $(this).attr('data-id');
		$.get('https://api.spotify.com/v1/albums/'+id,
			function( data ){
				console.log(data);
				// album cover
					$('#album-data .album-cover').html('<img src="'+data.images[0].url+'">');
				// album's name
					var url = data.external_urls.spotify;
					var linkHTML = '<a href="'+url+'" target="_blank">'+data.name+' <small>('+data.release_date.slice(0,4)+')</small></a>';
					$('#album-data .album-info h1').html(linkHTML);
				// artist(s)
					var artistsHTML = '';
					for (var i = 0; i < data.artists.length; i++) {
						artistsHTML += '<span>'+data.artists[i].name+'</span>';
					};
					$('#album-data .album-info h2').html(artistsHTML);
				// track(s)
					var tracksHTML = '';
					for (var i = 0; i < data.tracks.items.length; i++) {
						tracksHTML += '<li>'+data.tracks.items[i].name+'</li>';
					};
					$('#album-data .album-info .tracks').html(tracksHTML);
				// button
					$('a.btn.go').attr('href',url);
			}
		);
		$('#album-data').fadeIn(400);
		$('body,html').css('overflow','hidden');
	});
	// hide data
	$(document).on('click','.buttons a.back',function(){
		backToResults();
	});
})();