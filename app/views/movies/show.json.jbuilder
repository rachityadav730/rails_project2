json.extract! @movie, :id, :title, :overview, :year, :released, :url, :trailer, :runtime, :tagline, :certification, :imdb_id, :tmdb_id, :poster
json.released_formatted Time.at(@movie.released).to_datetime.strftime("%d %b %Y")
json.userid @userID
json.isUserFavourite @isUserFavourite