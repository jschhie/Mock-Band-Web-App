/* CHECK IF DOM CONTENT LOADED*/
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}



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

    // Add new items to cart
    var addCartItemBtns = document.getElementsByClassName("shop-item-btn");
    for (var i = 0; i < addCartItemBtns.length; i++) {
        var addCartBtn = addCartItemBtns[i];
        addCartBtn.addEventListener('click', addCartItemClicked);
    }

    // Purchase items in cart
    var purchaseBtn = document.getElementsByClassName("purchase-btn")[0];
    purchaseBtn.addEventListener('click', purchaseClicked);

}



/* PURCHASE CART ITEMS */
function purchaseClicked() {
    var totalPrice = document.getElementsByClassName("cart-total-price")[0].innerText;
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



/* ADD NEW CART ITEM */
function addCartItemClicked(event) {
    var addItemBtn = event.target;
    var itemRow = addItemBtn.parentElement.parentElement;
    
    // Get item's title, price, and image source
    var title = itemRow.getElementsByClassName("shop-item-title")[0].innerText;
    var price = itemRow.getElementsByClassName("shop-item-price")[0].innerText;
    var imageSrc = itemRow.getElementsByClassName("shop-item-image")[0].src; 

    // Create new cart row with selected item if not already in cart
    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}



/* Helper Function to create new item row to cart container */
function addItemToCart(title, price, imageSrc) {
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
            <input type="number" value="1" class="cart-input">
            <button type="button" class="btn cart-remove-btn">REMOVE</button>
        </div>`; 
    // backticks to use on multiple lines and can directly add variables with ${varName}
    cartRow.innerHTML = cartRowContents;

    // Add new cartRow to end of cartItemsAll
    cartItemsAll.append(cartRow); 
    cartRow.getElementsByClassName("cart-remove-btn")[0].addEventListener('click', removeCartItems);
    cartRow.getElementsByClassName("cart-input")[0].addEventListener('change', quantityChanged);
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