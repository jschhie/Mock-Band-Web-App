// need to make sure html body is done loading
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}



/* LINK JS CODE TO HTML ELEMENTS IFF DOM CONTENT LOADED */
function ready() {
    // Remove any unwanted items from cart
    var removeCartItemBtns = document.getElementsByClassName("cart-remove-btn");
    
    for (var i = 0; i < removeCartItemBtns.length; i++) {
        var button = removeCartItemBtns[i];
        button.addEventListener('click', removeCartItems);
    }
    
    // Get user input for cart item quantities
    var quantityInputs = document.getElementsByClassName("cart-input");

    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener('change', quantityChanged);
    }
}


/* REMOVE CART ITEMS */
function removeCartItems(event) {
    var buttonClicked = event.target;
    // removes "cart-row" element that the button is inside of 
    buttonClicked.parentElement.parentElement.remove(); 
    updateCartTotal();
}


/* ITEM QUANTITY INPUT CHANGED */
function quantityChanged(event) {
    var input = event.target;
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

    var totalPriceElement = document.getElementsByClassName("cart-total-price")[0];
    // format total value by rounding two decimal places
    total = Math.round(total * 100) / 100;
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