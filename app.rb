# -*- coding:utf-8; mode:ruby; -*-

require 'sinatra/base'

class App < Sinatra::Base
  get '/' do
    content_type 'text/html', :charset => 'utf-8'
    erb :index
  end
end
