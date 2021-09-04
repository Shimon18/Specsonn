import React from 'react';
import Footer from '../containers/Footer';
import {PostData} from '../service/postData';
import {userCartManage} from '../_commonFunction/userIrisCart';
import { Helmet } from 'react-helmet';

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

let hideCartDiv = 'hiddenData';
let hideEmptyDiv = '';

let irisUserSession = localStorage.getItem('irisUserSession');
//let _userId = 0;
let _checkoutPageLink = global.BASE_URL+'checkout-login';
if(irisUserSession === undefined || irisUserSession === null)
{
    //_userId = 0;
}
else{
    irisUserSession = JSON.parse(irisUserSession);
    //_userId = irisUserSession.user_Id ? irisUserSession.user_Id : '0';
    _checkoutPageLink = global.BASE_URL+'checkout-shipping?guestUser=0991574836'+irisUserSession.user_Id;
}

export default class cart extends React.Component
{
    constructor(props){
        super(props);
        this.state = {
            irisCartItems:[],
            isLoaded:false,
            cartCount:0
        }
    }

    componentDidMount() {
        let irisCart = localStorage.getItem('irisCart');
        let cartCount = 0;
        if(irisCart == undefined || irisCart == null)
        {
            //irisCart = JSON.parse(irisCart);
            //cartCount = irisCart.items.length;
        }
        else{
            irisCart = JSON.parse(irisCart);
            cartCount = irisCart.items.length;
        }
        
        let _result = userCartManage(localStorage,PostData,sessionStorage,'Export');
        
        document.getElementById('counterCount').innerHTML = cartCount;
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
    }

