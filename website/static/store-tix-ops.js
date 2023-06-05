/* * * * * STORE OPERATIONS -- PURCHASE ALBUMS, MERCH * * * * * */

/* PURCHASE CART ITEMS */
function purchaseClicked(event) {
    var cartElement = event.parentElement.parentElement;
    var cartTotalElement = cartElement.getElementsByClassName("cart-total")[0];
    var totalPrice = cartTotalElement.getElementsByClassName("cart-total-price")[0].innerText;
    
    if (totalPrice == "$0.00") {
        alert("Empty cart! Please add items to cart before purchase.");
    }  else {
        alert('Thank you for your purchase.');
        var cartItems = document.getElementsByClassName("cart-items-all")[0];
        // Delete all items in cart: Loop over all children in all cart rows
        while(cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild);
        }
        // Reset total price
        document.getElementsByClassName("cart-total-price")[0].innerText = "$0.00";
    }
}



/* REMOVE CART ITEMS */
function removeCartItems(event) {
    var buttonClicked = event;
    // removes "cart-row" element that the button is inside of 
    buttonClicked.parentElement.parentElement.remove(); 
    updateCartTotal();
}



function addToCart(event) {
    var addToCartBtn = event;
    var itemRow = addToCartBtn.parentElement.parentElement;
    
    // Get item's title, price, and image source
    var title = itemRow.getElementsByClassName("shop-item-title")[0].innerText;
    var price = itemRow.getElementsByClassName("shop-item-price")[0].innerText;
    var imageSrc = itemRow.getElementsByClassName("shop-item-image")[0].src; 

    // Create new cart row with selected item if not already in cart
    addRowToCart(title, price, imageSrc);
    updateCartTotal();
}



/* Helper Function to create new item row to cart container */
function addRowToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');

    // Check if duplicate cart item
    var cartItemsAll = document.getElementsByClassName("cart-items-all")[0];
    var cartItemNames = document.getElementsByClassName("cart-item-title");
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to cart.');
            return; // skip below code
        }
    }

    var cartRowContents = `       
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100px">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-amount cart-column">
            <input type="number" value="1" class="cart-input" onchange="quantityChanged(this)">
            <button type="button" class="btn cart-remove-btn" onclick="removeCartItems(this)">REMOVE</button>
        </div>`; 
    // backticks to use on multiple lines and can directly add variables with ${varName}
    cartRow.innerHTML = cartRowContents;

    // Add new cartRow to end of cartItemsAll
    cartItemsAll.append(cartRow); 
}



/* ITEM QUANTITY INPUT CHANGED */
function quantityChanged(event) {
    var input = event;
    // check if valid number
    if (isNaN(input.value) || input.value <= 0) {
        // must purchase at least one item to remain in cart
        input.value = 1;
    }
    updateCartTotal();
}



/* UPDATE CART TOTAL */
function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items-all")[0]; // [0]: get the container element itself
    var cartRows = cartItemContainer.getElementsByClassName("cart-row"); // get array of all elements with class="cart-row"
    
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        // get item price
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName("cart-price")[0];
        
        // remove '$' and convert string to float
        var price = parseFloat(priceElement.innerText.replace('$', '')); 
        
        // get input item quantity
        var amountContainer = cartRow.getElementsByClassName("cart-amount")[0];
        var amountElement = amountContainer.getElementsByClassName("cart-input")[0];
        var amount = amountElement.value;
        
        // add up total price 
        total = total + (price * amount);
    }

    // format total value by rounding two decimal places
    total = Math.round(total * 100) / 100;
    var totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
    formatPrice(total, totalPriceElement);
}



function formatPrice(total, element) {    
    // check if need to add any '0'(s) at the end of decimal
    var newPriceString = '$' + total;

    // string 3 5 . 9 8
    // index  0 1 2 3 4
    var totalString = total.toString();
    var startIndex = totalString.indexOf("."); 
    
    if (startIndex == -1) {
        // whole integer value, without decimals
        element.innerHTML = newPriceString + ".00";
        return; // skip rest of code below
    }

    var decimalPart = parseFloat(totalString.slice(startIndex, totalString.length));
    var test = (decimalPart * 100) % 10;

    // 0.1 * 100 = 10 [divisible by 10]
    // 0.2 * 100 = 20 [...]
    // 0.14 * 100 = 14 [NOT divisible by 10 perfectly]

    if (test == 0) {
        element.innerHTML = newPriceString + '0';
    }
    else {
        element.innerHTML = newPriceString;
    }
}



/* * * * * PURCHASE TOUR TICKETS OPERATIONS * * * * * */

function addTixToCart(event) {
    var tixBtn = event;
    
    // Get ticket type, price, and icon
    var tixType = tixBtn.getElementsByClassName("tix-type")[0].innerText;
    var tixPrice = tixBtn.getElementsByClassName("tix-price")[0].innerText;
    //var tixIcon = tixBtn.getElementsByClassName("tix-span")[0].getElementsByClassName("tix-icon")[0];

    // Create new cart row with selected item if not already in cart
    addTixRowToCart(tixType, tixPrice);
    updateCartTotal();
}


function addTixRowToCart(tixType, price) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');

    // Check if duplicate ticket
    var cartItemsAll = document.getElementsByClassName("cart-items-all")[0];
    var cartTixTypes = document.getElementsByClassName("cart-type");
    
    for (var i = 0; i < cartTixTypes.length; i++) {
        if (cartTixTypes[i].innerText == tixType) {
            alert('This item is already added to cart.');
            return; // skip below code
        }
    }
    
    var cartRowContents = `       
        <div class="cart-item cart-column">
            <span class="cart-type">${tixType}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-amount cart-column">
            <input type="number" value="1" class="cart-input" onchange="quantityChanged(this)">
            <button type="button" class="btn cart-remove-btn" onclick="removeCartItems(this)">REMOVE</button>
        </div>`; 
    cartRow.innerHTML = cartRowContents;

    // Add new cartRow to end of cartItemsAll
    cartItemsAll.append(cartRow); 

}
