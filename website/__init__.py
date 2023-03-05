from flask import Flask
from os import path

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '0b21fcf8155e59dd9c8e41a54e1f6083' # to enable sessions and flashed messages

    # register blueprints and views into app
    from .views import views
    app.register_blueprint(views, url_prefix='/')
    
    return app