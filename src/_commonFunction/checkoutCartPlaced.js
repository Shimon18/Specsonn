import React from 'react';
import {PostData} from '../service/postData';
import {userCartManage} from '../_commonFunction/userIrisCart';

// Lang Json Start
import enLang from '../translations/en.json';
import arLang from '../translations/ar.json';

let irisCountrySession = localStorage.getItem('irisCountrySession');
if(irisCountrySession !== undefined || irisCountrySession !== null)
{
    irisCountrySession = JSON.parse(irisCountrySession);
    global.country_Iso = irisCountrySession ? irisCountrySession.country_Iso : global.country_Iso;
    global.currencyCode = irisCountrySession ? irisCountrySession.currencyCode : global.currencyCode;
    global.country_Ids = irisCountrySession ? irisCountrySession.country_Ids : global.country_Ids;
    global.lang = irisCountrySession ? irisCountrySession.lang : global.lang;
    global.language_Ids = irisCountrySession ? irisCountrySession.language_Ids : global.language_Ids;
    global.icon = irisCountrySession ? irisCountrySession.icon : global.icon;
}

let _prlTxt = '';
if(global.lang == 'en'){
    _prlTxt = enLang;
}
else{
    _prlTxt = arLang;
}
// Lang Json End
const GrandAmount = require('../_commonFunction/cartTotal');
let hideCartDiv = 'hiddenData';
let hideEmptyDiv = '';

