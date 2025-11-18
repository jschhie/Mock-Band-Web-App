from flask import Blueprint, render_template, request, redirect, url_for, flash
from .models import Customer
from . import db
from flask_login import current_user, login_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash 

auth = Blueprint('auth', __name__)


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = None

        # Check for empty inputs
        if (not username or not password):
            flash('Please enter your username and password.', category='error')
            return render_template("login.html", user=current_user)
       
        user = Customer.query.filter_by(username=username).first()
        if user:
            if check_password_hash(user.password, password):
                flash('You are now logged in!', category='success')
                login_user(user, remember=True)
                return redirect(url_for('views.account')) 
            else:
                flash('Wrong password.', category='error')
        else:
            flash('Username does not exist.', category='error')
            
    return render_template("login.html", user=current_user, username=None)



@auth.route('/logout')
@login_required 
def logout():
    logout_user()
    return redirect(url_for('auth.login'))



@auth.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password1 = request.form['password1']
        password2 = request.form['password2']

        user = Customer.query.filter_by(username=username).first()
        if user:
            flash('Username exists already.', category='error')
        elif len(username) < 5:
            flash('Username must be greater than 4 characters.', category='error')
        elif password1 != password2:
            flash('Passwords don\'t match.', category='error')
        elif len(password1) < 10 or len(password1) > 20:
            flash('Password must be between 10 and 20 characters long.', category='error')
        else: 
            new_user = Customer(username=username, password=generate_password_hash(password1))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            flash('New account made! You are now logged in.', category='success')
            # after logging in, redirect User to the My Account Page
            return redirect(url_for('views.account')) 

    return render_template("register.html", user=current_user)