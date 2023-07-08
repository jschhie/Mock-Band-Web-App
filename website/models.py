from . import db



class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    orders = db.relationship('Order')
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



class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    purchase_date = db.Column(db.String(50))
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id')) # foreign key
    # List of all ItemSold
    items_sold = db.relationship('ItemSold')
    # Monetary Values
    subtotal = db.Column(db.String(50))
    delivery_fee = db.Column(db.String(50))
    total_price = db.Column(db.String(50))
    # Applicable to Ticket Orders
    venue = db.Column(db.String(30), default="None") # if Merch: None, else: Concert Venue
    venue_date = db.Column(db.String(30), default="None") # date and time (ex: AUG 25, FRIDAY @ 8 PM)


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
    ### STORE ALBUMS ###
    alt_src = db.Column(db.String(100), default="None") # catalog image url
    release_date = db.Column(db.String(30), default="None")
    weight = db.Column(db.String(30), default="None") # album weight
    specs = db.Column(db.String(30), default="None") # album dimensions
    ### STORE MERCH ###
    origin = db.Column(db.String(30), default="None") # Country of origin
    material = db.Column(db.String(30), default="None") 
