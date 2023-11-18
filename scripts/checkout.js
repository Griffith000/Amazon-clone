import{ cart ,removeFromCart,calculateCartQuantity,updateQuantity} from '../data/cart.js';
import{ products } from '../data/products.js';
import{formatCurrency} from'./utils/money.js';


let cartSummaryHTML = ' '; 

cart.forEach((cartItem) => {
  const {productId} = cartItem;

  let matchingProduct;

  products.forEach((product) => {
      if (product.id === productId){
        matchingProduct = product;
      }
  });

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src=${matchingProduct.image}>

      <div class="cart-item-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-price">
          $${formatCurrency(matchingProduct.priceCents)}
        </div>
        <div class="product-quantity">
          <span>
            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
          </span>
          <input class="quantity-input js-quantity-input-${matchingProduct.id}">
          <span class="save-quantity-link 
          js-save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>
          <span class="update-quantity-li nk link-primary js-update-quantity-link"  data-product-id="${matchingProduct.id}">
            Update
          </span>
          <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
            Delete
          </span>
        </div>
      </div>

      <div class="delivery-options">
        <div class="delivery-options-title">
          Choose a delivery option:
        </div>
        <div class="delivery-option">
          <input type="radio" checked
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Tuesday, June 21
            </div>
            <div class="delivery-option-price">
              FREE Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Wednesday, June 15
            </div>
            <div class="delivery-option-price">
              $4.99 - Shipping
            </div>
          </div>
        </div>
        <div class="delivery-option">
          <input type="radio"
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              Monday, June 13
            </div>
            <div class="delivery-option-price">
              $9.99 - Shipping
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
});

document.querySelector('.js-order-summary')
  .innerHTML =  cartSummaryHTML;
document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click' , () => {
      const {productId} = link.dataset;
      removeFromCart(productId);
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      updateCartQuantity();
    })
  });
function updateCartQuantity(){
  const cartQuatity = calculateCartQuantity();
  document.querySelector('.js-return-to-home-link')
    .innerHTML = `${cartQuatity } items`;
}

updateCartQuantity();

document.querySelectorAll('.js-update-quantity-link')
  .forEach((link) => {
  link.addEventListener('click' , () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      if (container) {
        container.classList.add('is-editing-quantity');
      } else {
        console.error(`Container not found for product ID: ${productId}`);
      }
  });

  
});
   

document.querySelectorAll('.js-save-quantity-link')
  .forEach((link) => {
  link.addEventListener('click' , () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');
        
        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

        const newQuantity = Number(quantityInput.value);
        updateQuantity(productId,newQuantity);
        if (newQuantity <=0 || newQuantity > 1000){
          alert("please enter a valid quantity !");
          return;
        }
        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

        quantityLabel.innerHTML = newQuantity;

        document.querySelector('.js-return-to-home-link')
       .innerHTML = `${calculateCartQuantity()} items`;
        }
       ); 

      link.addEventListener('keydown' , (event)  =>{
          if(event.key === 'Enter'){
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
      
            if (container) {
              container.classList.add('is-editing-quantity');
            } 
            
          else {
              console.error(`Container not found for product ID: ${productId}`);
            }
          }}
        );
 
        });




