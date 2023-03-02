from flask import Flask
from os import path

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'fb66099b595b09d56b7082aab997b1ee' # to enable sessions and flashed messages

    # register blueprints and views into app
    from .views import views
    app.register_blueprint(views, url_prefix='/')
    
    return app