module Api
	class Rotten_Tomatoes
		require "httparty"
		require "uri"
		# Trending API - api.trakt.tv/movies/trending.json/ENV["TRAKT_API_KEY"]
		# http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=&q=Toy+Story+3&page_limit=1

		BASE_URI = 'http://api.rottentomatoes.com/api/public/v1.0'

		def initialize(args={})
			@api_key = args[:apikey]
		end

		def find_movie_by_title(movie_title)
			movie_url = BASE_URI + "/movies/movies.json?apikey=#{@api_key}&q=#{URI.encode(movie_title)}&page_limit=1"
			# HTTParty.get(movie_url)
		end

		def find_movie_by_imdb_id(imdb_id)
			imdb_id = imdb_id.gsub! 'tt', ''
			movie_url = BASE_URI + "/movie_alias.json?apikey=#{@api_key}&type=imdb&id=#{imdb_id}"
			response = HTTParty.get(movie_url)
			JSON.parse(response.body)
		end

		def top_critic_reviews_for_movie(rotten_tomatoes_id)
			reviews = BASE_URI + "/movies/#{rotten_tomatoes_id}/reviews.json?apikey=#{@api_key}&review_type=top_critic"
			response = HTTParty.get(reviews)
			JSON.parse(response.body)
		end
	end
end