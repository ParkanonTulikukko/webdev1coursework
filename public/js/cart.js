function addProductToCart(id) {
    if (sessionStorage.getItem(id) === null) {sessionStorage.setItem(id, 1);}
    else {sessionStorage.setItem(id, parseInt(sessionStorage.getItem(id))+1);}    
    }

function decreaseProductCount(id) {
    if (sessionStorage.getItem(id) == 1) {sessionStorage.removeItem(id);}
    else {sessionStorage.setItem(id, parseInt(sessionStorage.getItem(id))-1);}
    } 

function clearCart() {
    sessionStorage.clear();
    }    

window.onload = async () => {
    const productData = await getJSON('/api/products');
    //console.log(productData);
    
    const cartDiv = document.getElementById('cart-container');
    const temp = document.getElementById('cart-item-template');

    //work in progress
    let productsInCart = productData.filter(product => sessionStorage.getItem(product._id));
    console.log(productData);
    console.log(productsInCart);
    //for (let i = 0; i < sessionStorage.length; i++) {
    productsInCart.map((product) => {
        const count = sessionStorage.getItem(product._id);
        //console.log(productId + " " + count);

        // let product;
        // for (let productDataProduct of productData) {
        //     if (productDataProduct._id === productId) {
        //         product = productDataProduct;
        //         }
        //     }

        let tmp = temp.content.cloneNode(true);
            
        tmp.querySelector('.item-row').setAttribute('id', 'product-' +product._id);

        let name = tmp.querySelector('.product-name');
        name.setAttribute('id', 'name-' +product._id);
        name.textContent = product.name;
    
        let price = tmp.querySelector('.product-price');
        price.setAttribute('id', 'price-' +product._id);
        price.textContent = product.price;

        let amount = tmp.querySelector('.product-amount');
        amount.setAttribute('id', 'amount-' +product._id);
        amount.textContent = count + "x";            
            
        let cartPlusButton = tmp.querySelector('.cart-plus-button');
        cartPlusButton.setAttribute('id', 'plus-' + product._id);

        let cartMinusButton = tmp.querySelector('.cart-minus-button');
        cartMinusButton.setAttribute('id', 'minus-' + product._id);

        cartDiv.append(tmp);

        cartDiv.querySelector('#plus-' + product._id).addEventListener("click", async () => {
            const textContent = amount.textContent;
            amount.textContent = (parseInt(textContent.substring(0, textContent.length-1)) + 1) + "x";
            addProductToCart(product._id);
            });    
        
        cartDiv.querySelector('#minus-'+product._id).addEventListener("click", async () => {
            if (amount.textContent === "1x") {document.getElementById("product-" + product._id).remove();}
            else {
                const textContent = amount.textContent;
                amount.textContent = (parseInt(textContent.substring(0, textContent.length-1)) - 1) + "x";
                }
            decreaseProductCount(product._id);
            });    
        });//for 

    const orderButton = document.getElementById("place-order-button");
    orderButton.addEventListener("click", async () => {
        clearCart();
        cartDiv.innerHTML = "";
        document.getElementById('notifications-container').textContent = "Successfully created an order!";
        });
    
}//window.onload 