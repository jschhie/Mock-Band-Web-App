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

    #with app.app_context():

    # register blueprints and views into app
    from .views import views
    app.register_blueprint(views, url_prefix='/')

    # create or retrieve existing DB
    from .models import Customer, Order, ItemSold, Product
    create_database(app)

    return app



def create_database(app):
    if not path.exists('website/' + DB_NAME):
        with app.test_request_context():
            from .models import Customer, Order, ItemSold, Product
            db.create_all(app=app)
            # Insert store merch
            merch_titles = ["Young Forever", "WINGS", "You Never Walk Alone", "Love Yourself: HER", "Love Yourself: Black Hoodie", "Love Yourself: White Hoodie"]
            merch_prices = [19.99, 21.99, 28.25, 28.99, 31.99, 31.99]
            for title, price in zip(merch_titles, merch_prices):
                new_product = Product(prod_title=title, unit_price=price)
                db.session.add(new_product)
                db.session.commit()

            # Insert concert tickets into database
            #tix_venues = ["SEOUL OLYMPIC STADIUM", "STAPLES CENTER", "ORACLE ARENA", "UNITED CENTER"]
            #tix_dates = ["AUG 25, FRIDAY @ 8:30PM", "SEPT 05, TUESDAY @ 8:00PM", "SEPT 12, TUESDAY @ 8:30PM", "OCT 02, MONDAY @ 8:00PM"]
            
            tix_seats = ["SIDE A", "SIDE B", "FRONT ROW", "GENERAL ADMISSION"]
            tix_prices = [195.00, 195.00, 350.00 , 85.00]
            for seat, price in zip(tix_seats, tix_prices):
                new_product = Product(prod_title=seat, unit_price=price)
                db.session.add(new_product)
                db.session.commit()

            products = Product.query.all()
            for prod in products:
                print(prod.prod_title, prod.id, prod.unit_price)