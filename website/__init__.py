from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from os import path

db = SQLAlchemy()
DB_NAME = "band_store_database.db"


def page_not_found(e):
    return render_template('error.html'), 404


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '0b21fcf8155e59dd9c8e41a54e1f6083' # enable sessions and flashed messages
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.register_error_handler(404, page_not_found)

    db.init_app(app)

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

            # Initialize database once
            '''
            try:
                if (Product.query.all() != None):
                    return # Don't reinitialize database
            except:
                pass
            '''

            # Insert store albums and merch
            merch_titles = ["Young Forever",
                            "WINGS",
                            "You Never Walk Alone",
                            "Love Yourself: HER",
                            "Love Yourself: Black Hoodie",
                            "Love Yourself: White Hoodie"]
            
            merch_prices = [19.99, 21.99, 28.25, 28.99, 31.99, 31.99]

            img_urls = ["https://live.staticflickr.com/65535/52726666648_ba2e880a99_w.jpg",
                        "https://live.staticflickr.com/65535/52726666373_7da75acb45_w.jpg",
                        "https://live.staticflickr.com/65535/52726600750_3946190a20_w.jpg",
                        "https://live.staticflickr.com/65535/52726186301_80d0c6f6c5_n.jpg",
                        "https://live.staticflickr.com/65535/52726627658_dc143b07b2_o.jpg",
                        "https://live.staticflickr.com/65535/52726147106_704a98479e_o.jpg"]
            
            alt_img_urls = ["https://live.staticflickr.com/65535/53027712092_2dd3506499_w.jpg",
                            "https://live.staticflickr.com/65535/53028707455_6bd6c80421_o.jpg",
                            "https://live.staticflickr.com/65535/53028496734_6610398588_w.jpg",
                            "https://live.staticflickr.com/65535/53028499394_57eeb759b9_w.jpg", 
                            "None",
                            "None"]
            
            release_dates = ["May 2, 2016",
                            "October 10, 2016",
                            "February 13, 2017",
                            "September 19, 2017",
                            "None",
                            "None"]
            
            weights = ["1.52 pounds", 
                      "7.2 ounces",
                      "3.52 ounces",
                      "12.4 ounces",
                      "None",
                      "None"]

            specs = ['6.69"L x 0.79"W',
                     '6.69"L x 0.79"W',
                     '6.69"L x 6.69"W',
                     '5.47"L x 8.0"W',
                     'None',
                     'None']

            origins = ["None", "None", "None", "None", "USA", "USA"]

            materials = ["None", "None", "None", "None", "100% Cotton", "100% Cotton"]

            for title, price, img_src, alt_src, release_date, weight, spec, origin, material in zip(merch_titles, merch_prices, img_urls, alt_img_urls, release_dates, weights, specs, origins, materials):
                new_product = Product(prod_title=title, unit_price=price, img_src=img_src, alt_src=alt_src, release_date=release_date, weight=weight, specs=spec, origin=origin, material=material)
                db.session.add(new_product)
                db.session.commit()

            # Insert (generic) ticket info
            tix_seats = ["SIDE A", "SIDE B", "FRONT ROW", "GENERAL ADMISSION"]
            tix_prices = ['195.00', '195.00', '350.00' , '85.00'] # store as strings to avoid rounding floating point errors
            for seat, price in zip(tix_seats, tix_prices):
                new_product = Product(prod_title=seat, unit_price=price)
                db.session.add(new_product)
                db.session.commit()