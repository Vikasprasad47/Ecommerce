export const DisplayPriceInRupees = (price) => {
    return new Intl.NumberFormat('en-In',{
        style: 'currency',
        currency: 'INR',
        // minimumFractionDigits: 0,
        // maximumFractionDigits: 0,
    }).format(price)
}