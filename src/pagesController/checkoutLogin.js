import React from 'react';
import IrisCheckoutCart from '../_commonFunction/checkoutCart';
import { Helmet } from 'react-helmet';
import Modal from 'react-modal';
import FacebookBtn from './Facebook';
import GooglePlusBtn from './GoolgePlusLog';
import { toast } from "react-toastify";
import {PostData} from '../service/postData';
import { exportDefaultSpecifier } from '@babel/types';
import {userCartManage} from '../_commonFunction/userIrisCart';
import {userSessionManage} from '../_commonFunction/userIrisSession';
import { globalAgent } from 'http';

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

var md5 = require('md5');

let irisBackUrl = localStorage.getItem('irisBackUrl');

const validateForm = (errors) => {
    let valid = true;     
    Object.values(errors).forEach(        
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

export default class checkoutLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            _ISDsh:'',
            requestId:0,
            _countryLang:'ar',
            _countryReg:'iti__hide',
            _countryFlag:global.BASE_URL+'IrisAdmin/admin-assets/images/flags/1180953476-2020-01-17-16-06-08.png',
            _countryName:'Saudi Arabia (‫المملكة العربية السعودية‬‎)',
            _countryPh:'966',
            isLoaded : false,
            shown:true,
            orderCount : 0,
            referalDiscount : 0,
            cartCount:0,
            cartEmptyModalIsOpen: false,
            irisCartItems:[],            
            countryList:{},
            usrLogin:'hiddenData',
            gustLogin:'',
            verifirdPwd:'hiddenData',
            verifirdOTP:'hiddenData',
            procssBtn:'hiddenData',
            chkBtn:'',
            isLoggedin : false,            
            contactNo : null,
            emailOrPhone : null,
            verificationCode:null,
            password : null,
            redirect : false,
            selectedOption: 'guest',
            readonlyME:false,
            errors:{
                contactNo : '',
                password : '',
                emailOrPhone:'',
                verificationCode:''
            }
        }
    }

    componentDidMount(){
        let irisCart = localStorage.getItem('irisCart');        
        irisCart = JSON.parse(irisCart);
        
        let cartCount = 0;
        if(irisCart == undefined || irisCart == null)
        {
        }
        else{
            cartCount = irisCart.items.length;
        }

        let irisUserSession = localStorage.getItem('irisUserSession');
        let _userId = 0;
        if(irisUserSession === undefined || irisUserSession === null)
        {
            _userId = 0;
        }
        else{
            irisUserSession = JSON.parse(irisUserSession);
            _userId = irisUserSession.user_Id ? irisUserSession.user_Id : '0';
        }

        if(_userId > 0){
            window.location.href = global.BASE_URL+'checkout-shipping?guestUser=0991574836'+_userId;
            return false;
        }

        let _urlCountry = global.userAllCountry;   
        let _getCountries = [];         
        PostData(_urlCountry,'','GET').then((result) => {
            _getCountries = result.response;
            this.setState({irisCartItems:irisCart,isLoaded:true,cartCount:cartCount,countryList:_getCountries});
        });
        
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        
        switch (name) {
        case 'contactNo': 
        errors.contactNo = 
          value.length < 5
            ? '*Please enter valid mobile no.'
            : '';

            if (!value.match(/^[0-9]*$/)) {
                errors.contactNo = "*Please enter valid mobile no.";
            }
            this.setState({contactNo:value}); 
        break;        
        case 'emailOrPhone': 
        errors.emailOrPhone = 

            errors.emailOrPhone = 'Please enter a valid Email or Mobile Number';
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? (errors.emailOrPhone = '') : function(e) {
                return /^((?!(0))[0-9]{10})$/.test(e)
            }(value) && (errors.emailOrPhone = '')
            
            let _hidSh = '';
            if (value.match(/^([0-9]+)+$/)) {
                _hidSh = "";
            }
            else{
                _hidSh = "hideCodeISD";
            }
            this.setState({emailOrPhone:value,_ISDsh:_hidSh}); 
        break;
        case 'password': 
            errors.password = 
            value.length < 5
            ? '*Password must be 5 characters long!'
            : '';
            this.setState({password:value}); 
        break;
        case 'verificationCode':
            errors.verificationCode = 
            value.length < 4
            ? '*Enter the OTP to verify your mobile number!'
            : '';
            this.setState({verificationCode:value}); 
        break;
        default:
        break;
        }
    }

    handleTypeOptionChange = (event) => {
        this.setState({
            selectedOption: event.target.value,
            shown: !this.state.shown,
            usrLogin: '',gustLogin: '',chkBtn:'',procssBtn:'hiddenData',verifirdPwd:'hiddenData',verifirdOTP:'hiddenData'
        });
    }

    handleBackOption = (event) => {
        this.setState({
            selectedOption: this.state.selectedOption,
            usrLogin: '',gustLogin: '',chkBtn:'',procssBtn:'hiddenData',verifirdPwd:'hiddenData',verifirdOTP:'hiddenData'
        });
    }
    
    clickEmailMobileCheckout = (event) => {
        event.preventDefault();
        let errors = this.state.errors;
        
        if(this.state.selectedOption === 'guest')
        {
            if(this.state.contactNo == null)
            {
                errors['contactNo'] = "*Please Enter Mobile No.";
                this.setState({errors: errors});
            }
            else
            {
                if(this.state.cartCount == 0)
                {
                    this.setState({cartEmptyModalIsOpen: true});
                }
                else{
                    this.verifyUserAccount('guest',this.state.contactNo);
                    //window.location.href = global.BASE_URL+'guest-checkout-shipping?guestUser='+this.state.contactNo;
                }
            }
        }
        else
        {            
            if(this.state.emailOrPhone == null)
            {
                errors['emailOrPhone'] = "*Please enter a valid Email or Mobile Number";
                this.setState({errors: errors});
            }
            else
            {
                this.verifyUserAccount('user',this.state.emailOrPhone);
            }
        }        
    }

    verifyUserAccount(type,res)
    {
        if (type === 'user')
        {
            let _keySend = 'Email';
            let _keyArr = this.state.emailOrPhone.split('@');
            let _keyGone = this.state.emailOrPhone;
            if(_keyArr[1] === undefined || _keyArr[1] === null)
            {
                _keySend = 'Mobile';
                _keyGone = this.state._countryPh+this.state.emailOrPhone;
            }

            let _urlData = global.userCheckEmailORMobile+'?emailOrPhone='+_keyGone;

            PostData(_urlData,'','GET').then((result) => {
                let responseJson = result;
                if(responseJson.success === false)
                {
                    let errors = this.state.errors;
                    errors['emailOrPhone'] = responseJson.message;
                    this.setState({errors: errors,chkBtn:'',procssBtn:'hiddenData',gustLogin:'hiddenData',usrLogin: '',nxtLogin: 'hiddenData'});
                    return;
                }
                else
                {
                    if(_keySend === 'Mobile')
                    {
                        toast.info('Verification code send to your mobile number.');
                        this.setState({readonlyME:true,gustLogin:'hiddenData',chkBtn:'hiddenData',procssBtn:'',usrLogin: '',nxtLogin: '',verifirdPwd:'hiddenData',verifirdOTP:'',requestId:result.requestId});
                    }
                    else
                    {
                        this.setState({readonlyME:true,gustLogin:'hiddenData',chkBtn:'hiddenData',procssBtn:'',usrLogin: '',nxtLogin: '',verifirdPwd:'',verifirdOTP:'hiddenData'});
                    }
                }
            });            
        }
        else if(type === 'guest'){

            let _urlData = global.userCheckEmailORMobile+'?emailOrPhone='+this.state._countryPh+this.state.contactNo;

            PostData(_urlData,'','GET').then((result) => {
                let responseJson = result;
                
                if(responseJson.success === true)
                {
                    let errors = this.state.errors;
                    errors['contactNo'] = 'Mobile Number already exists in system. Please continue as register user.';
                    this.setState({errors: errors});
                    return;
                }
                else
                {
                    window.location.href = global.BASE_URL+'guest-checkout-shipping?guestUser='+this.state.contactNo;
                }
                return;
            })
            //
        }
    }

    signInEmailMobileCheckout = (event) => {
        event.preventDefault();

        let _keySend = 'Email';
        let _keyArr = this.state.emailOrPhone.split('@');
        if(_keyArr[1] === undefined || _keyArr[1] === null)
        {
            _keySend = 'Mobile';
        }
        
        let errors = this.state.errors;
        if(_keySend === 'Mobile')
        {
            if(this.state.verificationCode == null)
            {
                errors['verificationCode'] = "*Please Enter Verification Code.";
                this.setState({errors: errors});
            }

        }
        else{
            if(this.state.password == null)
            {
                errors['password'] = "*Please Enter Password.";
                this.setState({errors: errors});
            }
            else{
                errors['password'] = '';
                this.setState({errors: errors});
            }
        }
        
        if(validateForm(this.state.errors))
        {            
            let _urlLogin = global.userSigninViaEmail;
            let _keyGone = this.state.emailOrPhone;
            if(_keySend === 'Mobile')
            {
                _urlLogin = global.OTPVerify;
                _keyGone = this.state._countryPh+this.state.emailOrPhone;
            }

            const postData = JSON.stringify({
                mobile: _keyGone,
                otp: this.state.verificationCode,
                password: this.state.password,
                email_id:_keyGone,
                requestId:this.state.requestId
            });
            PostData(_urlLogin, postData,'POST').then((result) => {
                if(result.success === false)
                {
                    if(_keySend === 'Mobile')
                    {
                        errors['verificationCode'] = result.message;
                    }
                    else{
                        errors['password'] = result.message;
                    }
                    
                    this.setState({errors: errors});
                    return;
                }
                else
                {
                    toast.success('Logged in susccessfully.');
                    userSessionManage(localStorage,result.response[0],'startSession');
                    let _result = userCartManage(localStorage,PostData,sessionStorage,'FirstTimeImport');
                    if(_result === '-->Gotoo')
                    {                            
                        let _resultt = userCartManage(localStorage,PostData,sessionStorage,'Export');
                        if(_result === '-->Gotoo')
                        {
                            setTimeout(
                                () => {
                                    window.location.href = global.BASE_URL+'checkout-shipping?guestUser=0991574836'+result.response[0].user_Id;
                                }, 
                                Math.floor(Math.random() * 1000) + 1
                            )                            
                        }
                    }                    
                    return;                     
                }
            });
        }         
    }
      
    closeModalHandler = () => {
        this.setState({
            cartEmptyModalIsOpen: false,
        });
    }

    manageMultiCounties(){
        this.setState({
            _countryReg:'',
        })
    }
    
    selectCounties(code,flag,name,e){
        this.setState({
            _countryReg:'iti__hide',
            _countryFlag:flag,
            _countryName:name,
            _countryPh:code,
        })
    }

    onMouseLeaveHandler() {
        this.setState({
            _countryReg:'iti__hide',
        })
    }

    getReadyMobileCode(){
        let data = [];
        if(this.state.isLoaded == true)
        {
            data = this.state.countryList.map((conty, i) =>{
                //console.log(conty);
                return(
                    <li key={i} className="iti__country iti__standard" id="iti-item-in" onClick={this.selectCounties.bind(this,conty.country_Phone,conty.image,conty.country_Name,conty.country_Continent)}>
                        <div className="iti__flag-box">
                            <div className="iti__flag" id="itiFlagImg"><img src={conty.image} /></div>
                        </div>
                        <span className="iti__country-name">{conty.country_Name}</span>
                        <span className="iti__dial-code">+{conty.country_Phone}</span>
                    </li>
                )
            });
        }
        return data;
    }

    render(){
        
        const {errors} = this.state;
        var shown = {display:this.state.shown ? "block" : "none"};
        var hidden = {display:this.state.shown ? "none" : "block"};

        return(
            <React.Fragment>
                <Helmet>
                    <title>Iris Checkout Process | IRIS Boutiq</title>
                    <meta name="description" content="Iris Checkout Process" />
                    <meta name="keywords" content="Iris Checkout Process" />
                </Helmet>
                <div className="cart_header">
                   <img src={global.BASE_URL + "assets/img/main_logo_iris_new.png"} alt="Logo" title="Iris Boutiq" />
                   <div class="bg-white">
                   <div className="iris_check_titles">
                                    <ul>
                                        <li className="active">
                                            <a href={global.BASE_URL+'checkout-login'}>
                                                <span><i className="fas fa-check"></i></span>
                                                <p>{_prlTxt.emailogin}</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href={global.BASE_URL+'checkout-shipping'}>
                                                <span></span>
                                                <p>{_prlTxt.shippingadd}</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href={global.BASE_URL+'checkout-payment'}>
                                                <span></span>
                                                <p>{_prlTxt.payment}</p>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="iris_line"></div>
                                </div>
                                </div>
                </div>
                {/* Checkout Login Section */}
                <section className="iris_checkout_container container_margin">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-7 iris_checkout_left">
                                
                                <div className="row iris_marg_top_1">
                                    <div className="col-lg-7 iris_login_chk">
                                        <form className="iris_login_form">
                                            <div id={ this.state.procssBtn } className="cursor-pointer backButton" onClick={this.handleBackOption}><span><i className="fa fa-arrow-left" aria-hidden="true"></i> {_prlTxt.back}</span></div>
                                            <div className="iris_login_elements" id={ this.state.gustLogin } style={ shown }>
                                                <div className={errors.contactNo ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    {/* <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/iris_mobile_icon.png"} alt="" title="" />
                                                    </div> */}
                                                    <div className="iris_login_txt">
                                                        <span>{_prlTxt.mobilenumber}</span>
                                                        <div className="iti__flag-container" onMouseEnter={this.manageMultiCounties.bind(this)} onMouseLeave={this.onMouseLeaveHandler.bind(this)}>
                                                            <div className="iti__selected-flag" role="combobox" aria-owns="country-listbox" tabIndex="0" title={this.state._countryName}>
                                                                <div className="iti__flag" id="itiFlagImg"><img src={this.state._countryFlag} /></div>
                                                                <div className="iti__selected-dial-code">+{this.state._countryPh}</div>
                                                                <div className="iti__arrow"></div>
                                                            </div>

                                                            <ul className={this.state._countryReg +" iti__country-list iti__country-list--dropup"} id="country-listbox" aria-expanded="false" role="listbox" aria-activedescendant="iti-item-ad">
                                                                {this.getReadyMobileCode()}
                                                            </ul>                                                    
                                                        </div>
                                                        

                                                        <input type="number" name="contactNo" id="contactNo" className="iris_login_email" placeholder="Like 589XXXXX" onChange={this.handleChange} noValidate required/>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <span className="iris_error_txt" style={{top: '80px'}}>{errors.contactNo.length > 0 && <span className='error'>{errors.contactNo}</span>}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="iris_login_elements" id={ this.state.usrLogin } style={ hidden }>
                                                <div className={errors.emailOrPhone ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/email_icon.png"} alt="" title="" />
                                                    </div>
                                                    <div className="iris_login_txt">
                                                        <span>{_prlTxt.mobileoremail}</span>

                                                        <div className="iti__flag-container" id={this.state._ISDsh} onMouseEnter={this.manageMultiCounties.bind(this)} onMouseLeave={this.onMouseLeaveHandler.bind(this)}>
                                                            <div className="iti__selected-flag" role="combobox" aria-owns="country-listbox" tabIndex="0" title={this.state._countryName}>
                                                                <div className="iti__flag" id="itiFlagImg"><img src={this.state._countryFlag} /></div>
                                                                <div className="iti__selected-dial-code">+{this.state._countryPh}</div>
                                                                <div className="iti__arrow"></div>
                                                            </div>

                                                            <ul className={this.state._countryReg +" iti__country-list iti__country-list--dropup"} id="country-listbox" aria-expanded="false" role="listbox" aria-activedescendant="iti-item-ad">
                                                                {this.getReadyMobileCode()}
                                                            </ul>                                                    
                                                        </div>
                                                        
                                                        <input type="text" name="emailOrPhone" id="emailOrPhone" className="iris_signup_lname" placeholder="Enter 589XXXXX / abc@abc.com Here" onChange={this.handleChange} noValidate required readOnly={this.state.readonlyME}/>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <span className="iris_error_txt">{errors.emailOrPhone.length > 0 && <span className='error'>{errors.emailOrPhone}</span>}</span>
                                                </div>
                                            </div>

                                            <div className="iris_login_elements" id={ this.state.verifirdPwd }>
                                                <div className={errors.password ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/password_icon.png"} alt="" title="" />
                                                    </div>
                                                    <div className="iris_login_txt">
                                                        <span>{_prlTxt.password}</span>
                                                        <input type="password" name="password" id="password" className="iris_login_email" placeholder={_prlTxt.place_password} onChange={this.handleChange} noValidate required/>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <span className="iris_error_txt">{errors.password.length > 0 && <span className='error'>{errors.password}</span>}</span>
                                                </div>
                                            </div>

                                            <div className="iris_login_elements" id={ this.state.verifirdOTP }>
                                                <div className={errors.verificationCode ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/password_icon.png"} alt="" title="" />
                                                    </div>
                                                    <div className="iris_login_txt">
                                                        <span>OTP</span>
                                                        <input type="text" name="verificationCode" id="verificationCode" placeholder="Please Enter OTP Here" onChange={this.handleChange} autoComplete="off" className="otpVerify"/>
                                                        <span id="otpResendBtn"><a href="#RS" onClick={e => e.preventDefault()}><i className="fas fa-redo-alt"></i>&nbsp;&nbsp;{_prlTxt.resend_otp}</a></span>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <span className="iris_error_txt">{errors.verificationCode.length > 0 && <span className='error'>{errors.verificationCode}</span>}</span>
                                                        
                                                </div>
                                            </div>

                                            <div className="form-group" style={{marginTop: '30px'}}>
                                                <label>
                                                    <input type="radio" value="guest" checked={this.state.selectedOption === 'guest'} onChange={this.handleTypeOptionChange}/>
                                                    <span>{_prlTxt.checkguest}</span></label>
                                                <div className="clearfix"></div>
                                                <label>
                                                    <input type="radio" value="user" checked={this.state.selectedOption === 'user'} onChange={this.handleTypeOptionChange}/>
                                                    <span>{_prlTxt.iaccount}</span>
                                                </label>
                                            </div>
                                            
                                            <div className="form-group" id={ this.state.chkBtn }>
                                                <button type="button" className="iris_btn_proceed" onClick={this.clickEmailMobileCheckout}>{_prlTxt.proceed}</button>
                                            </div>

                                            <div className="form-group" id={ this.state.procssBtn }>
                                                <button type="button" className="iris_btn_proceed" onClick={this.signInEmailMobileCheckout}>{_prlTxt.login} </button>
                                            </div>
                                        </form>
                                    </div>
                                    {/* <div className="col-lg-5 iris_login_chk_social">
                                        <i className="icon-between"></i>
                                        <span>{_prlTxt.fastcheckoutsign}</span>
                                        <ul className="iris_social_button">	
                                            <li className="chkout_social_button">
                                                <FacebookBtn nxtUrl={"checkout-shipping"} baseUrl={global.BASE_URL}/>
                                            </li>
                                            <li className="chkout_social_button">
                                                <GooglePlusBtn nxtUrl={"checkout-shipping"} baseUrl={global.BASE_URL}/>
                                            </li>
                                        </ul>
                                    </div> */}
                                </div>
                                {/* Insurance Section  Begins */}
                                <div className="bs-example iris_detail_insurance">
                                    <div className="accordion" id="accordionExample">
                                        <div className="card">
                                            <div className="card-header myownh1d2" id="headingINS">
                                                <h2 className="mb-0" align="center">
                                                    <label className="btn btn-link" onClick={() => window.location.href = global.BASE_URL+'insurance-member'}>
                                                        <span>{_prlTxt.insurancemember}</span>
                                                        <div className="clearfix"></div>
                                                    </label>
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Insurance Section End */}
                            </div>
                            {/* Shopping Cart Section*/}
                            <div className="col-lg-5 iris_checkout_process">
                                <IrisCheckoutCart orderCount={this.state.orderCount} referalDiscount={this.state.referalDiscount}/>                                   
                            </div>
                        </div>
                    </div>
                </section>
                {/* Checkout Login Section */}

                {/* CartEmpty Modal Begins */}
                <Modal
                isOpen={this.state.cartEmptyModalIsOpen}
                onRequestClose={this.closeModalHandler}
                id="cartEmpty_Modal"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <button type="button" className="close" onClick={this.closeModalHandler}>
                                <span aria-hidden="true" style={{float: 'right'}}>×</span>
                            </button>                    
                            <div className="modal-body">
                                <div className="row myownh1Y">
                                    <div className="col-sm-12 emptyCartModal">
                                        <span>
                                        <img src={global.BASE_URL + "assets/img/main_logo_iris_new.png"} alt="Iris Logo" title="Iris Logo" />
                                        </span>
                                                                    
                                    <p className="cart-info"><span>{_prlTxt.shoppingcartempty_a}</span></p>
                                    <p className="cart-info">{_prlTxt.shoppingcartemptynoitem}</p>
                                    <div className="cart-footer-button"><a href={global.BASE_URL} className="continue-shopping title">{_prlTxt.continueshopping}</a></div>                                       
                                    </div>
                                </div>                    
                            </div>                    
                        </div>
                    </div>
                </Modal>
                        
                {/* CartEmpty modal Ends */}
            </React.Fragment>
        )
    }
}