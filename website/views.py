from flask import Blueprint, render_template, request, flash, redirect, url_for
from . import db
from .models import Customer, Order
from datetime import datetime

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



@views.route('/buy-tix/<string:arena>')
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
        
        #all_customers, all_orders = Customer.query.all(), Order.query.all()
        #for customer, order in zip(all_customers, all_orders):
        #    print(customer.id, customer.bill_name, order.id, order.customer_id, order.subtotal, order.delivery_fee, order.total_price)        

        #return redirect('/thank-you' + '/' + txnType + '/' + str(new_order.id))
        return redirect(url_for('views.thankYou', txnType=txnType, orderId=new_order.id))

    return render_template('checkout.html', txnType=txnType)



@views.route('/thank-you/<string:txnType>%3D<int:orderId>') 
def thankYou(txnType, orderId):
    # DISPLAY CUSTOMER INFO FROM DATABASE
    # DISPLAY VENUE MAP AND TIME/DATE/LOCATION
    # Get Customer and Order instance from orderId
    order = Order.query.filter_by(id=orderId).one()
    customer = Customer.query.filter_by(id=order.customer_id).one()
    return render_template('thank-you.html', txnType=txnType, order=order, customer=customer)