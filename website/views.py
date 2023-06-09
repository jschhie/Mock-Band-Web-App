from flask import Blueprint, render_template, request, flash, redirect

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

        # TODO commit to database: Customer Info & Items Sold

        return redirect('/thank-you' + '/' + txnType)
    # Default: GET 
    return render_template('checkout.html', txnType=txnType)

@views.route('/thank-you/<string:txnType>')
def thankYou(txnType):
    # DISPLAY CUSTOMER INFO FROM DATABASE
    # DISPLAY VENUE MAP AND TIME/DATE/LOCATION
    return render_template('thank-you.html', txnType=txnType)