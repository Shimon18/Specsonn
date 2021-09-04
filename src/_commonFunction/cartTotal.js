function getCartTotal(){
    let irisCart = localStorage.getItem('irisCart');
    if(irisCart === null || irisCart === undefined){
        return(0);  
    }
    
    irisCart = JSON.parse(irisCart);
    let _grandTotal = '0';
    irisCart.items.map((products,index) => {
        let _itemTotal = products.amount.total * products.count;
        _grandTotal = parseInt(_grandTotal) + parseInt(_itemTotal);
    });
    return _grandTotal;
};

module.exports = {
    getCartTotal:getCartTotal,
}