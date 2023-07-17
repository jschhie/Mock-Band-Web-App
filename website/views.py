from flask import Blueprint, render_template, request, flash, redirect, url_for
from . import db
from .models import Customer, Order, ItemSold, Product, Concert
from flask_login import current_user, login_required
from datetime import datetime

import json
import random

views = Blueprint('views', __name__)



@views.route('/testing')
def testing():
    products = Product.query.all()
    return render_template('testing.html', products=products, user=current_user, username=None)


@login_required
@views.route('/account')
def account():
    if current_user.is_authenticated:
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
        # Fetch matching Orders for Customer
        order_history = Order.query.filter(Order.customer_id==current_customer.id).all()
        return render_template('account.html', hideCart=True, user=current_user, order_history=order_history, username=username)

    return render_template('error', user=current_user, username=None), 404


'''
@login_required
@views.route('/settings', methods=['GET', 'POST'])
def settings():
    if current_user.is_authenticated:
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
    else:
        return render_template('error', user=current_user), 404
    
    if request.method == 'POST':
        # Update Shipping and / or Billing Info
        idTypes = ["bill", "ship"] # bill = billing, ship = shipping / rec = recipient
        idNames = ["Name", "Address", "City", "State", "Zip", "Email"]
        customerInputs = []
        for idType in idTypes:
            for idName in idNames:
                idString = idType + idName
                customerInputs.append(request.form[idString])

        bill_name, bill_address, bill_city, bill_state, bill_zip, bill_email, rec_name, rec_address, rec_city, rec_state, rec_zip, rec_email = customerInputs

        db.session.commit()

    return render_template('settings.html', hideCart=True, user=current_user)
'''




@views.route('/')
@views.route('/index')
def index():
    if current_user.is_authenticated:
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
    else:
        username = None
    # Sort by dates / order id 
    concerts = Concert.query.filter(Concert.id>=1, Concert.id<=6).order_by(Concert.id).all()
    return render_template('index.html', hideCart=True, concerts=concerts, user=current_user, username=username)



@views.route('/about')
def about():
    if current_user.is_authenticated:
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
    else:
        username = None
    return render_template('about.html', hideCart=True, user=current_user, username=username)



@views.route('/store')
def store():
    # Products 1-4 are exclusively albums
    albums = Product.query.filter(Product.id>=1, Product.id<=4).all()
    # Products 5-6 are exclusively merch
    merch = Product.query.filter(Product.id>=5, Product.id<=6).all()
    
    if current_user.is_authenticated:
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
    else:
        username = None
    return render_template('store.html', albums=albums, merch=merch, hideCart=False, user=current_user, username=username)



@views.route('/checkout', methods=['GET', 'POST'])
def checkout():
    if current_user.is_authenticated:
        # Find current Customer Account
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
    else:
        username = None

    if request.method == 'POST':
        # purchaseClicked(event): returns true or false, if successful form submission
        # POST request only made when all input filled out
    
        idTypes = ["bill", "ship"] # bill = billing, ship = shipping / rec = recipient
        idNames = ["Name", "Address", "City", "State", "Zip", "Email"]
        customerInputs = []
        for idType in idTypes:
            for idName in idNames:
                idString = idType + idName
                customerInputs.append(request.form[idString])

        bill_name, bill_address, bill_city, bill_state, bill_zip, bill_email, rec_name, rec_address, rec_city, rec_state, rec_zip, rec_email = customerInputs

        # Check if Customer signed in
        if current_user.is_authenticated == False:
            current_customer = Customer()
            # Store new Customer into DB
            db.session.add(current_customer)
            db.session.commit()

        # Link Order to current or new Customer
        delivery_fee = request.form['deliveryFee']
        subtotal = request.form['subtotal']
        total_price = request.form['totalPrice']
        now = datetime.now()
        purchase_date = now.strftime("%m/%d/%Y")

        # Fetch JSON cart
        json_cart = json.loads(request.form['jsonCart'])

        order_id = int(str(random.randrange(0,100)) + str(random.randrange(0,100)) + str(random.randrange(0,100)))

        new_order = Order(id=order_id, purchase_date=purchase_date, customer_id=current_customer.id, subtotal=subtotal,
                          delivery_fee=delivery_fee, total_price=total_price, 
                          bill_name=bill_name, bill_address=bill_address, bill_city=bill_city, bill_state=bill_state, bill_email=bill_email, bill_zip=bill_zip,
                        rec_name=rec_name, rec_address=rec_address, rec_city=rec_city, rec_state=rec_state, rec_email=rec_email, rec_zip=rec_zip)

        # Store new Order into DB
        db.session.add(new_order)
        db.session.commit()

        # [ {'prod_title': '____', 'qty_sold': ___}, {}, ..., {} ]
        for dictionary in json_cart:
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
            db.session.commit()
        return redirect(url_for('views.thankYou', orderId=new_order.id))
    return render_template('checkout.html', hideCart=True, user=current_user, username=username)



@views.route('/thank-you/<int:orderId>')
def thankYou(orderId):
    # Get Customer and Order instance from orderId
    order = Order.query.filter_by(id=orderId).first()
    if (order == None):
        return render_template('error.html', user=current_user, username=None), 404
    
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

    if current_user.is_authenticated:
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
    else:
        username = None

    return render_template('thank-you.html', hideCart=True, order=order, num_items_sold=num_items_sold, zip=zip(items_sold, matching_products), user=current_user, username=username)


@views.route('/find-order/', methods=['GET', 'POST'])
def findOrder():
    if request.method == 'POST':
        order_id = request.form['orderID']
        full_name = request.form['fullName']

        # Check if matching Order exists 
        matching_order = Order.query.filter_by(id=order_id).first()
        if (matching_order):
            # Check if matching Customer Info
            if (matching_order.bill_name == full_name):
                return redirect(url_for('views.thankYou', orderId=order_id))
        flash('Please try again.', category="lookup-error")     

    if current_user.is_authenticated:
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
    else:
        username = None

    return render_template('find-order.html', hideCart=True, user=current_user, username=username)