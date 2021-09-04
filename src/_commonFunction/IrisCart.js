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

let hideCartDiv = 'hiddenData';
let hideEmptyDiv = '';

export default class IrisCart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            irisCartItems:[],
            isLoaded:false,
            cartCount:0
        }
    }

    componentDidMount(){  
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
        //document.getElementById('counterCount').innerHTML = LS_irisCartList.items.length;
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
            _proIndex.count = parseInt(_proIndex.count) + parseInt(1);

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
        let irisShow = '';
        let cartTotal = 0.00;
        let cartCountNum = 0;
        
        if(this.state.cartCount == 0)
        {
            hideCartDiv = 'hiddenData';
            hideEmptyDiv = '';
        }

        if(this.state.isLoaded === true && this.state.cartCount > 0)
        {       
            hideCartDiv = '';
            hideEmptyDiv = 'hiddenData';     
            irisShow = this.state.irisCartItems.items.map((products,index) => {
                //console.log(products);
                let _frameAmount = products.afterDiscount;
                let _lensAmount = products.options.afterDiscount ? products.options.afterDiscount : 0;
                let _lensName = products.options.name ? products.options.name : '';
                cartCountNum++;
                let _itemTotal = products.amount.total;// * products.count;
                cartTotal = cartTotal + _itemTotal;

                let slugType = products.amount.slug;

                let prTitle = 'Product Price';
                if(slugType  == 'IZCT-EG')
                {
                    prTitle = 'Frame Price';
                }

                let _lenNotApp = 'hiddenData';
                let _lenNotApp_PW = 'hiddenData';

                let _spW = '0';
                let _cyW = '0';
                let _axW = '0';
                let _isAll = '';
                let _pwEye = 'Power Specification';
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
                    <tr key={index}> 
                        <td width="25%">
                            <span className="iris_cart_title">{products.product_Name}</span>
                            <div className="input-group iris_cart_grp width_100">
                                <span className="input-group-btn">
                                    <button type="button" className="quantity-left-minus btn btn-default btn-number"  data-type="minus" data-field="" onClick={this.decrementItemsCart.bind(this, index)}><i className="fas fa-minus"></i></button>
                                </span>
                                <input type="text" id={"quantity_"+index} name="quantity" className="quantity form-control input-number" value={products.count} min="1" max="100" readOnly={true}/>
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
                    </tr>                
                )
            })
        }        
        
        return(
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{_prlTxt.shoppingcart} ({cartCountNum} {_prlTxt.items})</h5>                        
                        <span className="close_Modal_Pop" onClick={this.props.closeModalHandler}>
                            <img src={global.BASE_URL + "assets/img/cross_lens.svg"} alt="close lenses"/>
                        </span> 
                    </div>
                    <div id={hideCartDiv}>
                        <div className="modal-body row iris_addcart_content_1">
                            <div className="col-sm-12">
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <tbody>
                                            {
                                                irisShow ? irisShow : null
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="table-responsive fixedExtra DesktopView">
                                <table className="table table-striped">
                                    <tbody>
                                        <tr>
                                            <td colSpan="8" className="iris_tr_td">
                                                <table width="100%">
                                                    <tbody>
                                                        <tr>
                                                            <td width="25%">
                                                                <a href="#GNDR" onClick={e => e.preventDefault()} className="iris_btn_style_1">Customer Also Bought</a>
                                                            </td>
                                                            <td width="20%">
                                                                <div className="iris_eyeglass_bag">
                                                                    <img src={global.BASE_URL + "assets/img/eyeglass-bag.png"} alt="" title="" />
                                                                </div>
                                                            </td>
                                                            <td width="35%">
                                                                <div className="iris_eyeglass_bag_txt">
                                                                    <p>
                                                                        Orsons special leather eyeglass pouch with 2 year warranty
                                                                    </p>
                                                                    <span>
                                                                        {global.currencyCode} 20
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td width="20%">
                                                                <a href="#GNDR" onClick={e => e.preventDefault()} className="iris_btn_style_2">Add To Cart</a>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <div className="clearfix"></div>
                            <div className="float-left">
                                <p>{_prlTxt.ordertotal}: <span>{global.currencyCode} {cartTotal}</span></p>
                            </div>
                            <button className="btn btn-default float-right">
                                <a href={_checkoutPageLink}>{_prlTxt.procheckout}</a>
                            </button>                    
                        </div>
                    </div>
                    
                    <div id={hideEmptyDiv}>
                        <div className="emptyContainer container" id={hideEmptyDiv}>
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
                </div>
            </div>
        )
    }
}