/* * * * * GALLERY IMAGE, REVIEWS FOR PRODUCT CATALOG * * * * * */
function updateRating(radio) {
    // check if radio button element passed or integer 
    if (typeof radio === "number") {
        maxStars = radio; // integer 1-5
    } else {
        maxStars = radio.value;
    }

    // update star rating image for Product Review
    darkStars = '';    
    for (let i = 0; i < maxStars; i++) {
        // darken stars for x radio.value times
        darkStars += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
      </svg>`;
    }
    document.getElementById("rating-stars").innerHTML = darkStars;

    whiteStars = '';
    for (let i = maxStars; i < 5; i++) {
        // darken stars for x radio.value times
        whiteStars += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
        <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
      </svg>`;
    }
    document.getElementById("rating-stars").innerHTML += whiteStars;
}



function showImg(image) {
    // replace modal main image
    var mainImg = image.parentElement.getElementsByClassName("modal-img")[0];
    if (image.src != mainImg.src) {
        mainImg.src = image.src;
        // lighten other preview image border (Exactly two preview images)
        var otherImgs = image.parentElement.getElementsByClassName("preview-img");
        if (otherImgs[0].src == image.src) {
            otherImgs[1].style.borderColor = "lightgrey";
        } else {
            otherImgs[0].style.borderColor = "lightgrey";
        }
        // darken current preview image border
        image.style.borderColor = "black";        
    }
}

/* * * * * CHECKOUT VALIDATION * * * * * */
function radioChange(event) {
    shippingFee = event.parentElement.getElementsByClassName("form-check-label")[0].getElementsByClassName("radio-price")[0].innerText;
    document.getElementById("shipping-fee").innerText = shippingFee;
    addCheckoutPrices(); // add subtotal, discount, shipping fee
}



