from flask import Blueprint, render_template

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