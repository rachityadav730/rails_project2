(function () {

	var lastMovieID = 0;

	//Main Functions
	function movieGetRenderedTemplate(data){

		var source   = $('#template-movie-info').html();
		var template = Handlebars.compile(source);
		var html     = template({ 
									 id: 					data.id
									,title: 				data.title
									,overview: 				data.overview
									,year: 					data.year
									,released: 				data.released
									,trailer: 				data.trailer
									,runtime: 				data.runtime
									,tagline: 				data.tagline
									,certification: 		data.certification
									,imdb_id: 				data.imdb_id
									,tmdb_id: 				data.tmdb_id
									,poster: 				data.poster
									,released_formatted: 	data.released_formatted
								});
		return html;
	};

	function hideOtherMoviePosterContainers(movieID){
	    var $clickedMovie = $(".js-movie-item-" + movieID);
	    $clickedMovie.addClass('active');

	    //Clear Previous Containers
	    $clickedMovie.prevAll(".js-movie-info-container").empty();

	    //Clear containers after the first matching container
	    $clickedMovie.nextAll('.js-movie-info-container-lg').first().nextAll('.js-movie-info-container-lg').empty();
	    $clickedMovie.nextAll('.js-movie-info-container-md').first().nextAll('.js-movie-info-container-md').empty();
	    $clickedMovie.nextAll('.js-movie-info-container-sm').first().nextAll('.js-movie-info-container-sm').empty();
	    $clickedMovie.nextAll('.js-movie-info-container-xs').first().nextAll('.js-movie-info-container-xs').empty();
	}

	//Events
	$(".js-movie-poster").on('click',function() {
		var movieID = $(this).parents('.js-movie-item').attr('data-movie-id');

		$(".movie.active").removeClass('active');

		//Show Loader
		$(".js-movie-info-container").empty().html(getLoaderHTML());
		hideOtherMoviePosterContainers(movieID);			                        

		//Show Movie
		if(lastMovieID == movieID){
			lastMovieID = 0;
			$(".js-movie-info-container").empty(); //clear previous items
		}else{
			lastMovieID = movieID;
			var infoURL  =   'movies/' + movieID + ".json";
			$.ajax({
				        type: "GET",
				        url:infoURL,
				        dataType:'json',
				        success: function( data, textStatus , jqXHR)
			                      {
		                      		var rendered = movieGetRenderedTemplate(data);
		                      		$(".js-movie-info-container").empty(); //clear previous items
			                        $(".js-movie-info-container").html(rendered);

			                        //Bind Items
			                        $(".js-movie-info-container").find('.js-close-movie-info').off().on('click',function(event){
										event.preventDefault();
										lastMovieID = 0;
										$(".movie.active").removeClass('active');
										$(".js-movie-info-container").empty(); //clear previous items
			                        });
			                        
			                        //Only use one set of info containers to display info
			                        var movieID = data.id;
			                        hideOtherMoviePosterContainers(movieID);

			                        //Scroll to item
			                        var $clickedMovie = $(".js-movie-item-" + movieID);
									$('html, body').animate({
									    scrollTop: $clickedMovie.offset().top - 40
									}, 1000);

			                      },
				        error: connectionFailed
					});
		}

		
	});

	$(".js-movie-item").mouseleave(function () {
	    //$infoPanel.hide();
	});

	$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
		var $tab = $(e.target);
		var movieID = $tab.parents('.js-movie-tabs').data('movie-id');

		$('#recommendations').empty().html(getLoaderHTML());

		switch ($tab.attr('href')) {
		  case '#recommendations':
			infoURL = '/movies/related/' + movieID + ".json";
			$.ajax({
		        type: "GET",
		        url:infoURL,
		        dataType:'json',
		        success: function( data, textStatus , jqXHR)
		                  {
							var source   = $('#template-related-movie-info').html();
							var template = Handlebars.compile(source);
							var html     = template(data);
							$('#recommendations').empty().html(html);
		                  },
		        error: function(){
		        			var errorHTML = '<div class="alert alert-warning col-md-6 col-md-offset-3" role="alert">Unable to retrieve recommendations at this time. Please try again later.</div>'
		        			$('#recommendations').empty().html(errorHTML);
		        		}
			});
		    break;
			  case '#Rotten-Tomatoes-Reviews':
				infoURL = '/movies/rt.json';
				$.ajax({
			        type: "GET",
			        url:infoURL,
			        dataType:'json',
			        success: function( data, textStatus , jqXHR)
			                  {
								Handlebars.registerHelper("prettifyDate", function(dateitem) {
								    return moment(dateitem).format('MMMM Do YYYY');
								});
								var source   = $('#template-rotten-tomato-review').html();
								var template = Handlebars.compile(source);
								var html     = template(data);
								$('#Rotten-Tomatoes-Reviews').empty().html(html);
			                  },
			        error: function(){
			        			var errorHTML = '<div class="alert alert-warning col-md-6 col-md-offset-3" role="alert">Unable to retrieve Rotten Tomatoes Reviews at this time. Please try again later.</div>'
			        			$('#Rotten-Tomatoes-Reviews').empty().html(errorHTML);
			        		}
				});
			    break;
		  default:
		    //Statements executed when none of the values match the value of the expression
		    break;
		}

	});

	 Handlebars.registerHelper('truncate', function(str, len) {
	     if (str.length > len) {
	         var new_str = str.substr(0, len + 1);

	         while (new_str.length) {
	             var ch = new_str.substr(-1);
	             new_str = new_str.substr(0, -1);

	             if (ch == ' ') {
	                 break;
	             }
	         }

	         if (new_str == '') {
	             new_str = str.substr(0, len);
	         }

	         return new Handlebars.SafeString(new_str + '...');
	     }
	     return str;
	 });

	$('.js-movie-tabs a:first').tab('show');

}
)();

