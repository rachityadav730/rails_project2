class MoviesController < ApplicationController
  before_filter :authenticate_user!, only: [:new, :edit, :update, :destroy, :refresh, :create]
  before_action :set_movie, only: [:show, :edit, :update, :destroy, :related, :reddit]
  before_filter :set_trakt, :only => [:refresh, :show, :related]

  # GET /movies
  # GET /movies.json
  def index
    per_page = (params.has_key?(:per_page) && params[:per_page].to_i != 0) ? params[:per_page].to_i : 24
    @movies = Movie.joins(:trending).all.page(params[:page]).per_page(per_page)
  end

  # GET /movies/1
  # GET /movies/1.json
  def show
  end

  def rt
    rt_movie_responce = HTTParty.get('http://www.togatoga.me/home/apiRTMovieTest.json')
    rt_movie_review_responce = HTTParty.get('http://www.togatoga.me/home/apiRTTest.json')
    @movie = rt_movie_responce
    @reviews = rt_movie_review_responce
  end

  def reddit
    #Clean Old Cache Files For This Movie
    Feed.clear_cache(site: 'reddit', movie: @movie)
    @reddit = Feed.get_feeds(site: 'reddit', movie: @movie)
  end

  def related
    @relatedMovies = Movie.related(movie: @movie)
  end

  # GET /movies/new
  def new
    @movie = Movie.new
  end

  # GET /movies/1/edit
  def edit
  end

  # GET /movies/refresh - trending videos
  def refresh    
    @result, @processedMovies, @errors = Movie.refresh
  end

  # POST /movies
  # POST /movies.json
  def create
    @movie = Movie.new(movie_params)

    respond_to do |format|
      if @movie.save
        format.html { redirect_to @movie, notice: 'Movie was successfully created.' }
        format.json { render :show, status: :created, location: @movie }
      else
        format.html { render :new }
        format.json { render json: @movie.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /movies/1
  # PATCH/PUT /movies/1.json
  def update
    respond_to do |format|
      if @movie.update(movie_params)
        format.html { redirect_to @movie, notice: 'Movie was successfully updated.' }
        format.json { render :show, status: :ok, location: @movie }
      else
        format.html { render :edit }
        format.json { render json: @movie.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /movies/1
  # DELETE /movies/1.json
  def destroy
    @movie.destroy
    respond_to do |format|
      format.html { redirect_to movies_url, notice: 'Movie was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_movie
      @movie = Movie.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def movie_params
      params.require(:movie).permit(:title, :year, :released, :url, :trailer, :runtime, :tagline, :certification, :imdb_id, :tmdb_id, :poster, :watchers)
    end

    def set_trakt
      @trakt = Api::Trakt.new(:apikey => ENV["TRAKT_API_KEY"])
    end

end