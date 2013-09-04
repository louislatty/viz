# -*- coding:utf-8; mode:ruby; -*-

#require 'omniauth'
require 'omniauth-google-oauth2'
require 'sinatra/base'
require 'sinatra/config_file'
require 'sinatra/content_for'

class App < Sinatra::Base
  register Sinatra::ConfigFile
  helpers Sinatra::ContentFor

  AUTHORIZED_UIDS = ['111233800829108673907']

  configure do
    config_file 'config.yml', 'local_config.yml'

    use Rack::Session::Cookie, secret: settings.rack_cookie_secret
    use OmniAuth::Builder do
      provider :google_oauth2, App.settings.client_id, App.client_secret, {}
    end
  end

  get '/' do
    content_type 'text/html', charset: 'utf-8'
    erb :index
  end

  get '/auth/:provider/callback' do
    content_type 'text/plain'
    request.env['omniauth.auth'].to_hash.inspect rescue "No Data"
  end

  get '/auth/failure' do
    content_type 'text/plain'
    request.env['omniauth.auth'].to_hash.inspect rescue "No Data"
  end

  get '/auth/logout' do
    session.clear
    "You're logged out. <a href='/'>Login</a>"
  end
end
