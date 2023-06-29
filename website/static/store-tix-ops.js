/* * * * * ABOUT GALLERY * * * * * */
function upDate(previewPic) {
    var image = document.getElementById("selected-img");
    image.src = previewPic.src;
    var caption = document.getElementById("gallery-caption");
    caption.innerText = previewPic.alt;
}



function unDo() {
    var image = document.getElementById("selected-img");
    image.src = "https://live.staticflickr.com/65535/52726177441_42743d38ed_o.png";
    var caption = document.getElementById("gallery-caption");
    caption.innerText = image.alt;
}



/* * * * * GENERAL PURCHASING OPERATIONS * * * * * */
function radioChange(event) {
    shippingFee = event.parentElement.getElementsByClassName("form-check-label")[0].getElementsByClassName("radio-price")[0].innerText;
    document.getElementById("shipping-fee").innerText = shippingFee;
    addCheckoutPrices();
}

function addCheckoutPrices() {
    subtotalStr = document.getElementById("subtotal").innerText.replace('$', '');
    feeStr = document.getElementById("shipping-fee").innerText.replace('$', '');
    document.getElementById("total-price").innerText = (parseFloat(subtotalStr) + parseFloat(feeStr)).toFixed(2);

    // Hidden div information
    document.getElementById("hidden-subtotal").value = subtotalStr;
    document.getElementById("hidden-delivery-fee").value = feeStr;
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
        // save session's totalPrice, predictedTotal
        sessionStorage.setItem("subtotal", totalPrice);
        temp = parseFloat(totalPrice.replace('$','')) + 5.99; // Standard $5.99 shipping fee
        sessionStorage.setItem("predictedTotal", temp.toFixed(2))
        // redirect to Checkout Page for store merch or tour tickets
        document.location.href = '/checkout/' + txnType;
    }
}


function purchaseClicked(event) {
    // check if invalid page visit or user already purchased but clicked 'Back' Page
    if (document.getElementById("subtotal").innerText == "") {
        alert('Invalid checkout page. Returning Home!');
        document.location.href = '/';
        return false;
    }

    // check if all fields are filled out
    ids = ["ship", "bill"];
    idNames = ["Name", "Address", "City", "Zip", "State", "Email"];
    for (i = 0; i < ids.length; i++) {
        idType = ids[i];
        for (j = 0; j < idNames.length; j++) {
            idName = idNames[j];
            if (checkFormFields(idType, idName) == false) {
                return false;
            }
        }
    }

    // check payment information
    if (checkFormFields("", "ccn") == false || checkFormFields("", "cvc") == false) {
        return false;
    }

    // Reset session storage variables
    sessionStorage.setItem("subtotal", "$0.00");
    sessionStorage.setItem("predictedTotal", "$0.00");

    // Successful form
    return true;
}

function checkFormFields(idType, idName) {
    if (idType == "findOrder") {
        orderID = document.getElementById("orderID").value;
        lastName = document.getElementById("fullName").value;
        if (orderID == '' || lastName == '') {
            alert('Please fill out missing form fields!');
            return false;
        } else if (/^\d+$/.test(orderID) == false) {
            alert('Please provide a valid Order Number.');
            return false;
        } else {
            return true;
        }
    }

    idString = idType + idName;
    elementValue = document.getElementById(idString).value;
    if (elementValue == '') {
        alert('Please fill out missing form fields!');
        return false;
    } else if (idName == "Zip" && /^\d+$/.test(elementValue) == false) {
        alert('Please provide a valid Zipcode (only digits).');
        return false;
    } else if ((idName == "ccn" || idName == "cvc") && /^\d+$/.test(elementValue) == false) {
        alert('Invalid Credit Card Information.');
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
    // Update cart total and also create dictionary of items in cart
    var cartItemContainer = document.getElementsByClassName("cart-items-all")[0]; // [0]: get the container element itself
    var cartRows = cartItemContainer.getElementsByClassName("cart-row"); // get array of all elements with class="cart-row"

    var total = 0;
    var json_cart = []; // list of dictionaries
    var header = document.getElementsByClassName("cart-type-header")[0].innerText; // either "TICKET TYPE" (tickets) OR "ITEM" (merch)

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
        var prod_title = "";
        var merch_size = "";

        // get product title or ticket type name
        if (header == "TICKET TYPE") {
            prod_title = cartRow.getElementsByClassName("cart-type")[0].innerText.replaceAll('\n', ''); // mobile view inserts 'newline' at front and end of title
        } else {
            prod_title = cartRow.getElementsByClassName("cart-item")[0].innerText.replaceAll('\n', ''); // mobile view inserts 'newline' at front and end of title
            var trimIndex = prod_title.indexOf('(');
            if (trimIndex != -1) {
                merch_size = prod_title.substring(trimIndex);
                prod_title = prod_title.substring(0,trimIndex);
            }
        }
        var new_row = { "prod_title": prod_title, "qty_sold": amount, "merch_size": merch_size };
        
        json_cart.push(new_row);
    }

    // Outside for loop: init venue and venue_date once 
    var venue = "None";
    var venue_date = "None";
    if (header == "TICKET TYPE") {
        // get concert venue, date, and time
        venue = document.getElementsByClassName("arena-link")[0].innerText;
        venue_date = document.getElementsByClassName("venue-date")[0].innerText;
    }
    json_cart.push({ "venue": venue, "venue_date": venue_date }); // Append to end of list

    // format total value by rounding two decimal places
    total = Math.round(total * 100) / 100;
    var totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
    formatPrice(total, totalPriceElement);

    sessionStorage.setItem("shoppingCart", JSON.stringify(json_cart));
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

    // Check if merch size applicable
    var sizeOption = "";
    if (title.includes("Hoodie")) {
        if (title.includes("Black")) {
            sizeOption = '(' + document.getElementById("blackHoodSize").value + ')';
        } else {
            sizeOption = '(' + document.getElementById("whiteHoodSize").value + ')';
        }
    }

    // Check if duplicate cart item
    var cartItemsAll = document.getElementsByClassName("cart-items-all")[0];
    var cartItemNames = document.getElementsByClassName("cart-item-title");
    var cartItemSizes = document.getElementsByClassName("cart-item-size");

    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText.includes(title)) {
            if (sizeOption != "") {
                if (cartItemSizes[i].innerText.includes(sizeOption)) {
                    // Duplicate Size selected for Duplicate Merch
                    alert('This size has already been added to cart.');
                    return; // skip below code
                }
            } else {
                // Album Purchase
                alert('This item is already added to cart.');
                return; // skip below code
            }
        }
    }

    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100px">
            <span class="cart-item-title">
                ${title}
                <span class="cart-item-size">${sizeOption}</span>
            </span>
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
