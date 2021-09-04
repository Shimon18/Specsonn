import React from 'react';
import IrisCheckoutCartPlace from '../_commonFunction/checkoutCartPlaced';
import { Helmet } from 'react-helmet';
import Modal from 'react-modal';
import { toast } from "react-toastify";
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

const publicIp = require('public-ip');

let _customerIp = '';
(async () => {
    _customerIp = (await publicIp.v4());
    //console.log(await publicIp.v6());
    //=> 'fe80::200:f8ff:fe21:67cf'
})();

const min = 1;
const max = 999999;
let randNum = 0;//min + Math.random() * (max - min);

let irisCart = localStorage.getItem('irisCart');        
irisCart = JSON.parse(irisCart);

let cartCount = 0;
if(irisCart == undefined || irisCart == null)
{
}
else{
    cartCount = irisCart.items ? irisCart.items.length : 0;
}

let irisUserSession = localStorage.getItem('irisUserSession');
let _userId = 0;
let _listingAddr = {};
      
if(irisUserSession === undefined || irisUserSession === null)
{
    _userId = 0;
}
else{
    irisUserSession = JSON.parse(irisUserSession);
    _userId = irisUserSession.user_Id ? irisUserSession.user_Id : '0';
}

let _loader = 'global_loader_wait hiddenData';
let _aplyRemove = "hiddenData";
let _aplyClick = "";
let _getPaymentReference = '';
let _paymentTransaction = {'transaction_id':'0'};

