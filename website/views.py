from flask import Blueprint, render_template, request, flash, redirect, url_for
from . import db
from .models import Customer, Order, ItemSold, Product, Concert, Review
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
        order_history = Order.query.filter(Order.customer_id==current_customer.id).order_by(Order.purchase_date.desc()).all() # sort by most recent purchase date
        return render_template('account.html', hideCart=True, user=current_user, order_history=order_history, username=username)

    return render_template('error', user=current_user, username=None), 404



@login_required
@views.route('/reviews')
def reviews():
    if current_user.is_authenticated:
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
        
        # Fetch Products for Customer Reviews
        order_history = Order.query.filter(Order.customer_id==current_customer.id).all()
        unique_purchases = {} # dictionary of unique purchases (product_id : [title, img_src])
        for order in order_history:
            for item in order.items_sold:
                # Find matching title and image source
                product = Product.query.filter(Product.id==item.product_id).first()
                if product.id not in unique_purchases:
                    title = product.prod_title
                    img_src = product.img_src
                    unique_purchases[product.id] = [img_src, title]

        return render_template('reviews.html', hideCart=True, user=current_user, username=username, unique_purchases=unique_purchases)

    return render_template('error', user=current_user, username=None), 404



@login_required
@views.route('/edit-review/<int:userid>-<int:productid>', methods=['GET', 'POST'])
def edit_review(userid, productid):
    if (current_user.is_authenticated and userid == current_user.id):
        # Find current Customer logged in
        current_customer = Customer.query.filter(Customer.id==current_user.id).first()
        username = current_customer.username
        review = Review.query.filter(Review.username==username).filter(Review.product_id==productid).first()
        
        if request.method == "POST":
            if request.form['action'] == 'review':
                content = request.form['content']
                now = datetime.now()
                review_date = now.strftime("%m/%d/%Y")
                # Insert/Update Review in database
                if (review == None):
                    review = Review(product_id=productid, username=username, content=content, review_date=review_date)
                    db.session.add(review) # add new Review
                else:
                    review.content = content
                    review.review_date = review_date
                db.session.commit()
                # Redirect to Reviews
                flash('Review submitted.')
                return redirect(url_for('views.reviews'))
            elif request.form['action'] == 'cancel':
                # Discard changes, and redirect to Reviews
                flash('Changes to your review have been discarded!')
                return redirect(url_for('views.reviews'))

        product = Product.query.filter(Product.id==productid).first()
        img_src = product.img_src
        title = product.prod_title

        return render_template('edit-review.html', review=review, img_src=img_src, title=title, hideCart=True, user=current_user, username=username)

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

    # Load all users' Reviews per Product
    all_reviews = dict() # dictionary of product_id : Reviews
    for i in range(1, 7):
        # product_ids between 1 and 6
        reviews = Review.query.filter(Review.product_id==i).all()
        if (reviews):
            all_reviews[i] = reviews
        else:
            all_reviews[i] = None
    
    return render_template('store.html', all_reviews=all_reviews, albums=albums, merch=merch, hideCart=False, user=current_user, username=username)



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