function addCheckoutPrices() {
    subtotalStr = document.getElementById("subtotal").innerText.replace('$', '');
    feeStr = document.getElementById("shipping-fee").innerText.replace('$', '');
    document.getElementById("total-price").innerText = (parseFloat(subtotalStr) + parseFloat(feeStr)).toFixed(2);
    
    // Apply discounts, if checked
    if (document.getElementById("discount").innerText != "-$0.00") {
        discountStr = document.getElementById("discount").innerText.replace('$',''); // -123.45 format
        document.getElementById("total-price").innerText = (parseFloat(document.getElementById("total-price").innerText) + parseFloat(discountStr)).toFixed(2);
    }

    // Hidden div information
    document.getElementById("hidden-subtotal").value = subtotalStr;
    document.getElementById("hidden-delivery-fee").value = feeStr;
    document.getElementById("hidden-total-price").value = document.getElementById("total-price").innerText;
    document.getElementById("hidden-points").value = discountStr; // formatted as: -123.45, without $ character
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

        // redirect to Checkout Page
        document.location.href = '/checkout';
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



/* * * * * TICKETS / MERCH STORE PURCHASE OPERATIONS * * * * * */
/* TOGGLE EMPTY CART MESSAGE, CHECKOUT BUTTON */
function toggleEmptyCart(totalPriceId, emptyTextId, checkoutBtnId) {
    var total_price = document.getElementById(totalPriceId).innerHTML;
    if (total_price == "$0.00") {
        // show message, hide checkout button
        document.getElementById(emptyTextId).style.display = "block";
        document.getElementById(checkoutBtnId).style.display = "none";
    } else {
        // hide message, show checkout button
        document.getElementById(emptyTextId).style.display = "none";
        document.getElementById(checkoutBtnId).style.display = "block";
    }
}



/* REMOVE CART ITEMS */
function removeCartItems(event) {
    var buttonClicked = event;
    // removes "cart-row" element that the button is inside of
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

/* APPLY OR REMOVE MEMBERSHIP POINTS */
function applyPoints(checkbox) {
    if (checkbox.checked) {
        // update Discounts value
        let discountValue = document.getElementById("discount-value").innerText;
        document.getElementById("discount").innerText = '-$' + discountValue;
    } else {
        document.getElementById("discount").innerText = '-$0.00';
    }

    addCheckoutPrices(); // add subtotal, discount, shipping fee

    /*
    // update total amount in checkout
    subtotalStr = document.getElementById("subtotal").innerText.replace('$', '');
    feeStr = document.getElementById("shipping-fee").innerText.replace('$', '');
    discountStr = document.getElementById("discount").innerText.replace('$','');
    document.getElementById("total-price").innerText = (parseFloat(subtotalStr) + parseFloat(feeStr)).toFixed(2);
    if (parseFloat(discountStr) != '-0.00') {
        document.getElementById("total-price").innerText = (parseFloat(document.getElementById("total-price").innerText) + parseFloat(discountStr)).toFixed(2);
    }
    
    // Hidden div information
    document.getElementById("hidden-subtotal").value = subtotalStr;
    document.getElementById("hidden-delivery-fee").value = feeStr;
    document.getElementById("hidden-points").value = discountStr; // formatted as: -123.45, without $ character
    document.getElementById("hidden-total-price").value = document.getElementById("total-price").innerText;
    */
}

/* UPDATE CART TOTAL */
function updateCartTotal() {
    // Update cart total and also create dictionary of items in cart
    var cartItemContainer = document.getElementsByClassName("cart-items-all")[0]; // [0]: get the container element itself
    var cartRows = cartItemContainer.getElementsByClassName("cart-row"); // get array of all elements with class="cart-row"

    var total = 0;
    var json_cart = []; // list of dictionaries
    var num_items_sold = 0;

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

        num_items_sold = parseInt(num_items_sold) + parseInt(amount);

        // add up total price
        total = total + (price * amount);
        var prod_title = "";
        var merch_size = "";

        // get product title 
        prod_title = cartRow.getElementsByClassName("cart-item")[0].innerText.replaceAll('\n', ''); // mobile view inserts 'newline' at front and end of title
        var trimIndex = prod_title.indexOf('(');
        if (trimIndex != -1) {
            merch_size = prod_title.substring(trimIndex);
            prod_title = prod_title.substring(0,trimIndex);
        }
        var new_row = { "prod_title": prod_title, "qty_sold": amount, "merch_size": merch_size };        
        json_cart.push(new_row);
    }

    // Update ccart badge notif number
    document.getElementsByClassName("cart-notif")[0].innerText = parseInt(num_items_sold);

    // Format total value by rounding two decimal places
    total = Math.round(total * 100) / 100;
    var totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
    formatPrice(total, totalPriceElement);
    sessionStorage.setItem("shoppingCart", JSON.stringify(json_cart));

    // Toggle empty cart message and checkout button
    toggleEmptyCart("merch-total-price", "empty-merch-text", "checkout-merch-btn");
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
    } else {
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
    var offCanvas = document.getElementById("offcanvasRight").getElementsByClassName("offcanvas-body")[0];

    var cartItemsAll = offCanvas.getElementsByClassName("cart-items-all")[0];
    var cartItemNames = offCanvas.getElementsByClassName("cart-item-title");
    var cartItemSizes = offCanvas.getElementsByClassName("cart-item-size");

    for (var i = 0; i < cartItemNames.length; i++) {        
        if (cartItemNames[i].textContent.includes(title)) {
            if (sizeOption != "") {
                if (cartItemSizes[i].textContent.includes(sizeOption)) {
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
            <img class="cart-item-image" src="${imageSrc}" width="80px">
            <span class="cart-item-title">
                ${title}
                <span class="cart-item-size">${sizeOption}</span>
            </span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-amount cart-column">
            <input type="number" value="1" class="cart-input" onchange="quantityChanged(this)">
            <button type="button" class="btn cart-remove-btn" onclick="removeCartItems(this)">
                <svg class="remove-svg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </button>
        </div>`;
    // backticks to use on multiple lines and can directly add variables with ${varName}
    cartRow.innerHTML = cartRowContents;

    // Add new cartRow to end of cartItemsAll
    cartItemsAll.append(cartRow);

    if (sizeOption != "") {
        alert(title + ' ' + sizeOption + ' added to cart!');
    } else {
        alert(title + ' (Album) added to cart!');
    }
}


/* * * * * SETTINGS: SAVE SHIPPING ADDRESS SELECTED STATE * * * * * */
/*
function saveShippingState() {
    //var state = document.getElementById('hiddenState').value;
    var state = document.getElementById("savedState").value;
    document.getElementById('hiddenState').value = state;
    alert(state);
    document.getElementById(state).selected = "true";
}*/