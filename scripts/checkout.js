import{ cart ,removeFromCart,calculateCartQuantity,updateQuantity} from '../data/cart.js';
import{ products } from '../data/products.js'; // {...} named export 
import{formatCurrency} from'./utils/money.js';
import {hello } from 'https://unpkg.com/supersimpledev@1.0.1/hello.esm.js'; // coding coming from the internet (Esm version of the library)
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js'; // default export

import {deliveryOption} from '../data/deliveryOption.js'

// hello();

// //console.log(dayjs());
// const today = dayjs();
// const deliveryDate = today.add( 7 , 'day');
// //console.log(deliveryDate);
// console.log(deliveryDate.format('dddd , MMMM  D'));

let cartSummaryHTML = ' '; 

cart.forEach((cartItem) => {
  const {productId} = cartItem;

  let matchingProduct;

  products.forEach((product) => {
      if (product.id === productId){
        matchingProduct = product;
      }
  });

    const deliveryOptionID = cartItem.deliveryOptionID;
    let deliveryOpt;
    deliveryOption.forEach ((delivOpt) => {
      if (delivOpt.id = deliveryOptionID){
        deliveryOpt = delivOpt;
      }
    }) ;
    const today = dayjs();
    const deliveryDate = today.add( deliveryOpt.deliveryDays, 'days');
    const dateString = deliveryDate.format ('dddd ,MMMM D');
    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
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
        
          ${deliveryOptionsHTML(matchingProduct,cartItem)}
        
      </div>
    </div>
  </div>`;
});



function deliveryOptionsHTML (matchingProduct,cartItem){

  let html = ``;

  deliveryOption.forEach( (delivOpt) =>  {
    const today = dayjs();
    const deliveryDate = today.add( delivOpt.deliveryDays, 'days');
    const dateString = deliveryDate.format ('dddd ,MMMM D');
    const priceString = delivOpt.priceCents === 0 ? 'FREE' : `${formatCurrency(delivOpt.priceCents)}`;

    const isChecked = delivOpt.id === cartItem.deliveryOptionID;
    html += `<div class="delivery-option">
          <input type="radio"
            ${isChecked ? 'Checked' : ' '}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} - Shipping
            </div>
          </div>
      </div>`
  });

  return html;

}

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




