import React from 'react';
import IrisCheckoutCart from '../_commonFunction/checkoutCart';
import { Helmet } from 'react-helmet';
import Modal from 'react-modal';
import { toast } from "react-toastify";
import {PostData} from '../service/postData';
import { exportDefaultSpecifier } from '@babel/types';
import {userCartManage} from '../_commonFunction/userIrisCart';
import {userSessionManage} from '../_commonFunction/userIrisSession';

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

let irisBackUrl = localStorage.getItem('irisBackUrl');

const validateForm = (errors) => {
    let valid = true;
       
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

let _ISOCode = 'SAU';
let _PHCode = '0';
export default class checkoutShipping extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userIds : '0',
            sessionAs : 'guest',
            _defaultAddr:'0',
            userSession:{},
            userShippingAdd:{},
            userCountryAdd:{},
            activeDelivery:0,
            cartEmptyModalIsOpen: false,
            addressEmptyModalIsOpen: false,
            irisCartItems:[],
            countriesList:[],
            cartCount:0,            
            isAddNew : false,
            isLoaded : false,            
            modalIsOpen: false,
            redirect: false,
            firstName:null,
            lastName:null,
            emailId:null,
            phone:null,
            addressline1:null,
            addressline2:null,
            city:null,
            state:null,
            postcode:null,
            locality:null,
            selectedOption:'Male',
            altPhone:null,
            errors: {
                firstName: '',
                lastName: '',
                emailId: '',
                phone: '',
                addressline1: '',
                addressline2: '',
                city:'',
                state:'',
                postcode:'',
                locality:'',
                altPhone:'',
            }
        }
    }

    componentDidMount(){
        const paramerters = new URLSearchParams(this.props.location.search);
        let guestUserId = paramerters.get('guestUser');

        if(guestUserId === undefined || guestUserId === null)
        {
            window.location.href = global.BASE_URL+'checkout-login';
        }

        let _arry = guestUserId.split('0991574836');
        let _keyType = 'user';
        if(_arry[1] === undefined || _arry[1] === null)
        {
            _keyType = 'guest';
        }
        else{
            guestUserId = _arry[1];
        }

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
        let _listing = {};
        if(_keyType === 'user')
        {            
            if(irisUserSession === undefined || irisUserSession === null)
            {
                _userId = 0;
            }
            else{
                irisUserSession = JSON.parse(irisUserSession);
                _userId = irisUserSession.user_Id ? irisUserSession.user_Id : '0';
            }

            if(_userId == 0){
                window.location.href = global.BASE_URL+'checkout-login';
                return false;
            }

            let _urlCountry = global.userSelectedCountry+'/'+global.country_Iso;
            
            PostData(_urlCountry,'','GET').then((result) => {
                let countryData = result;
                if(countryData.success == true){

                    _ISOCode = countryData.response[0].ISO3Code ? countryData.response[0].ISO3Code : 'SAU';
                    _PHCode = countryData.response[0].country_Phone ? countryData.response[0].country_Phone : '0';

                    let _urlDataa = global.userShippingDetails+'?user_Id='+_userId;
                    PostData(_urlDataa,'','GET').then((result) => {
                        let responseJson = result;

                        let _countriesLi = [];
                        

                        let _sendCon = global.manageCountriesCity+global.country_Ids;                        
                        PostData(_sendCon,'','GET').then((resultCs) => {
                            
                            _countriesLi = resultCs.response[0];
                            let _sendStatus = global.userCheckoutIndicate+'/'+_userId+'/ADDRESS';
                        
                            PostData(_sendStatus,'','GET').then((result) => {
                                if(responseJson.success === false)
                                {
                                    this.setState({sessionAs:_keyType,userSession:irisUserSession,phone:irisUserSession.phone,userIds:_userId,isLoaded:true,irisCartItems:irisCart,cartCount:cartCount,userCountryAdd:countryData.response,countriesList:_countriesLi}); 
                                }
                                else
                                {
                                    _listing = responseJson.response;
                                    var dfAddr = _listing.filter(dfAct => (dfAct.isActive == 1));
                                    let _neDefaultAddr = 0;
                                    if(dfAddr.length > 0)
                                    {
                                        _neDefaultAddr = dfAddr[0].id;
                                    }
                                    
                                    this.setState({sessionAs:_keyType,userSession:irisUserSession,userShippingAdd:_listing,phone:irisUserSession.phone,userIds:_userId,isLoaded:true,irisCartItems:irisCart,cartCount:cartCount,_defaultAddr:_neDefaultAddr,userCountryAdd:countryData.response,countriesList:_countriesLi});             
                                } 
                            });
                        });           
                    })
                }
            });            
        }
        else
        {
            this.setState({sessionAs:_keyType,userSession:irisUserSession,userShippingAdd:_listing,phone:guestUserId,userIds:_userId,isLoaded:true,irisCartItems:irisCart,isLoaded:true,cartCount:cartCount});
        }        
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        
        switch (name) {
        case 'firstName': 
        errors.firstName = 
            value.length < 2 ? '*Full Name must be 2 characters long!' : '';

            if (!value.match(/^[a-zA-Z ]*$/)) {
                errors.firstName = "*Please enter alphabet characters only.";
            }
        this.setState({firstName:value});
        break;
        case 'lastName': 
        errors.lastName = 
            value.length < 2 ? '*Last Name must be 2 characters long!' : '';
            if (!value.match(/^[a-zA-Z ]*$/)) {
                errors.lastName = "*Please enter alphabet characters only.";
            }
            this.setState({lastName:value});   
        break;
        case 'phone': 
        errors.phone = 
          value.length < 5
            ? '*Please enter valid mobile no.'
            : '';

            if (!value.match(/^[0-9]*$/)) {
                errors.phone = "*Please enter valid mobile no.";
            }
            this.setState({phone:value}); 
        break;

        case 'altPhone':
            if(value.length != 0){                
                errors.altPhone = value.length < 5 ? '*Please enter valid mobile no a.' : ''; 
                if (!value.match(/^[0-9]{10}$/)) {
                    errors.altPhone = "*Please enter valid mobile no.";
                }
                else{
                    errors.altPhone = '';
                }           
                this.setState({altPhone:value});
            }
            else{
                errors.altPhone = "";
                this.setState({altPhone:''});
            }
        break;
        
        case 'emailId': 
        errors.emailId = 
          value.length < 5
            ? '*Please enter valid email.'
            : '';
            this.setState({emailId:value}); 
        break;
        
        case 'postcode': 
        errors.postcode = 
            value.length < 5
            ? '*Zip/Postal Code must be 5 characters long!'
            : '';
            this.setState({postcode:value});          
        break;        

        case 'addressline1': 
            errors.addressline1 = 
            value.length < 5
            ? '*Address must be 5 characters long!'
            : '';
            this.setState({addressline1:value}); 
        break;
        
        case 'addressline2':            
            this.setState({addressline2:value}); 
        break;

        case 'city':
            errors.city = 
            value.length < 2
            ? '*Please select city!'
            : '';
            
            this.setState({city:value}); 
        break;
        case 'state':
            errors.state = 
            value.length < 2
            ? '*Please select state!'
            : '';
            
            this.setState({state:value}); 
        break;
        
        case 'locality':
            errors.locality = 
            value.length < 6
            ? '*Locality must be 5 characters long!'
            : '';
            this.setState({locality:value}); 
        break;        
        default:
        break;
        }
    }

    handleTypeOptionChange = (event) => {
        this.setState({
            selectedOption: event.target.value
        });
    }

    submituserNewAddressnForm = (event) =>
    {
        event.preventDefault();
        let errors = this.state.errors;
        let _isError = '0';
        if(this.state.firstName == null)
        {
            errors['firstName'] = "*Please Enter First Name.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.lastName == null)
        {
            errors['lastName'] = "*Please Enter Last Name.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.phone == null)
        {
            errors['phone'] = "*Please Enter Contact Number.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.emailId == null)
        {
            errors['emailId'] = "*Please Enter Email-Id.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.addressline1 == null)
        {
            errors['addressline1'] = "*Please Enter Address.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.city == null)
        {
            errors['city'] = "*Please Enter City.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.state == null)
        {
            errors['state'] = "*Please Enter State.";
            this.setState({errors: errors});
            _isError = '1';
        }
        
        else if(this.state.postcode == null)
        {
            errors['postcode'] = "*Please Enter Zip/Postal Code.";
            this.setState({errors: errors});
            _isError = '1';
        } 
        else if(this.state.locality == null)
        {
            errors['locality'] = "*Please Enter Locality.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.altPhone !== null)
        {
            if (!this.state.altPhone.match(/^[a-zA-Z ]*$/)) {
                errors['altPhone'] = '';
                _isError = 0;
            }
            else{
                errors['altPhone'] = "*Please enter valid mobile no.";    
                _isError = 1;            
            }
            this.setState({errors: errors});
        }

        if(_isError == 0)
        {
            let _userId = this.state.userIds;

            if(_userId == 0)
            {
                let irisUserSession = localStorage.getItem('irisUserSession');
                if(irisUserSession === undefined || irisUserSession === null)
                {
                    _userId = 0;
                }
                else{
                    irisUserSession = JSON.parse(irisUserSession);
                    _userId = irisUserSession.user_Id ? irisUserSession.user_Id : '0';
                }
            }
            const postData = JSON.stringify({
                user_Id: _userId,
                user_firstName: this.state.firstName,
                user_lastName: this.state.lastName,
                user_emailId: this.state.emailId,
                user_phone: this.state.phone,
                user_altPhone: this.state.altPhone,
                user_address1: this.state.addressline1,
                user_address2: this.state.addressline2,
                user_locality: this.state.locality,
                user_city: this.state.city,
                user_state: this.state.state,
                user_zipCode: this.state.postcode,
                user_country:this.state.countriesList.country_Name,
                ISO3Code: _ISOCode,                
                user_gender: this.state.selectedOption,
                add_type: 'Shipping',
                isGuest: 0
            });
            PostData(global.addShippingDetails, postData,'POST').then((result) => {
                if(result.success === true)
                {
                    toast.success(result.message);
                    window.location.href = irisBackUrl;
                }
                else
                {
                    toast.error(result.message);
                }
            });
        }
    }

    proceedTOSelectedAddress = (event) =>{        
        if(this.state.cartCount == 0)
        {
            this.setState({cartEmptyModalIsOpen: true});
            return;
        }
        else if(this.state._defaultAddr > 0)
        {
            let _urlData = global.userShippingDefaultSet+'?user_Id='+this.state.userIds+'&addr_Id='+this.state._defaultAddr;
            PostData(_urlData,'','GET').then((result) => {
                let responseJson = result;
                if(responseJson.success === false)
                {      
                    toast.error(responseJson.response);          
                    return;
                }
                else
                {
                    window.location.href = global.BASE_URL+'checkout-payment?guestUser=0991574836'+this.state.userIds;
                    return;
                }
            })
        }
        else{
            if(this.state.cartCount == 0)
            {
                this.setState({cartEmptyModalIsOpen: true});
                return;
            }
            else
            {
                if(this.state.userShippingAdd.length == 0 || this.state.userShippingAdd.length == undefined){
                    this.manageAllAddressNow('new');                    
                }
                else{
                    toast.warning(_prlTxt.selectAddressNow);
                }                
            }            
        }        
        return;
    }

    activeAddressNow(e)
    {
        this.setState({
            _defaultAddr: (e)
        });
    }

    manageAllAddressNow(e){
        let _finalAnw = false;
        if(e === 'new')
        {
            _finalAnw = true;
        }

        this.setState({
            isAddNew: (_finalAnw)
        });
    }
    
    closeModalHandler = () => {
        this.setState({
            cartEmptyModalIsOpen: false,
        });
    }

    loadShippingAddress(){        
        if(this.state.isLoaded === true)
        {
            let _shipDetails = this.state.userShippingAdd;
            let dataShip = '';
            if(_shipDetails.length > 0)
            {
                dataShip = _shipDetails.map((addr, i) =>
                {
                    let _active = '';
                    
                    if(this.state._defaultAddr == 0 && addr.isActive == 1)
                    {
                        _active = 'active';
                    }
                    else if(this.state._defaultAddr === addr.id)
                    {
                        _active = 'active';
                    }
                    return (
                        <div key={i} className="userAddresses__prev" data-src={addr.id} onClick={this.activeAddressNow.bind(this, addr.id)}>
                            <label className="shipDetails_User" style={{display: 'block'}}>
                                <div className={'shippingAddress '+_active} style={{position: 'relative'}}>
                                    <div className="shippingAddressField">
                                        <span className="shippingAddressField first-name">{addr.user_firstName}</span>
                                        <span className="shippingAddressField last-name">  {addr.user_lastName}</span>
                                    </div>
                                    <div className="shippingAddressField street1">{addr.user_address1}</div>
                                    <span className="shippingAddressField city">{addr.user_city}</span>
                                    <span className="shippingAddressField postcode">, {addr.user_zipCode}</span>
                                    <div className="shippingAddressField phone">Ph - {addr.user_phone}</div>
                                </div>
                            </label>
                        </div>
                    )
                })
            }            
            return dataShip;
        }
    }

    getState(){
        let _states = '';
        if(this.state.isLoaded == true){
            let _stat = this.state.countriesList.state;
            _states = _stat.map((_stt,index) => {
                return(                                        
                <option key={index} value={_stt.state_name}>{_stt.state_name}</option>
                )
            })
        }
        return _states;
    }

    getCity(){
        let _states = '';
        if(this.state.isLoaded == true && this.state.state != null){
            let _stat = this.state.countriesList.city;
            _states = _stat.map((_stt,index) => {
                if(this.state.state == _stt.state_name)
                return(                                        
                <option key={index} value={_stt.city_name}>{_stt.city_name}</option>
                )
            })
        }
        return _states;
    }

    render(){    
        const {errors} = this.state;
        var hidden = {display:this.state.isAddNew ? "block" : "none"};
        var shown = {display:this.state.isAddNew ? "none" : "block"};

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
                                            <a href={global.BASE_URL+'checkout-login'} onClick={e => e.preventDefault()}>
                                                <span><i className="fas fa-check-double" style={{color: 'green'}}></i></span>
                                                <p>{_prlTxt.emailogin}</p>
                                            </a>
                                        </li>
                                        <li className="active">
                                            <a href={global.BASE_URL+'checkout-shipping'} onClick={e => e.preventDefault()}>
                                                <span><i className="fas fa-check"></i></span>
                                                <p>{_prlTxt.shippingadd}</p>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#' onClick={e => e.preventDefault()}>
                                                <span></span>
                                                <p>{_prlTxt.payment}</p>
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="iris_line"></div>
                                </div>
                                <div className="iris_shipping_address">
                                    <div className="allAddress_Section">
                                        <div className="row form-group">
                                            <div className="col-lg-12">
                                                <span className="iris_txt_style_10">

                                                    {this.state.userShippingAdd.length > 0 ? _prlTxt.shippingaddpage.selectprev : _prlTxt.shippingaddpage.selectnewadd}
                                                </span>
                                            </div>
                                        </div>                                           

                                        <div style={ shown }>
                                            <div className="row form-group iris_slect_add_prev">
                                                {this.loadShippingAddress()}
                                                <div className="userAddresses__prev" onClick={this.manageAllAddressNow.bind(this,'new')}>
                                                    <a className="shippingAddress addNewAddress">
                                                        <i className="fas fa-plus-circle"></i> <span>{_prlTxt.shippingaddpage.addnewadd}</span>
                                                    </a>
                                                </div>
                                            </div>
                                            
                                            <button style={{marginTop: '10px'}} onClick={this.proceedTOSelectedAddress} type="submit" className="shippingContinueButton pull-right prescriptionUpload">
                                                <span>{_prlTxt.shippingaddpage.proctopay} <span className="prescriptionUploadTxt">{_prlTxt.addpowerafter}</span></span>
                                            </button>
                                        </div>

                                        <button style={ hidden } onClick={this.manageAllAddressNow.bind(this,'old')} type="submit" className="shippingContinueButton pull-right prescriptionUpload">
                                            <span>{_prlTxt.shippingaddpage.viewalladd}</span>
                                        </button>                                        
                                    </div>

                                    <div className="newAddress_Section" style={ hidden }>
                                        <form className="iris_ship_add">
                                            <div className="row form-group">
                                                <div className="col-lg-12">
                                                    <span className="iris_txt_style_10">{_prlTxt.shippingaddpage.addnewadd} :</span>
                                                </div>
                                            </div>
                                            
                                            <div className="row form-group">
                                                <div className="col-lg-6">
                                                    <label>{_prlTxt.addaddsspage.firstname}<span>*</span></label>
                                                    <input type="text" name="firstName" className="iris_sa_name" placeholder={_prlTxt.place_firstname} onChange={this.handleChange} noValidate required/>
                                                    <span className="iris_error_txt">{errors.firstName.length > 0 && <span className='error'>{errors.firstName}</span>}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label>{_prlTxt.addaddsspage.lastname}<span>*</span></label>
                                                    <input type="text" name="lastName" className="iris_sa_name" placeholder={_prlTxt.place_lastname} onChange={this.handleChange} noValidate required/>
                                                    <span className="iris_error_txt">{errors.lastName.length > 0 && <span className='error'>{errors.lastName}</span>}</span>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-lg-6">
                                                    <label>{_prlTxt.addaddsspage.mobile}<span>*</span></label>
                                                    <input type="text" name="phone" className="iris_sa_name" placeholder={_prlTxt.place_mobile} defaultValue={this.state.phone} onChange={this.handleChange} noValidate required/>
                                                    <span className="iris_error_txt">{errors.phone.length > 0 && <span className='error'>{errors.phone}</span>}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label>{_prlTxt.addaddsspage.email}</label>
                                                    <input type="text" name="emailId" className="iris_sa_name" placeholder={_prlTxt.place_email} onChange={this.handleChange} noValidate required/>
                                                    <span className="iris_error_txt">{errors.emailId.length > 0 && <span className='error'>{errors.emailId}</span>}</span>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-lg-6">
                                                    <label>{_prlTxt.addaddsspage.addline1}<span>*</span></label>
                                                    <textarea name="addressline1" className="iris_sa_add_L1" onChange={this.handleChange} noValidate required placeholder={_prlTxt.place_add}></textarea>
                                                    <span className="iris_error_txt">{errors.addressline1.length > 0 && <span className='error'>{errors.addressline1}</span>}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label>{_prlTxt.addaddsspage.addline2}</label>
                                                    <textarea name="addressline2" className="iris_sa_add_L2" onChange={this.handleChange} noValidate></textarea>
                                                    <span className="iris_error_txt">{errors.addressline2.length > 0 && <span className='error'>{errors.addressline2}</span>}</span>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-lg-4">
                                                    <label>{_prlTxt.addaddsspage.country}<span>*</span></label>
                                                    <select className="iris_sa_country" >
                                                        <option disabled>{_prlTxt.place_selcountry}</option>
                                                        <option value={this.state.countriesList.country_Iso} selected>{this.state.countriesList.country_Name}</option>
                                                    </select>
                                                </div>
                                                <div className="col-lg-4">
                                                    <label>{_prlTxt.addaddsspage.state}<span>*</span></label>
                                                    <select className="iris_sa_country" name="state" onChange={this.handleChange}>
                                                        <option disabled selected>{_prlTxt.selectstate}</option>
                                                        {this.getState()}
                                                    </select>                                                    
                                                    <span className="iris_error_txt">{errors.state.length > 0 && <span className='error'>{errors.state}</span>}</span>
                                                </div>
                                                <div className="col-lg-4">
                                                    <label>{_prlTxt.addaddsspage.city}<span>*</span></label>
                                                    <select className="iris_sa_country" name="city" onChange={this.handleChange}>
                                                        <option disabled selected>{_prlTxt.selectcity}</option>
                                                        {this.getCity()}
                                                    </select>
                                                    <span className="iris_error_txt">{errors.city.length > 0 && <span className='error'>{errors.city}</span>}</span>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-lg-6">
                                                    <label>{_prlTxt.addaddsspage.zipcode}<span>*</span></label>
                                                    <input type="text" name="postcode" className="iris_sa_name" placeholder={_prlTxt.place_zipcode} onChange={this.handleChange} noValidate required/>
                                                    <span className="iris_error_txt">{errors.postcode.length > 0 && <span className='error'>{errors.postcode}</span>}</span>
                                                </div>
                                                <div className="col-lg-6">
                                                    <label>{_prlTxt.addaddsspage.locality}<span>*</span></label>
                                                    <input type="text" autoComplete="off" aria-autocomplete="list" name="locality" className="iris_sa_name" placeholder={_prlTxt.place_locality} onChange={this.handleChange} noValidate required/>
                                                    <span className="iris_error_txt">{errors.locality.length > 0 && <span className='error'>{errors.locality}</span>}</span>
                                                </div>
                                            </div>
                                            <div className="row form-group">
                                                <div className="col-lg-6 iris_sa_gender">
                                                    <label className="col-lg-6">
                                                        <input type="radio" name="gender" value="Male" checked={this.state.selectedOption === 'Male'} onChange={this.handleTypeOptionChange}/>
                                                        &nbsp;{_prlTxt.addaddsspage.male}</label>
                                                    <label className="col-lg-6">
                                                    <input type="radio" name="gender" value="Female" checked={this.state.selectedOption === 'Female'} onChange={this.handleTypeOptionChange}/>
                                                    &nbsp;{_prlTxt.addaddsspage.female}</label>
                                                </div>
                                                <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.altphone}</label>
                                                <input type="text" name="altPhone" className="iris_sa_mobile" onChange={this.handleChange} placeholder={_prlTxt.place_altno}/>
                                                <span className="iris_error_txt">{errors.altPhone.length > 0 && <span className='error'>{errors.altPhone}</span>}</span>
                                            </div>
                                            </div> 
                                            <button onClick={this.submituserNewAddressnForm} type="submit" className="shippingContinueButton pull-right prescriptionUpload">
                                                <span>{_prlTxt.shippingaddpage.addshipbtn} <span className="prescriptionUploadTxt">{_prlTxt.addpowerafter}</span></span>
                                            </button>
                                                                                                                      
                                        </form>
                                    </div>     
                                </div>
                            
                            </div>
                            {/* Shopping Cart Section*/}
                            <div className="col-lg-5 iris_checkout_process">
                                <IrisCheckoutCart/>
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