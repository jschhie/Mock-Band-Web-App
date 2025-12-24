# Music Band Store ♩♪♫

> - Full-stack e-commerce platform <br>
> - **Live demo:** https://bandstore.pythonanywhere.com/

---

## Tech Stack 
| Component | Tech Used |
| :--- | :--- |
| **Backend** | Python, Flask |
| **Data** | SQLite, SQL, JSON |
| **Frontend Logic** | JavaScript, Jinja Templating |
| **UI/Styling** | Bootstrap |
| **Deployment** | PythonAnywhere |

---

## Overview
* Full-stack Flask e-commerce platform
* Features include:
  * Store catalog with JSON-driven shopping cart
  * Order lookup & purchase history
  * Account express checkout & guest checkout with autofill
  * Customer reviews and ratings
  * Membership points system
  * Responsive, mobile-first UI

---

## 🔖 Table of Contents
* [Website Demos](https://github.com/jschhie/Music-Band-Store/blob/main/README.md#visual-demos)
* [Running the Website Manually](https://github.com/jschhie/Music-Band-Store/blob/main/README.md#running-the-site-manually)

---

## Visual Demos

### 💿 Main Storefront
> Responsive Design Demos

| Desktop View |
| :---: |
| <img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/avg-stars-store.png" width="650"> |

| Mobile | Tablet |
| :---: | :---: |
| <img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/rwd/mobile-store.png" width="250"> | <img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/rwd/tablet-store.jpeg" width="400"> |

### 🏷️ Product Catalog with Customer Reviews
<img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/avg-stars.png">


### 🛒 Shopping Cart Functionality
<img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/login-view/cart.png">

### 💳 Express Checkout with Membership Rewards
<img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/all-discounts/discounts-2.png">

### 🧾 Order Confirmation
<img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/new-font-merch.png">

<img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/new-font-merch2.png">

### 📦 Order History & Membership Points
<img src="https://github.com/jschhie/Music-Band-Store/blob/main/newdemos/all-discounts/new-account.png">

---

## Running the Site Manually
### 1. Clone this repository:
```bash 
git clone https://github.com/jschhie/Music-Band-Store.git [folderNameHere]
```

### 2. Navigate into the folder: 
```bash 
cd [folderNameHere]
```

### 3. Create and activate virtual environment (`venv`):
> - This project assumes you have `python` v3.11
> - To isolate the project's dependencies:

```bash
/usr/local/bin/python3.11 -m venv venv
source venv/bin/activate
```

### 4. Install the required packages:
```bash
pip3 install -r requirements.txt
```

### 5. Configure environment variables

#### 5a. Create a `.env` file in the root directory:
```bash
vim .env
```

#### 5b. Open the `.env` file and define the following:
```bash
FLASK_SECRET_KEY=any_random_string_here
```

### 6. Run the Flask app:

> - <p>The application will automatically generate a <code>band_store_database.db</code> file in the <code>website</code> directory.</p>
> - <p>Users can access the web application at: http://127.0.0.1:5000/ via any web browser.</p>

```bash
python3 main.py
```
