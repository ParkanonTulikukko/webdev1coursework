window.onload = async () => {
    
    const productData = await getJSON('/api/products');
    //console.log(productData);
    
    const temp = document.getElementById('product-template');
    const productDiv = document.getElementById('products-container');
    productData.map((product) => {
        let tmp = temp.content.cloneNode(true);

        let name = tmp.querySelector('.product-name');
        name.setAttribute('id', 'name-' +product._id);
        name.textContent = product.name;
        
        let description = tmp.querySelector('.product-description');
        description.setAttribute('id', 'description-' +product._id);
        description.textContent = product.description;

        let price = tmp.querySelector('.product-price');
        price.setAttribute('id', 'price-' +product._id);
        price.textContent = product.price;
        
        const addToCartButton = tmp.querySelector('.item-row').getElementsByTagName("button")[0];
        addToCartButton.setAttribute('id', 'add-to-cart-' + product._id);

        productDiv.append(tmp);
    
        productDiv.querySelector('#add-to-cart-' +product._id).addEventListener("click", async () => {
            addProductToCart(product._id);
            const textContent = document.getElementById('notifications-container').textContent;
            document.getElementById('notifications-container').textContent = textContent + "Added " + product.name + " to cart!";
            });
        
        //for   

    });
}//window.onload