    decrementItemsCart = (e) => {
        let itemArry = this.state.irisCartItems;
        //let irisCartList = localStorage.getItem('irisCart');
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
        //let irisCartList = localStorage.getItem('irisCart');
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

    render() {
        
        let irisShow = '';
        let cartTotal = 0.00;
        let cartCountNum = 0;
        if(this.state.cartCount == 0)
        {
            hideCartDiv = 'hiddenData';
            hideEmptyDiv = '';
        }
        //console.log(JSON.stringify(this.state.irisCartItems));
        if(this.state.isLoaded === true  && this.state.cartCount > 0){            
            hideCartDiv = '';
            hideEmptyDiv = 'hiddenData';
            irisShow = this.state.irisCartItems.items.map((products,index) => {
                cartCountNum++;
                //console.log(products);

                let _frameAmount = products.afterDiscount;
                let _lensAmount = products.options.afterDiscount ? products.options.afterDiscount : 0;
                let _lensName = products.options.name ? products.options.name : '';
                let _itemTotal = products.amount.total;// * products.count
                cartTotal = cartTotal + _itemTotal;


                let slugType = products.amount.slug;

                let prTitle = _prlTxt.productprice;
                if(slugType  == 'IZCT-EG')
                {
                    prTitle = _prlTxt.frameprice;
                }

                let _lenNotApp = 'hiddenData';
                let _lenNotApp_PW = 'hiddenData';

                let _spW = '0';
                let _cyW = '0';
                let _axW = '0';
                let _isAll = '';
                
                let _pwEye = _prlTxt.powerspec;
                if(_lensAmount  > 0)
                {
                    _lenNotApp = '';
                }                
                else if(products.power_option == 'Right' || products.power_option == 'Left' || products.power_option == 'Both'){
                    _lenNotApp_PW = '';
                    _spW = (products.Power.spherical_power) ? products.Power.spherical_power : 0;
                    _cyW = (products.Power.cylinder_power) ? products.Power.cylinder_power : 0;
                    _axW = (products.Power.axis_power) ? products.Power.axis_power : 0;

                    if(products.power_option !== 'Both'){
                        _pwEye = products.power_option+' Eye';
                    }
                    _isAll = 'SP : '+_spW;
                    if(products.Power.cylinderPower > 0){
                        _isAll = _isAll+'| CY : '+_cyW+' | AX : '+_axW;
                    }
                }


                return(
                    <div className="Cart_items_container">
                    <div className="row my-3" key={index}>
                        <div className="col-5 col-lg-3 p-0">
                            <div className="iris_cart_modal_img">
                                <img src={products.product_image} alt="" title="" />
                            </div>
                        </div>
                        <div className="col-7 col-lg-4 Desktop_bottom_border">
                            <div><span className="iris_cart_title">{products.product_Name}</span>
                            </div>
                            <div className="input-group iris_cart_grp">
                                <span className="input-group-btn">
                                    <button type="button" className="quantity-left-minus btn btn-default btn-number"  data-type="minus" data-field="" onClick={this.decrementItemsCart.bind(this, index)}><i className="fas fa-minus"></i></button>
                                </span>
                                <input type="text" id="quantity" name="quantity" className="form-control input-number" value={products.count} min="1" max="100" readOnly={true}/>
                                <span className="input-group-btn">
                                    <button type="button" className="quantity-right-plus btn btn-default btn-number" data-type="plus" data-field="" onClick={this.incrementItemsCart.bind(this, index)}><i className="fas fa-plus"></i></button>
                                </span>
                            </div>
                            <span className="iris_txt_Style_5A action-delete" onClick={this.removeItemsCart.bind(this, index)}><i className="far fa-trash-alt"></i></span>
                        </div>
                        <div className="col-12 col-lg-5 iris_product_amounttab mt-0 Desktop_bottom_border">
                            <div className="row">
                                <div className="col-6">
                                <span className="iris_txt_Style_5 text_theme">{prTitle}</span>
                                </div>
                                <div className="col-6 text-right">
                                <span className="iris_txt_Style_6 ">{global.currencyCode} {_frameAmount}</span>
                                </div>
                            </div>
                            <div className="row" id={_lenNotApp}>
                                <div className="col-6">
                                <span className="iris_txt_Style_5 text_theme">{_prlTxt.lenspack}</span>                            
                                </div>
                                <div className="col-6 text-right">
                                <span className="iris_txt_Style_6">{global.currencyCode} {_lensAmount}</span>
                                <span className="iris_txt_Style_5" id="gotLens"><b>{_lensName}</b></span>                                </div>
                            </div>
                        </div>
                        
                            {/* <div  id={_lenNotApp} className="Incart_lense_package">
                                <span className="iris_txt_Style_5A">+</span>
                            </div>   */}
                            {/* <div className="col-12 col-lg-5 iris_product_amounttab mt-0">
                            <div className="row" id={_lenNotApp}>
                            <div className="col-6">
                            <span className="iris_txt_Style_5">{_prlTxt.lenspack}</span>                            
                            </div>
                            <div className="col-6">
                            <span className="iris_txt_Style_6">{global.currencyCode} {_lensAmount}</span>
                                <span className="iris_txt_Style_5" id="gotLens"><b>{_lensName}</b></span>
                            </div> */}

                            {/* <div id={_lenNotApp}>
                                <span className="iris_txt_Style_5">{_prlTxt.lenspack}</span>                            
                                <span className="iris_txt_Style_6">{global.currencyCode} {_lensAmount}</span>
                                <span className="iris_txt_Style_5" id="gotLens"><b>{_lensName}</b></span>
                            </div> */}
                            {/* </div>
                            </div> */}
                            <div id={_lenNotApp_PW}>
                                <span className="iris_txt_Style_5">{_pwEye}</span>                            
                                <span className="iris_txt_Style_5" id="gotLens"><b>{_isAll}</b></span>
                            </div> 
                        <div className="col-12 iris_product_amounttab">
                           <div className="row">
                                <div className="col-6">
                                  <span className="iris_txt_Style_5">{_prlTxt.total}</span>
                               </div>
                               <div className="col-6 text-right">
                               <span className="iris_txt_Style_6">{global.currencyCode} {_itemTotal}</span>
                               </div>
                        </div>
                        </div>
                    </div>
                    {/* <tr key={index}> 
                        <td width="25%">
                            <span className="iris_cart_title">{products.product_Name}</span>
                            <div className="input-group iris_cart_grp">
                                <span className="input-group-btn">
                                    <button type="button" className="quantity-left-minus btn btn-default btn-number"  data-type="minus" data-field="" onClick={this.decrementItemsCart.bind(this, index)}><i className="fas fa-minus"></i></button>
                                </span>
                                <input type="text" id="quantity" name="quantity" className="form-control input-number" value={products.count} min="1" max="100" readOnly={true}/>
                                <span className="input-group-btn">
                                    <button type="button" className="quantity-right-plus btn btn-default btn-number" data-type="plus" data-field="" onClick={this.incrementItemsCart.bind(this, index)}><i className="fas fa-plus"></i></button>
                                </span>
                            </div>
                        </td>
                        <td width="24%">
                            <div className="iris_cart_modal_img">
                                <img src={products.product_image} alt="" title="" />
                            </div>
                        </td>
                        <td width="14%">
                            <span className="iris_txt_Style_5">{prTitle}</span>
                            <span className="iris_txt_Style_6">{global.currencyCode} {_frameAmount}</span>
                        </td>
                        <td width="3%">
                            <div  id={_lenNotApp}>
                                <span className="iris_txt_Style_5A">+</span>
                            </div>                            
                        </td>
                        <td width="17%">
                            <div id={_lenNotApp}>
                                <span className="iris_txt_Style_5">{_prlTxt.lenspack}</span>                            
                                <span className="iris_txt_Style_6">{global.currencyCode} {_lensAmount}</span>
                                <span className="iris_txt_Style_5" id="gotLens"><b>{_lensName}</b></span>
                            </div>
                            <div id={_lenNotApp_PW}>
                                <span className="iris_txt_Style_5">{_pwEye}</span>                            
                                <span className="iris_txt_Style_5" id="gotLens"><b>{_isAll}</b></span>
                            </div>                            
                        </td>
                        <td width="3%">
                            <span className="iris_txt_Style_5A">=</span>
                        </td>
                        <td width="14%">
                            <span className="iris_txt_Style_5">{_prlTxt.total}</span>
                            <span className="iris_txt_Style_6">{global.currencyCode} {_itemTotal}</span>
                        </td>
                        <td width="3%">
                            <span className="iris_txt_Style_5A action-delete" onClick={this.removeItemsCart.bind(this, index)}><i className="far fa-trash-alt"></i></span>
                        </td>
                    </tr>    */}
                    </div>             
                )
            })
        }        

        return (
            <React.Fragment>
                <Helmet>
                    <title>IRIS Cart | IRIS Boutiq</title>
                    <meta name="description" content="IRIS Cart | IRIS Boutiq"/>
                    <meta name="keywords" content="IRIS Cart | IRIS Boutiq" />
                </Helmet>
            <section className="iris_addtoCart">
                <div className="container p-0" id={hideCartDiv}>
                    <div className="row">
                        <h1 className="col-sm-12 iris_txt_style_8">{_prlTxt.shoppingcart} ({cartCountNum} {_prlTxt.items})</h1>
                    </div>    
                    <div className="cart_layout_responsive">                
                    <div className="iris_addcart_content_1">
                        <div className="row">
                            <div className="col-4 ">

                            </div>
                        </div>
                        <table>
                            <tbody>
                                <tr></tr>
                                {
                                    irisShow ? irisShow : null
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="iris_cartbtn">
                    
                        <div className="float-left">
                            <p>{_prlTxt.ordertotal}:</p>
                            <p> {global.currencyCode} {cartTotal}</p>
                        </div>
                        <div className="Cart_btn_div">
                          <div className="cart_buttons">
                            <a title="Buy Now" class="title" href={global.BASE_URL}><span>{_prlTxt.continueshopping}</span> <i class="fas fa-shopping-cart"></i></a>
                          </div>
                          <div className="cart_buttons">
                            <a href={_checkoutPageLink} className="responsive_float_right">{_prlTxt.procheckout}</a>
                            </div>
                        </div>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>

                <div className="emptyContainer container" id={hideEmptyDiv}>
                    <div className="cart-slide-empty">
                        <span className="cart-slide-message">{_prlTxt.shoppingcartempty_a}</span>
                        <div>{_prlTxt.shoppingcartempty_b}</div>
                        <div className="cart-slide-footer">
                            <a title="Buy Now" className="title" href={global.BASE_URL}><span>{_prlTxt.continueshopping}</span> <i className="fas fa-shopping-cart"></i></a>
                        </div>
                        <div className="cart-slide-links row-fluid f18" id="hiddenData">
                            <div className="span2 bold"> {_prlTxt.searchfor}:</div>
                            <div className="span3 color-yellow"><a href={global.BASE_URL}>{_prlTxt.eyeglass}</a></div>
                            <div className="span3 color-yellow"><a href={global.BASE_URL}>{_prlTxt.Sunglasses}</a></div>
                            <div className="span3 color-yellow"><a href={global.BASE_URL}>{_prlTxt.contactlens}</a></div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            </React.Fragment>
        );
    }
}