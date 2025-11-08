export const priceWithDiscount = (price, dis) => {
  // Ensure price and discount are numbers and handle undefined or null values
  const priceValue = Number(price);
  const discountValue = Number(dis);

  // Check if price is a valid positive number
  if (isNaN(priceValue) || priceValue <= 0) {
    console.error("Invalid price value:", price);
    return null; // Return null if price is invalid
  }

  // Check if discount is a valid number (0 to 100)
  if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
    console.error("Invalid discount value:", dis);
    return null; // Return null if discount is invalid
  }

  // If discount is 0, return original price
  if (discountValue === 0) {
    return priceValue;
  }

  // Calculate the discount amount
  const discountAmount = Math.ceil((priceValue * discountValue) / 100);

  // Calculate the actual price after applying the discount
  const actualPrice = priceValue - discountAmount;

  return actualPrice;
};
