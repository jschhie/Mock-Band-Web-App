from flask import Blueprint, render_template, request, flash, redirect, url_for
from . import db
from .models import Customer, Order, ItemSold, Product
from datetime import datetime

import json

views = Blueprint('views', __name__)



@views.route('/testing')
def testing():
    products = Product.query.all()
    return render_template('testing.html', products=products)



@views.route('/')
@views.route('/index')
def index():
    return render_template('index.html', isIndex=True)



@views.route('/about')
def about():
    return render_template('about.html')



@views.route('/store')
def store():
    # Products 1-4 are exclusively albums
    albums  = Product.query.filter(Product.id>=1, Product.id<=4).all()
    # Products 5-6 are exclusively merch
    merch = Product.query.filter(Product.id>=5, Product.id<=6).all()
    return render_template('store.html', albums=albums, merch=merch)



@views.route('/buy-tix/<string:arena>', methods=['GET', 'POST'])
def buy_tix(arena):
    if (arena not in ["seoul", "oakland", "la", "chicago"]):
        return render_template('error.html'), 404
    
    return render_template('buy-tix.html', arena=arena)



@views.route('/checkout/<string:txnType>', methods=['GET', 'POST'])
def checkout(txnType):
    if (txnType not in ["tickets", "merch"]):
        return render_template('error.html'), 404

    # where txnType is either "merch" or "tickets"
    if request.method == 'POST':
        # purchaseClicked(event): returns true or false, if successful form submission
        # POST request only made when all input filled out

        # TODO Check if Customer exists (using Customer.bill_email)

        # Create new Customer
        idTypes = ["bill", "ship"] # bill = billing, ship = shipping / rec = recipient
        idNames = ["Name", "Address", "City", "State", "Zip", "Email"]
        customerInputs = []
        for idType in idTypes:
            for idName in idNames:
                idString = idType + idName
                customerInputs.append(request.form[idString])

        bill_name, bill_address, bill_city, bill_state, bill_zip, bill_email, rec_name, rec_address, rec_city, rec_state, rec_zip, rec_email = customerInputs

        new_customer = Customer(bill_name=bill_name, bill_address=bill_address, bill_city=bill_city, bill_state=bill_state, bill_zip=bill_zip, bill_email=bill_email,
                                rec_name=rec_name, rec_address=rec_address, rec_city=rec_city, rec_state=rec_state, rec_zip=rec_zip, rec_email=rec_email)

        # Store new Customer into DB

        db.session.add(new_customer)
        db.session.commit()

        # Link Order to current Customer
        delivery_fee = request.form['deliveryFee']
        subtotal = request.form['subtotal']
        total_price = request.form['totalPrice']
        now = datetime.now()
        purchase_date = now.strftime("%m/%d/%Y")

        # Fetch JSON cart
        json_cart = json.loads(request.form['jsonCart'])
        venue_info = json_cart[-1] # Last dictionary, reserved for venue info
        venue = venue_info['venue']
        venue_date = venue_info['venue_date']

        new_order = Order(purchase_date=purchase_date, customer_id=new_customer.id, subtotal=subtotal,
                          delivery_fee=delivery_fee, total_price=total_price, venue=venue, venue_date=venue_date)

        # Store new Order into DB
        db.session.add(new_order)
        db.session.commit()

        # [ {'prod_title': '____', 'qty_sold': ___}, {}, ..., {'venue': 'None', 'venue_date': 'None'} ]
        for dictionary in json_cart[:-1]: # all except last dictionary
            merch_size = dictionary['merch_size']
            prod_title = dictionary['prod_title']
            if (merch_size != ""):
                prod_title = prod_title[:-1] # remove extra space character at end of string
            qty_sold = dictionary['qty_sold']
            
            # Find matching Product with prod_title
            product = Product.query.filter_by(prod_title=prod_title).first()
            
            # Create ItemSold object
            new_item_sold = ItemSold(qty_sold=qty_sold, merch_size=merch_size, order_id=new_order.id, product_id=product.id)
            db.session.add(new_item_sold)
            
            print('MERCH SIZE: ', new_item_sold.merch_size, 'TITLE: ', prod_title)

            db.session.commit()
        return redirect(url_for('views.thankYou', txnType=txnType, orderId=new_order.id))
    return render_template('checkout.html', txnType=txnType)



@views.route('/thank-you/<string:txnType>%3D<int:orderId>')
def thankYou(txnType, orderId):
    # Get Customer and Order instance from orderId
    order = Order.query.filter_by(id=orderId).first()
    if (order == None):
        return render_template('error.html'), 404
    
    items_sold = order.items_sold

    product_ids = []
    num_items_sold = 0
    for item in items_sold:
        product_ids.append(item.product_id)
        num_items_sold += item.qty_sold

    matching_products = []
    for prod_id in product_ids:
        match = Product.query.filter_by(id=prod_id).first()
        matching_products.append(match)

    customer = Customer.query.filter_by(id=order.customer_id).first()
    if (customer == None):
        return render_template('error.html'), 404

    return render_template('thank-you.html', txnType=txnType, order=order, customer=customer, num_items_sold=num_items_sold, zip=zip(items_sold, matching_products))


@views.route('/find-order/', methods=['GET', 'POST'])
def findOrder():
    if request.method == 'POST':
        order_id = request.form['orderID']
        full_name = request.form['fullName']

        # Check if matching Order exists 
        matching_order = Order.query.filter_by(id=order_id).first()
        if (matching_order):
            # Check if matching Customer Info
            matching_customer = Customer.query.filter_by(id=matching_order.customer_id).first()
            if (matching_customer and matching_customer.bill_name == full_name):
                # Check if Order is Tickets or Merch Type
                if (matching_order.venue == "None"):
                    txnType = "merch"
                else:
                    txnType = "tickets"
                return redirect(url_for('views.thankYou', txnType=txnType, orderId=order_id))
        flash('Please try again.', category="lookup-error")     
        
    return render_template('find-order.html')