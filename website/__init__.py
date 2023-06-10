from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path

db = SQLAlchemy()
DB_NAME = "band_store_database.db"



def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '0b21fcf8155e59dd9c8e41a54e1f6083' # enable sessions and flashed messages
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'

    db.init_app(app)

    # register blueprints and views into app
    from .views import views
    app.register_blueprint(views, url_prefix='/')
    
    # create or retrieve existing DB
    from .models import Customer, Order
    create_database(app)

    return app



def create_database(app):
    if not path.exists('website/' + DB_NAME):
        db.create_all(app=app)