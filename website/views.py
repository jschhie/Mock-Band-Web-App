from flask import Blueprint, render_template, request, flash, redirect, url_for
from . import db
from .models import Customer, Order, ItemSold, Product
from datetime import datetime

import json

views = Blueprint('views', __name__)



@views.route('/')
@views.route('/index')
def index():
    return render_template('index.html', isIndex=True)



@views.route('/about')
def about():
    return render_template('about.html')



@views.route('/store')
def store():
    return render_template('store.html')



@views.route('/buy-tix/<string:arena>', methods=['GET', 'POST'])
def buy_tix(arena):
    return render_template('buy-tix.html', arena=arena)



@views.route('/checkout/<string:txnType>', methods=['GET', 'POST'])
def checkout(txnType):
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
        new_order = Order(purchase_date=purchase_date, customer_id=new_customer.id, subtotal=subtotal, delivery_fee=delivery_fee, total_price=total_price)

        # Store new Order into DB
        db.session.add(new_order)
        db.session.commit()

        json_cart = json.loads(request.form['jsonCart']) 
        # [{'prod_title': '', 'qty_sold': #, 'venue': 'None', 'venue_date': 'None'}, {}, {}]  
        # where venue and venue_date applicable to tickets only
        for dictionary in json_cart:
            prod_title = dictionary['prod_title']
            qty_sold = dictionary['qty_sold']
            venue = dictionary['venue']
            venue_date = dictionary['venue_date']
            # Find matching Product with prod_title
            product = Product.query.filter_by(prod_title=prod_title).first() # .one() raises exception if MultipleResultsFound
            # Create ItemSold object
            new_item_sold = ItemSold(qty_sold=qty_sold, order_id=new_order.id, product_id=product.id, venue=venue, venue_date=venue_date)
            db.session.add(new_item_sold)
            db.session.commit()
        return redirect(url_for('views.thankYou', txnType=txnType, orderId=new_order.id))
    return render_template('checkout.html', txnType=txnType)



@views.route('/thank-you/<string:txnType>%3D<int:orderId>') 
def thankYou(txnType, orderId):
    # DISPLAY CUSTOMER INFO FROM DATABASE
    # DISPLAY VENUE MAP AND TIME/DATE/LOCATION
    
    # Get Customer and Order instance from orderId
    order = Order.query.filter_by(id=orderId).first() #.one()
    items_sold = order.items_sold
    
    product_ids = []
    num_items_sold = 0
    for item in items_sold:
        product_ids.append(item.product_id)
        num_items_sold += item.qty_sold

    matching_products = Product.query.filter(Product.id.in_(product_ids)).all()
    customer = Customer.query.filter_by(id=order.customer_id).first() #.one()
    if (customer == None):
        print('error no customers with that id: ', order.customer_id)

    return render_template('thank-you.html', txnType=txnType, order=order, customer=customer, num_items_sold=num_items_sold, zip=zip(items_sold, matching_products))