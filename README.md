# Online Music Band Store ♩♪♫

> Flask, Python,  SQLAlchemy, HTML, CSS, Bootstrap, JavaScript, Jinja

## Overview
* Mock e-commerce platform, featuring a store catalog, order lookup/history, shopping cart functionality, and account (or guest) checkout system, and customer reviews
* Hosted on PythonAnywhere; you may interact with the website at: https://bandstore.pythonanywhere.com/

## 🔖 Table of Contents
* [Website Demo](https://github.com/jschhie/band-web-app/blob/main/README.md#website-demo)
* [Running the Website Manually](https://github.com/jschhie/band-web-app/blob/main/README.md#running-the-site-manually)

## Website Demo

### 💿 Main Store Page
> Sample Merch and Albums for Sale
<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/avg-stars-store.png">

> Product Catalog
<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/avg-stars.png">


### 🛒 Main Store: Sample Cart
> Cart Section for Merch
<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/login-view/cart.png">

### 💳 Customer Checkout with Membership Discount
<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/all-discounts/discounts-2.png">

### 🧾 Order Confirmation
> Sample Receipt for Main Store Merch
<img src="https://github.com/jschhie/Mock-Band-Web-App/blob/main/newdemos/new-font-merch.png">

<img src="https://github.com/jschhie/Mock-Band-Web-App/blob/main/newdemos/new-font-merch2.png">

### 📦 Order History & Membership Points
<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/all-discounts/discounts.png">

### ✍️ My Reviews
<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/stars.png">

### 🎤 Tour Dates
<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/login-view/tours.png">

### 📷 Photo Gallery
<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/login-view/about1.png">

<img src="https://github.com/jschhie/band-web-app/blob/main/newdemos/login-view/new-bio.png">


<hr>

## Running the Site Manually
### Application Requirements
To run this website manually (via your ```localhost```), download the required packages and this repository, as described below.

The packages and libraries needed to run this website are listed in the ```requirements.txt``` file. 
The following command will install all the required packages:

```bash
pip3 install -r requirements.txt
```
(Assuming in Terminal) First, enter:

<hr>

Next, to clone this repository, enter:
```bash 
git clone https://github.com/jschhie/mock-band-web-app.git [folderNameHere]
```

Next, go into the folder: 

```bash 
cd [folderNameHere]
```

Finally, enter:

```bash
python3 main.py
```

The application will then automatically generate a ```band_store_database.db``` database, using SQLAlchemy, in the ```website``` directory.

<hr>

The user can then access and interact with the website at http://127.0.0.1:5000/ via any web browser. 
