from . import db
from flask_login import UserMixin



class Customer(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    orders = db.relationship('Order')
    # Login
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(20))
    # Reviews -- available to Customer Accounts only
    reviews = db.relationship('Review') # All Reviews written by Username
    points = db.Column(db.Integer, default=0) # 1 membership point per $5 spent
    # Boolean to check if Customer has Saved Shipping Data
    has_saved_shipping_data = db.Column(db.Boolean, default=False) # False: Guest checkout, or account has no saved shipping data



class SavedShippingData(db.Model):
    # Saved Shipping Data -- modifiable in Account Settings
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id')) # foreign key
    ship_name = db.Column(db.String(30))
    ship_address = db.Column(db.String(30))
    ship_city = db.Column(db.String(30))
    #ship_state_code = db.Column(db.Integer) # Digit that uniquely maps to a State Abbreviation. Example: 1 -> Alabama -> AL
    ship_state = db.Column(db.String(2)) # State Abbreviation
    ship_zip = db.Column(db.String(5))
    ship_email = db.Column(db.String(30))



class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id')) # foreign key
    username = db.Column(db.Integer, db.ForeignKey('customer.username')) # foreign key
    content = db.Column(db.String(100)) # max 100 characters
    review_date = db.Column(db.String(50))
    rating =  db.Column(db.Integer, default=5) # single digit between 1-5



class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    purchase_date = db.Column(db.String(50))
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id')) # foreign key
    # Customer = Name on Billing
    bill_name = db.Column(db.String(30))
    bill_address = db.Column(db.String(30))
    bill_city = db.Column(db.String(30))
    bill_state = db.Column(db.String(2)) # State Abbreviation
    bill_zip = db.Column(db.String(5))
    bill_email = db.Column(db.String(30)) # used for searching orders
    # Recipient = Name on Shipping
    rec_name = db.Column(db.String(30))
    rec_address = db.Column(db.String(30))
    rec_city = db.Column(db.String(30))
    rec_state = db.Column(db.String(2)) # State Abbreviation
    rec_zip = db.Column(db.String(5))
    rec_email = db.Column(db.String(30))
    # List of all ItemSold
    items_sold = db.relationship('ItemSold')
    # Monetary Values
    subtotal = db.Column(db.String(50))
    delivery_fee = db.Column(db.String(50))
    total_price = db.Column(db.String(50))
    # Membership Discount Applied (per Order)
    discounts = db.Column(db.String(50), default="0.00")


class ItemSold(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    qty_sold = db.Column(db.Integer) # at least 1
    order_id = db.Column(db.Integer, db.ForeignKey('order.id')) # foreign key
    product_id = db.Column(db.Integer, db.ForeignKey('product.id')) # foreign key
    merch_size = db.Column(db.String(10), default="") # (Small, Medium, or Large) for Merch. Empty "" for Albums, Tickets



class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prod_title = db.Column(db.String(50))
    unit_price = db.Column(db.String(50))
    ### ALL STORE PRODUCTS ###
    img_src = db.Column(db.String(100), default="None") # image url for merch, "None" for tickets
    public_reviews = db.relationship('Review') # All Reviews for given Product
    avg_rating = db.Column(db.Integer, default=0) # 1-5 star scale
    ### STORE ALBUMS ###
    alt_src = db.Column(db.String(100), default="None") # catalog image url
    release_date = db.Column(db.String(30), default="None")
    weight = db.Column(db.String(30), default="None") # album weight
    specs = db.Column(db.String(30), default="None") # album dimensions
    ### STORE MERCH ###
    origin = db.Column(db.String(30), default="None") # Country of origin
    material = db.Column(db.String(30), default="None") 



class Concert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    venue_location = db.Column(db.String(30))
    venue_arena = db.Column(db.String(30))
    date = db.Column(db.String(20))
    title = db.Column(db.String(30))