export default class checkoutPayment extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            paymentVia : 'CASH',
            isLoaded : false,
            irisCartItems:[],
            irisUserAddr:{},
            cartCount:0,
            userSession:{},
            userIds : '0',
            couponShown: false,
            isDisabled: true,
            couponCode: '',
            couponMsg:null,
            couponStatus:null,
            couponDiscount:'0',
            isLoadingFinal:false
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        switch (name) {
        case 'couponCode': 
            let _disKey = value.length > 2 ? false : true;
            this.setState({couponCode:value,isDisabled:_disKey});
        }
    }

    componentDidMount(){        
        if(cartCount == 0){
            toast.warning('Your shopping cart is empty. Shop for products and add items to the cart.');
            setTimeout(() => {
                window.location.href = global.BASE_URL;
            }, 3000);            
            return;
        }
        const paramerters = new URLSearchParams(this.props.location.search);
        _getPaymentReference = paramerters.get('payment_reference') ? paramerters.get('payment_reference') : '0';

        if(_getPaymentReference == 0){
            localStorage.removeItem('irisCouponUse');            
        }
        randNum = Math.floor(min + Math.random() * (max - min));
                
        if(_userId == 0)
        {
            window.location.href = global.BASE_URL+'checkout-login';
            return;
        }

        let _sendStatus = global.userCheckoutIndicate+'/'+_userId+'/PAYMENT';
        PostData(_sendStatus,'','GET').then((result) => {

            let _urlData = global.userShippingDefaultAddress+'?user_Id='+_userId;
            PostData(_urlData,'','GET').then((result) => {
                let responseJson = result;
                if(responseJson.success === false)
                {
                    toast.error('Shipping address details not found.');
                    window.location.href = global.BASE_URL+'checkout-shipping?guestUser=0991574836'+_userId;
                }
                else
                {
                    //console.log(irisCart);
                    _listingAddr = responseJson.response[0];
                    this.setState({irisCartItems:irisCart,irisUserAddr:_listingAddr,userSession:irisUserSession,userIds:_userId,isLoaded:true,cartCount:cartCount});
                    
                    if(_getPaymentReference != 0)
                    {
                        let buff = new Buffer(_getPaymentReference, 'base64');
                        let paymentResponse = buff.toString('ascii');
                        _paymentTransaction = JSON.parse(paymentResponse);
                        
                        if(_paymentTransaction.transaction_id > 0){                        
                            this.setState({isLoadingFinal: true,paymentVia:'CARD'});
                            this.placeOrderCheckout();
                        }
                        else{                        
                            toast.error(_paymentTransaction.result);
                        }
                    }    
                }
            }) 
        });    
    }

    activePymentModeNow(e)
    {
        this.setState({
            paymentVia: (e)
        });
    }

    placeOrderCheckout= (event) =>{
        this.setState({isLoadingFinal: true});
        const postData = JSON.stringify({
            language_Id : global.language_Ids,
            userArray: this.state.userSession,
            cartArray: this.state.irisCartItems,
            shippingArray: this.state.irisUserAddr,
            paymentVia: this.state.paymentVia,
            currencyCode : global.currencyCode,
            tranArray:_paymentTransaction,
            country_Ids : global.country_Ids,
            couponArray:{'code':this.state.couponCode,'discount':this.state.couponDiscount}
        });
        
        PostData(global.placeOrderCheckout, postData,'POST').then((result) => {
            if(result.success === true)
            {
                let _sendStatus = global.userCheckoutIndicate+'/'+_userId+'/NA';
                PostData(_sendStatus,'','GET').then((result) => {
                    localStorage.removeItem('irisCart');                
                    let _result = userCartManage(localStorage,PostData,'','EmptyCartItem');
                    if(_result === '-->Gotoo')
                    {
                        toast.success('Order placed successfully.');
                        setTimeout(() => {
                            window.location.href = global.BASE_URL+'customer-orders';
                        }, 2500);                    
                    }
                    return;
                });
            }
            else
            {
                this.setState({isLoadingFinal: false});
                toast.error(result.message);
                return;
            }
        });
        return;
    }

    removeCouponApply = (event) => {
        localStorage.removeItem('irisCouponUse');
        _aplyRemove = 'hiddenData';
        _aplyClick = '';
        this.setState({
            couponStatus:true,
            couponMsg:'',
            couponShown: true,
            isDisabled: true,
            couponCode: '',
        });
    }

    clickCouponApply = (event) => {
        let _msg = 'Promo code is not valid: '+this.state.couponCode;
        let _couponStatus = false;
        let _urlData = global.checkCouponVaild+'?user_Id='+_userId+'&offerCode='+this.state.couponCode;
        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            
            if(responseJson.success == false){
                _msg = responseJson.message+' '+this.state.couponCode;
                this.setState({
                    couponStatus:_couponStatus,
                    couponMsg:_msg
                });
            }
            else{
                _aplyRemove = '';
                _aplyClick = 'hiddenData';
                _couponStatus = true;
                _msg = 'Promo code is applied.';                
                let _arryCoup = [{'coupon':this.state.couponCode,'discount':responseJson.response[0].discount,'isRatio':responseJson.response[0].isRatio,'isBogo':responseJson.response[0].isBogo,'msgBogo':responseJson.response[0].msgBogo}];

                let _result = userCartManage(localStorage,_arryCoup,'','couponApplyNow');
                if(_result == '-->Gotoo'){
                    this.setState({
                        couponStatus:_couponStatus,
                        couponMsg:_msg+' '+responseJson.response[0].msgBogo,
                        couponDiscount:responseJson.response[0].discount
                    });
                }
            }
        });
    }    

    createPayPage(result, cardPaymentDialog){
        if(result.response_code == 4012){            
            this.setState({cardPaymentUrl: result.payment_url}, () => {
                window.location.href = result.payment_url;
            });
        }else{
            this.setState({isLoadingFinal: false});
            toast.error(JSON.stringify(result));
        }
    }

    async creditCardPaymentRequest(cardPaymentDialog) {
        let shippingArray = this.state.irisUserAddr;
        let cartTotal = 0;
        let couponDisocunt = this.state.couponDiscount;
        let cartCountNum = 0;
        let _productName = '';
        let _productLabel = '';
        
        this.state.irisCartItems.items.map((products,index) => {
            cartCountNum++;
            if(cartCountNum == 1){
                _productName = products.product_Name;
                _productLabel = products.product_Name;
            }
            else{
                _productLabel = _productLabel+'|'+products.product_Name;
            }
            let _itemTotal = parseFloat(products.amount.total) * parseFloat(products.count);
            cartTotal = parseFloat(cartTotal) + parseFloat(_itemTotal);
        });

        let params = {
            'currency':global.currencyCode,//change this to the required currency
            'amount':parseFloat(cartTotal) - parseFloat(couponDisocunt),//change this to the required amount
            'site_url': global.BASE_URL,//change this to reflect your site
            'title':'Iris Order for '+_productName,//Change this to reflect your order title
            'quantity':1,//Quantity of the product
            'unit_price':parseFloat(cartTotal) - parseFloat(couponDisocunt),
            'products_per_title':_productLabel, //Change this to your products
            'return_url':global.API_URL+'paytabsCallback?source=web&server_url='+global.BASE_URL+'checkout-payment?guestUser=0991574836'+this.state.userIds,//This should be your callback url
            'cc_first_name': irisUserSession.firstName,//Customer First Name
            'cc_last_name': irisUserSession.lastName,//Customer Last Name
            'cc_phone_number':irisUserSession.userISD, //Country code
            'phone_number':shippingArray.user_phone, //Customer Phone
            'billing_address':shippingArray.user_address1, //Billing Address
            'city':shippingArray.user_city,//Billing City
            'state':shippingArray.user_state,//Billing State
            'postal_code':shippingArray.user_zipCode,//Postal Code
            'country':shippingArray.ISO3Code,//Iso 3 country code
            'email':shippingArray.user_emailId,//Customer Email
            'ip_customer':_customerIp,//Pass customer IP here
            'ip_merchant':_customerIp,//Change this to your server IP
            'address_shipping':shippingArray.user_address1,//Shipping Address
            'city_shipping':shippingArray.user_city,//Shipping City
            'state_shipping':shippingArray.user_state,//Shipping State
            'postal_code_shipping':shippingArray.user_zipCode,
            'country_shipping':shippingArray.ISO3Code,
            'other_charges':0,//Other chargs can be here
            'reference_no':randNum,//Pass the order id on your system for your reference
            'msg_lang':'en',//The language for the response
            'cms_with_version':'Nodejs Lib v1',//Feel free to change this
        };

        PostData(global.onlinePayment_createRequest, JSON.stringify(params),'POST').then((result) => {
            this.createPayPage(result, cardPaymentDialog);
        });
    }

    placeOrderOnline(e){        
        this.setState({isLoadingFinal: true});
        this.creditCardPaymentRequest('online Payment');
    }

    render(){
        //console.log(this.state.isLoadingFinal);
        if(this.state.isLoadingFinal == true){
            _loader = 'global_loader_wait';
        }
        else if(this.state.isLoadingFinal == false){
            _loader = 'global_loader_wait hiddenData';
        }

        let _hideCoup = 'hiddenData';
        let _hideColor = 'c-formgroup linkRedeem u-color--red';
        let _aplyColor = 'c-discount-code-input__button u-button u-button-reset u-fs14 u-fws u-dib -button-white';
        let _msgCoup = 'u-pt12 u-fs14 u-color--red-alt-2';
        

        if(this.state.isDisabled == false){
            _aplyColor = 'c-discount-code-input__button u-button u-button-reset u-fs14 u-fws u-dib -button-red';
        }

        if(this.state.couponStatus == true){
            _msgCoup = 'u-pt12 u-fs14 u-color--grey-alt-2';
        }

        if(this.state.couponShown == true){
            _hideCoup = '';
            _hideColor = 'c-formgroup linkRedeem u-color--dark-gray';            
        }
        return(
            <React.Fragment>
                <Helmet>
                    <title>Iris Checkout Process | IRIS Boutiq</title>
                    <meta name="description" content="Iris Checkout Process" />
                    <meta name="keywords" content="Iris Checkout Process" />
                </Helmet>
                {/* Checkout Login Section */}
                <section className="iris_checkout_container">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7 iris_checkout_left">
                                <div className="iris_check_titles">
                                    <ul>
                                        <li>
                                            <a href='#' onClick={e => e.preventDefault()}>
                                                <span><i className="fas fa-check-double" style={{color: 'green'}}></i></span>
                                                <p>{_prlTxt.emailogin}</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href={global.BASE_URL+'checkout-shipping?guestUser=0991574836'+this.state.userIds}>
                                                <span><i className="fas fa-check-double" style={{color: 'green'}}></i></span>
                                                <p>{_prlTxt.shippingadd}</p>
                                            </a>
                                        </li>
                                        <li className="active">
                                            <a href={global.BASE_URL+'checkout-payment'}>
                                                <span><i className="fas fa-check"></i></span>
                                                <p>{_prlTxt.payment}</p>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="iris_line"></div>
                                </div>

                                <div className="row iris_sa_coupon">
                                    <div className="col-lg-12">
                                        <p className={_hideColor} onClick={() => this.setState({ couponShown: !this.state.couponShown })}>{_prlTxt.redeemcoupontxt}</p>
                                        <span id={_hideCoup}>
                                            <div className="c-discount-code-input u-mt12 u-mbn18">
                                                <div className="c-formgroup -v2 c-discount-code-input__input u-dib">
                                                    <div className="c-field-container -empty -v2 -nolabel">
                                                        <input name="couponCode" type="text" id="formgroup-input-code" className="c-formgroup__field u-field -v2" placeholder="Like IRISCOUPONOFF" value={this.state.couponCode} onChange={this.handleChange}/>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={this.removeCouponApply.bind()} id={_aplyRemove} disabled={this.state.isDisabled} className={_aplyColor}>Remove</button>

                                                <button type="button" onClick={this.clickCouponApply.bind()} id={_aplyClick} className={_aplyColor} disabled={this.state.isDisabled}>Apply</button>
                                            </div>
                                            <span>
                                                <div className="c-formgroup-error -v2">
                                                    <div className="u-pt12 u-fs14 u-color--red-alt-2">
                                                        {this.state.couponMsg}
                                                    </div>
                                                </div>
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="row iris_sa_payment">
                                    <div className="col-lg-4">
                                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#settings" role="tab" aria-controls="settings" onClick={this.activePymentModeNow.bind(this, 'CASH')}> <i className="fas fa-check settingsChk"></i> {_prlTxt.cashdelivery}</a></li>

                                            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#online" role="tab" aria-controls="online" disabled={this.state.isLoadingFinal} onClick={this.activePymentModeNow.bind(this, 'CARD')}> <i className="fas fa-check settingsChk"></i> {_prlTxt.creditdebit}</a></li>                                            
                                        </ul>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="tab-content">
                                            <div className="tab-pane active" id="settings" role="tabpanel">
                                                <div className="iris_net_banking">
                                                    <form>
                                                        <p className="termCondtion">{_prlTxt.agreetoter} {global.BASE_NAME}<a href={global.BASE_URL+'term-condition'} target="_blank"> {_prlTxt.termcondition} </a></p>
                                                        <button disabled={this.state.isLoadingFinal} onClick={this.placeOrderCheckout} type="button" className="iris_nb_btn">{_prlTxt.placeorder}</button>
                                                    </form>
                                                </div>
                                            </div>

                                            <div className="tab-pane" id="online" role="tabpanel">
                                                <div className="iris_net_banking">
                                                    <form>
                                                        <p className="termCondtion">{_prlTxt.agreetoter} {global.BASE_NAME}<a href={global.BASE_URL+'term-condition'} target="_blank"> {_prlTxt.termcondition} </a></p>

                                                        <button disabled={this.state.isLoadingFinal} onClick={this.placeOrderOnline.bind(this)} type="button" className="iris_nb_btn">{_prlTxt.credebbtn}</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="helpTxt"> {_prlTxt.forreturncancel} <a style={{fontSize: '12px',paddingTop: '4px',color: '#eb4057'}} href={global.BASE_URL+'return-policy'} target="_blank">{_prlTxt.visithere}</a>
                                    </div>
                                </div>
                            </div>
                            {/* Shopping Cart Section*/}
                            <div className="col-lg-5 iris_checkout_process">
                                <IrisCheckoutCartPlace/>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Checkout Login Section */}
                {/* Loader ---  Section */}
                <div id={_loader} className="glb-ldr-prt">
                    <div className="spinWrap">
                        <p className="spinnerImage"></p>
                        <p className="loader"></p>
                        <p className="loadingMessage" id="spinnerMessage">{_prlTxt.proceccingto}</p>
                    </div>
                </div>
                {/* Loader ---  Section */}
            </React.Fragment>
        )
    }
}