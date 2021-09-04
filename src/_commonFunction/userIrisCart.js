const _rtVal = '-->Gotoo';
export function userCartManage(localStorage,PostData,obj,_key)
{
    let irisCart = localStorage.getItem('irisCart');
    let cartCount = 0;
    if(irisCart == undefined || irisCart == null)
    {
        
    }
    else{
        irisCart = JSON.parse(irisCart);
        cartCount = irisCart.items ? irisCart.items.length : 0;
    }

    let _userId = 0;
    let irisUserSession = localStorage.getItem('irisUserSession');
    if(irisUserSession == undefined || irisUserSession == null)
    {
        
    }
    else{
        irisUserSession = JSON.parse(irisUserSession);
        _userId = irisUserSession.user_Id;
    }
    
    
    if(_key == 'Import')
    {
        if(cartCount > 0)
        {
            let _itemIds = [];
            irisCart.items.map((products,index) => {    
                _itemIds.push({'product_Id':products.product_Id,'lens_Id':products.lens_Id,'lens_discountPrice':products.options.afterDiscount,'lens_izPrice':products.options.salePrice,'product_izPrice':products.salePrice,'product_discountPrice':products.afterDiscount,'count':products.count,'commonArray':products});
            })                       

            const dataSend = JSON.stringify({
                userId: _userId,
                countryId: irisCart.countryId,
                currencyCode: irisCart.currencyCode,
                languageId: irisCart.languageId,
                itemId: _itemIds
            });

            PostData(global.userCartImport, dataSend,'POST').then((result) => {
                let responseJson = result;
                return(responseJson.success);
            });
        }
        return _rtVal;
    }

    else if(_key == 'Export')
    {   
        let _urlData = global.userCartExport+'?country_Id='+localStorage.getItem('countryId')+'&language_Id='+localStorage.getItem('languageId')+'&userId='+_userId;        

        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            if(responseJson.success === true)
            {
                localStorage.removeItem('irisCart');
                let _arrayData = responseJson.response;
                for(let _i=0; _i < _arrayData.length;_i++)
                {
                    var lesPA = {};
                    var lastFinal = {};
                    var obj = {};
                    
                    let irisCartList = localStorage.getItem('irisCart');

                    let _lensI = _arrayData[_i].options.id ? _arrayData[_i].options.id : 0;
                    let _amountData = _arrayData[_i].amount;

                    if(_lensI > 0)
                    {
                        let _lensData = _arrayData[_i].options;
                        lesPA.type =_lensData.type;
                        lesPA.name = _lensData.name;
                        lesPA.label = _lensData.label;
                        lesPA.currencyCode = _lensData.currencyCode;
                        lesPA.value = _lensData.value;
                        lesPA.id = _lensData.id;
                        lesPA.pid =_lensData.pid;
                        lesPA.bid = _lensData.bid;
                        lesPA.warranty = _lensData.warranty;
                        lesPA.salePrice = _lensData.salePrice;
                        lesPA.discount = _lensData.discount;
                        lesPA.afterDiscount = _lensData.afterDiscount;
                    }

                    lastFinal.currencyCode = _amountData.currencyCode;
                    lastFinal.discounts = _amountData.discounts;
                    lastFinal.totalDiscount = _amountData.totalDiscount;
                    lastFinal.totalTax = _amountData.totalTax;
                    lastFinal.shipping = _amountData.shipping;
                    lastFinal.subTotal = _amountData.subTotal;
                    lastFinal.total = _amountData.total;
                    
                    if(irisCartList === null || irisCartList === undefined){
                        irisCartList = {};                        
                        // var obj = {};
                        obj.storeId = '1';
                        obj.countryId = localStorage.getItem('countryId');
                        obj.languageId = localStorage.getItem('languageId');
                        obj.currencyCode = _amountData.currencyCode;
                        obj.itemsQty = '0';
                        obj.itemsCount = _arrayData.length;
                        obj.items = [{
                            'product_Id':_arrayData[_i].product_Id,
                            'lens_Id':_arrayData[_i].lens_Id,
                            'product_Name':_arrayData[_i].product_Name,
                            'salePrice':_arrayData[_i].salePrice,
                            'discount':_arrayData[_i].discount,
                            'afterDiscount':_arrayData[_i].afterDiscount,
                            'product_image':_arrayData[_i].product_image,
                            'product_Url':_arrayData[_i].product_Url,
                            'count' : _arrayData[_i].count,
                            'options' : lesPA,
                            "amount": lastFinal
                        }];
                        irisCartList = (obj);                    
                        //localStorage.setItem('irisCart', JSON.stringify(irisCartList));
                    }
                    else
                    {
                        irisCartList = JSON.parse(irisCartList);
                        let item={};
                        item = {
                            'product_Id':_arrayData[_i].product_Id,
                            'lens_Id':_arrayData[_i].lens_Id,
                            'product_Name':_arrayData[_i].product_Name,
                            'salePrice':_arrayData[_i].salePrice,
                            'discount':_arrayData[_i].discount,
                            'afterDiscount':_arrayData[_i].afterDiscount,
                            'product_image':_arrayData[_i].product_image,
                            'product_Url':_arrayData[_i].product_Url,
                            'count' : _arrayData[_i].count,
                            'options' : lesPA,
                            "amount": lastFinal
                        };
                        irisCartList.items.push(item);                         
                    }
                    localStorage.setItem('irisCart', JSON.stringify(irisCartList));
                }
               // console.log('Return noww')
                return _rtVal;
                //localStorage.setItem('irisCart', JSON.stringify(responseJson.response));
            }
            else{
                return _rtVal;
            }            
        });        
    }
    
    else if(_key == 'RemoveCartItem')
    {
        if(_userId > 0)
        {
            let _urlData = global.userCartRemoveSingle+'?country_Id='+localStorage.getItem('countryId')+'&language_Id='+localStorage.getItem('languageId')+'&userId='+_userId+'&product_Id='+obj.productId+'&lens_Id='+obj.lens_Id+'&count='+obj.count;        

            PostData(_urlData,'','GET').then((result) => {
                let responseJson = result;
                if(responseJson.success === true)
                {
                    
                }
            }); 
        }   
        return _rtVal;            
    }

    else if(_key == 'EmptyCartItem')
    {
        if(_userId > 0)
        {
            let _urlData = global.userCartRemoveEmpty+'?country_Id='+localStorage.getItem('countryId')+'&language_Id='+localStorage.getItem('languageId')+'&userId='+_userId;        

            PostData(_urlData,'','GET').then((result) => {
                let responseJson = result;
                if(responseJson.success === true)
                {
                    
                }
            }); 
        }
        return _rtVal;       
    }

    else if(_key == 'FirstTimeImport')
    {
        if(cartCount > 0)
        {
            let _itemIds = [];
            irisCart.items.map((products,index) => {    
                _itemIds.push({'product_Id':products.product_Id,'lens_Id':products.lens_Id,'lens_discountPrice':products.options.afterDiscount,'lens_izPrice':products.options.salePrice,'product_izPrice':products.salePrice,'product_discountPrice':products.afterDiscount,'count':products.count,'commonArray':products});
            })                       

            const dataSend = JSON.stringify({
                userId: _userId,
                countryId: irisCart.countryId,
                currencyCode: irisCart.currencyCode,
                languageId: irisCart.languageId,
                itemId: _itemIds
            });

            PostData(global.userCartImportFirstTime, dataSend,'POST').then((result) => {
                let responseJson = result;
                return(responseJson.success);
            });
        }
        return _rtVal;
    }
    
    else if(_key == 'couponApplyNow'){
        localStorage.setItem('irisCouponUse', JSON.stringify(PostData));
        return _rtVal;
    }

    else if(_key == 'setGlobalCountry'){
        let _countryData = global.userDefaultCountry;
        let irisCountrySession = localStorage.getItem('irisCountrySession');
        PostData(_countryData,'','GET').then((result) => {
            let setDefault = result.response[0];
            if(irisCountrySession == undefined || irisCountrySession == null)
            {
                irisCountrySession = {}; 
                var obj = {};

                if(setDefault.language[0].lang == 'en'){
                    obj.lang = setDefault.language[0].lang;
                    obj.language_Ids = setDefault.language[0].language_Id;
                }
                else{
                    obj.lang = setDefault.language[1].lang;
                    obj.language_Ids = setDefault.language[1].language_Id;
                }
                
                obj.country_Iso = setDefault.country_Iso;
                obj.currencyCode = setDefault.country_Currency;
                obj.country_Ids = setDefault.country_Id;
                obj.icon = setDefault.image;
                irisCountrySession = (obj);
                localStorage.setItem('irisCountrySession', JSON.stringify(irisCountrySession));
            }
            return _rtVal;
        });
    }

    
}

