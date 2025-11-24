import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      
     
      <h1 className='cards__title'>Check out these EPIC Destinations!</h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              src='images/image-4.png'
              text='Experience the majestic landscapes of Ladakh, where towering peaks and serene valleys create a breathtaking adventure.'
            />
            <CardItem
              src='images/image-2.png'
              text='Stroll through the lush green hills of Munnar, Kerala.'
            />
          </ul>
          <ul className='cards__items'>
            <CardItem
              src='images/image-3.png'
              text='Unwind by the serene beaches and hidden lagoons of Goa.'
            />
            <CardItem
              src='images/image-5.png'
              text='Explore Karnataka’s stunning landscapes and rich heritage.'
            />
            <CardItem
              src='images/image-6.png'
              text='Experience the golden sands and vast dunes of the Thar Desert, where adventure meets timeless beauty.'
            />
            <div>
  
  {/* Your other section */}
</div>


          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