let irisUserSession = localStorage.getItem('irisUserSession');
let referalDiscount = 0;
if(irisUserSession === undefined || irisUserSession === null)
{
    referalDiscount = 0;
}
else{
    irisUserSession = JSON.parse(irisUserSession);
    referalDiscount = 0;//irisUserSession.referal_discount ? irisUserSession.referal_discount : '0';
}
let _grandTotal = 0;
export default class IrisCheckoutCartPlace extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            irisCartItems:[],
            isLoaded:false,
            cartCount:0,
            shipping:0,
            orderCount : 0,
        }
    }

    componentDidMount(){  
        localStorage.removeItem('irisCouponUse');

        let irisCart = localStorage.getItem('irisCart');        
        irisCart = JSON.parse(irisCart);
        
        let cartCount = 0;
        if(irisCart == undefined || irisCart == null)
        {
            //irisCart = JSON.parse(irisCart);
            //cartCount = irisCart.items.length;
        }
        else{
            //irisCart = JSON.parse(irisCart);
            cartCount = irisCart.items.length;
        }
        this.setState({irisCartItems:irisCart,isLoaded:true,cartCount:cartCount});
    }

    removeItemsCart = (e) => {
        let itemArry = this.state.irisCartItems;

        let _getProId = itemArry.items.filter((rmItems,index) => index == e);

        let _obj = {};
        _obj.productId = _getProId[0].product_Id;
        _obj.count = _getProId[0].count;
        _obj.lens_Id = _getProId[0].lens_Id;
        
        userCartManage(localStorage,PostData,_obj,'RemoveCartItem');

        let _CartList = itemArry.items.filter((rmItems,index) => index !== e);
        itemArry.items = (_CartList);

        let LS_irisCartList = JSON.parse(localStorage.getItem('irisCart'));
        LS_irisCartList.items = (_CartList);
        localStorage.setItem('irisCart', JSON.stringify(LS_irisCartList)); 
        
        let cartCount = LS_irisCartList.items.length;
        document.getElementById('counterCount').innerHTML = cartCount;
        this.setState({irisCartItems:LS_irisCartList,cartCount:cartCount});
        document.getElementById('counterCount').innerHTML = LS_irisCartList.items.length;
    }

    decrementItemsCart = (e) => {
        let itemArry = this.state.irisCartItems;
        let _proIndex = itemArry.items[e];        
        if(_proIndex.lens_Id === 0)
        {
            if(_proIndex.count > 1)
            {
                _proIndex.count = _proIndex.count - 1;
                let _newAmount = _proIndex.amount.subTotal;
                let _newCount = _proIndex.count;

                _proIndex.amount.total = (_newAmount * _newCount);
                localStorage.setItem('irisCart', JSON.stringify(itemArry));                
            }
        }
        else
        {
            let _CartList = itemArry.items.filter((rmItems,index) => index !== e);
            itemArry.items = (_CartList);
            
            let LS_irisCartList = JSON.parse(localStorage.getItem('irisCart'));
            LS_irisCartList.items = (_CartList);
            localStorage.setItem('irisCart', JSON.stringify(LS_irisCartList));
        }
        
        userCartManage(localStorage,PostData,sessionStorage,'Import');

        let cartCount = itemArry.items.length;
        document.getElementById('counterCount').innerHTML = cartCount;
        this.setState({irisCartItems:itemArry,cartCount:cartCount});
    }

    incrementItemsCart = (e) => {
        let itemArry = this.state.irisCartItems;
        let _proIndex = itemArry.items[e];        
        if(_proIndex.lens_Id === 0){            
            _proIndex.count = _proIndex.count + 1;
            let _newAmount = _proIndex.amount.subTotal;
            let _newCount = _proIndex.count;

            _proIndex.amount.total = (_newAmount * _newCount);
            localStorage.setItem('irisCart', JSON.stringify(itemArry));
        }
        else{
            
            itemArry.items.push(_proIndex);
            localStorage.setItem('irisCart', JSON.stringify(itemArry));
        }

        userCartManage(localStorage,PostData,sessionStorage,'Import');

        let cartCount = itemArry.items.length;
        document.getElementById('counterCount').innerHTML = cartCount;
        this.setState({irisCartItems:itemArry,cartCount:cartCount});
    }

    render(){ 
        let couponSession = localStorage.getItem('irisCouponUse');        
        let couponDiscount = 0;
        let _ratio = 'Amount';
        let _RD = referalDiscount;

        if(couponSession === undefined || couponSession === null)
        {
            couponDiscount = 0;
        }
        else{
            couponSession = JSON.parse(couponSession);
            let _ratio = couponSession[0].isRatio;
            couponDiscount = couponSession[0].discount; 
            
            // Get Total
            if(couponSession[0].isRatio == "Percentage"){
                _grandTotal = GrandAmount.getCartTotal();
                couponDiscount = _grandTotal * parseFloat(couponSession[0].discount) / 100;
            }  
            // End Total                     
        }

        
        let irisShow = '';
        let cartTotal = 0.00;
        let cartCountNum = 0;
        if(this.state.cartCount == 0)
        {
            hideCartDiv = 'hiddenData';
            hideEmptyDiv = '';
        }

        if(this.state.isLoaded === true && this.state.cartCount > 0){     
            hideCartDiv = '';
            hideEmptyDiv = 'hiddenData';
            

            irisShow = this.state.irisCartItems.items.map((products,index) => {
                cartCountNum++;
                let _itemTotal = products.amount.total;// * products.count;
                cartTotal = cartTotal + _itemTotal;
                return(
                    <div key={index} className="iris_cart_chekout_1">
                        <div className="iris_cart_chekout_1A">
                            <img src={products.product_image} alt={products.product_Name} title={products.product_Name} />
                        </div>
                        <div className="iris_cart_chekout_1B">
                            <h6 className="iris_cc_ttl">{products.product_Name}</h6>
                            <div className="input-group iris_cart_grp">
                                
                                <input type="text" readOnly={true} id={"quantity_"+index} name="quantity" className="form-control input-number" defaultValue={products.count} min="1" max="100" />
                                
                            </div>
                            <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                                <tbody>
                                    <tr>
                                        <td width="60%">
                                            <p className="iris_total_txt">{_prlTxt.total}</p>
                                            <h5 className="iris_cc_price">{global.currencyCode} {_itemTotal}</h5></td>
                                        <td width="40%">
                                            
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="clearfix"></div>
                    </div>                                    
                )
            })
        }

        if(couponDiscount >= cartTotal){
            couponDiscount = '0';
        }
        
        
        return(
            <div className="container">
                <div className="iris_checkout_amount" id={hideCartDiv}>
                    <span>{_prlTxt.shoppingcart} ({cartCountNum} {_prlTxt.items})</span>
                    {
                        irisShow ? irisShow : null
                    }
                    
                    <span className="iris_check_border"></span>
                    
                    <div className="iris_check_amounts">
                        <table width="100%" cellPadding="0" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td width="55%">
                                    <p><b>{_prlTxt.ordertotal}</b></p>
                                    </td>
                                    <td width="10%">
                                    :
                                    </td>
                                    <td width="35%">
                                    <p>{global.currencyCode} <span>{cartTotal}</span></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="55%">
                                    <p><b>{_prlTxt.shippingcharge}</b></p>
                                    </td>
                                    <td width="10%">
                                    :
                                    </td>
                                    <td width="35%">
                                    <p>{global.currencyCode} <span>{this.state.shipping}</span></p>
                                    </td>
                                </tr>
                                <tr style={{display:'none'}}>
                                    <td width="55%">
                                    <p><b>Referral Discount</b></p>
                                    </td>
                                    <td width="10%">
                                    :
                                    </td>
                                    <td width="35%">
                                    <p>{global.currencyCode} <span>{_RD}</span></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="55%">
                                    <p><b>{_prlTxt.couponcharge}</b></p>
                                    </td>
                                    <td width="10%">
                                    :
                                    </td>
                                    <td width="35%">
                                    <p>{global.currencyCode} <span>{couponDiscount}</span></p>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td width="55%">
                                    <p><b>{_prlTxt.netpayable}</b></p>
                                    </td>
                                    <td width="10%">
                                    :
                                    </td>
                                    <td width="35%">
                                    <p>{global.currencyCode} <span>{parseFloat(cartTotal) - parseFloat(_RD) - parseFloat(couponDiscount)}</span></p>
                                    </td>
                                </tr>
                                <tr><td colSpan="3" className="taxessTxt">{_prlTxt.inclusive}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Shopping Cart Section*/}
                    <div className="iris_presc_btn CommentTxt">{_prlTxt.addpowerafter}</div>
                </div>

                <div className="emptyContainer container" style={{border: '1px #dddsolid'}} id={hideEmptyDiv}>
                <div className="cart-slide-empty">
                    <span className="cart-slide-message">{_prlTxt.shoppingcartempty_a}</span>
                    <div>{_prlTxt.shoppingcartempty_b}</div>
                    <div className="cart-slide-footer">
                        <a title="Buy Now" className="title" href={global.BASE_URL}><span>{_prlTxt.continueshopping}</span> <i className="fas fa-shopping-cart"></i></a>
                    </div>
                    <div className="cart-slide-links row-fluid f18" id="hiddenData">
                        <div className="span2 bold"> {_prlTxt.searchfor}</div>
                        <div className="span3 color-yellow"><a href={global.BASE_URL}>{_prlTxt.eyeglass}</a></div>
                        <div className="span3 color-yellow"><a href={global.BASE_URL}>{_prlTxt.sunglass}</a></div>
                        <div className="span3 color-yellow"><a href={global.BASE_URL}>{_prlTxt.contactlens}</a></div>
                    </div>
                </div>
            </div>
            </div>    
        )
    }
}