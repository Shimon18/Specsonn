function addWishList(i,e,PostData,localStorage){
    let _itemId = 0;
    let _userId = 0;
    //localStorage.removeItem('irisWishLt');
    //return;
    let irisUserSession = localStorage.getItem('irisUserSession');
    if(irisUserSession == undefined || irisUserSession == null)
    {
        
    }
    else{
        irisUserSession = JSON.parse(irisUserSession);
        _userId = irisUserSession.user_Id;
    }

    let irisWishList = localStorage.getItem('irisWishLt');    
    if(irisWishList === null || irisWishList === undefined){
        var obj = {};
        _itemId = i.product_Id;
        obj.items = [i];
        irisWishList = obj;  
    }
    else{
        irisWishList = JSON.parse(irisWishList);
        const findIds = chkWishListItems(i.product_Id);
        _itemId = i.product_Id;
        if(findIds == 0){
            irisWishList.items.push(i);
        }
        else{
            irisWishList.items = irisWishList.items.filter((item,index) => item.product_Id !== i.product_Id);
        }
    }

    if(_userId > 0){
        let _urlWish = global.userWishList+_itemId+'/'+_userId+'/';
        PostData(_urlWish,'','GET').then((result) => {
            if(result.isMyshortlist == true){

            }
        });
    }
    localStorage.setItem('irisWishLt', JSON.stringify(irisWishList));
}


function chkWishListItems(id){
    let irisWishList = localStorage.getItem('irisWishLt');
    if(irisWishList === null || irisWishList === undefined){
        return(0);  
    }
    
    irisWishList = JSON.parse(irisWishList);
    const product = irisWishList.items.find(item => {
        if(item.product_Id === id)
        {
            return item.product_Id;
        }
    });

    if(product === undefined || product === null)
    {
        return(0);
    }
    else{
        return(product.product_Id);
    }        
};

module.exports = {
    addWishList:addWishList,
    chkWishListItems:chkWishListItems,
}