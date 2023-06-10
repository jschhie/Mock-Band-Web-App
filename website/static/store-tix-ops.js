/* * * * * GENERAL PURCHASING OPERATIONS * * * * * */
function radioChange(event) {
    shippingFee = event.parentElement.getElementsByClassName("form-check-label")[0].getElementsByClassName("radio-price")[0].innerText;
    document.getElementById("shipping-fee").innerText = shippingFee;
    addCheckoutPrices();
}

function addCheckoutPrices() {
    subtotalInteger = parseFloat(document.getElementById("subtotal").innerText.replace('$', ''));
    feeInteger = parseFloat(document.getElementById("shipping-fee").innerText.replace('$', ''));
    document.getElementById("total-price").innerText = (subtotalInteger + feeInteger).toFixed(2); // round to 2 decimal places

    // Hidden div information
    document.getElementById("hidden-subtotal").value = subtotalInteger;
    document.getElementById("hidden-delivery-fee").value = feeInteger;
    document.getElementById("hidden-total-price").value = document.getElementById("total-price").innerText;
}

function editCheckout(event) {
    idNames = ["Name", "Address", "City", "Zip", "State", "Email"];
    if (event.checked) {
        for (i = 0; i < idNames.length; i++) {
            idName = idNames[i];
            shipValue = document.getElementById("ship" + idName).value;
            // copy over to billing
            document.getElementById("bill" + idName).value = shipValue;
        }
    } else {
        // clear billing fields
        for (i = 0; i < idNames.length; i++) {
            idName = idNames[i];
            document.getElementById("bill" + idName).value = '';
        }
    }
}

/* PURCHASE CART ITEMS */
/*
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
*/



function startCheckout(event, txnType) {
    var cartElement = event.parentElement.parentElement;
    var cartTotalElement = cartElement.getElementsByClassName("cart-total")[0];
    var totalPrice = cartTotalElement.getElementsByClassName("cart-total-price")[0].innerText;
    
    if (totalPrice == "$0.00") {
        alert("Empty cart! Please add items to cart before purchase.");
        // return to top of page
        document.location.href = '#';
    }  else {
        // save session's totalPrice
        sessionStorage.setItem("subtotal", totalPrice);
        temp = parseFloat(totalPrice.replace('$','')) + 5.99;
        sessionStorage.setItem("predictedTotal", temp.toFixed(2)) // with $5.99 shipping fee
        // redirect to Checkout Page for store merch or tour tickets
        document.location.href = '/checkout/' + txnType;
    }
}


function purchaseClicked(event) {    
    // check if all fields are filled out
    ids = ["ship", "bill"];
    idNames = ["Name", "Address", "City", "Zip", "State", "Email"];
    for (i = 0; i < ids.length; i++) {
        idType = ids[i];
        for (j = 0; j < idNames.length; j++) {
            idName = idNames[j];
            if (checkFormFields(idType, idName) == false) {
                alert('Please fill out missing fields!');
                return false;
            }
        }
    }
    // Reset session storage variables
    document.sessionStorage.setItem("subtotal", "$0.00");
    document.sessionStorage.setItem("predictedTotal", "$0.00");

    // Successful form
    return true;    
}

function checkFormFields(idType, idName) {
    idString = idType + idName;
    element = document.getElementById(idString).value;
    if (element == '') {
        return false;
    } else {
        return true;
    }
}

/* REMOVE CART ITEMS */
function removeCartItems(event) {
    var buttonClicked = event;
    // removes "cart-row" element that the button is inside of 
    buttonClicked.parentElement.parentElement.remove(); 
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



/* * * * * STORE OPERATIONS -- PURCHASE ALBUMS, MERCH * * * * * */

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
