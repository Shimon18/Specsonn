import React from 'react'
import {PostData} from '../service/postData';
import Footer from '../containers/Footer';
import { toast } from "react-toastify";
import Modal from 'react-modal';
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

var FormData = require('form-data');
var fs = require('fs');

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

let _ISOCode = global.country_Iso;
let _defaultAddr = '0';

class userDashboardAddress extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            keyType: 'add',
            userShippingAdd:[],
            countriesList:[],
            editId:0,
            error: null,
            userIds : 0,
            isLoggedin : true,            
            redirect : false,
            isAddNew:false,
            firstName: null,
            lastName: null,
            emailId: null,
            phone: null,
            addressline1: null,
            addressline2: null,
            city: null,
            postcode: null,
            locality: null,
            selectedOption:'',
            altPhone: '',
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

    componentDidMount ()
    {
        this.reviewAddress();             
    }

    reviewAddress()
    {
        let _listing = {};
        let _neDefaultAddr = 0;
        let _urlData = global.userShippingDetails+'?user_Id='+_userId;
        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            if(responseJson.success === false)
            {

            }
            else
            {   
                _listing = responseJson.response;
                var dfAddr = _listing.filter(dfAct => (dfAct.isActive == 1));
                
                if(dfAddr.length > 0)
                {
                    _neDefaultAddr = dfAddr[0].id;
                }
            }
            let _countriesLi = [];
            let _sendCon = global.manageCountriesCity+global.country_Ids;                        
            PostData(_sendCon,'','GET').then((resultCs) => {

                _countriesLi = resultCs.response[0];
                
                this.setState({userShippingAdd:_listing,phone:irisUserSession.phone,isLoaded:true,_defaultAddr:_neDefaultAddr,userIds:_userId,countriesList:_countriesLi});
            });                
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

            if (!value.match(/^[0-9]{10}$/)) {
                errors.phone = "*Please enter valid mobile no.";
            }
            this.setState({phone:value}); 
        break;

        case 'altPhone':
            if(value.length != 0){                
                errors.altPhone = value.length < 5 ? '*Please enter valid mobile no.' : ''; 
                if (!value.match(/^[0-9]{10}$/)) {
                    errors.altPhone = "*Please enter valid mobile no.";
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
    
    handleTypeGenderOptionChange = (event) => {
        this.setState({
            selectedOption: event.target.value
        });
    }
    submituserNewAddressnForm = (event) =>
    {
        event.preventDefault();
        let errors = this.state.errors;
        let _isError = '0';
        if(this.state.firstName == null || this.state.firstName.length < 2)
        {
            errors['firstName'] = "*Please Enter First Name.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.lastName == null || this.state.lastName.length < 2)
        {
            errors['lastName'] = "*Please Enter Last Name.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.phone == null  || this.state.phone.length < 6)
        {
            errors['phone'] = "*Please Enter Contact Number.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.emailId == null || this.state.emailId.length < 3)
        {
            errors['emailId'] = "*Please Enter Email-Id.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.addressline1 == null || this.state.addressline1.length < 3)
        {
            errors['addressline1'] = "*Please Enter Address.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.city == null || this.state.city.length < 2)
        {
            errors['city'] = "*Please Enter City.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.postcode == null || this.state.postcode.length < 4)
        {
            errors['postcode'] = "*Please Enter Zip/Postal Code.";
            this.setState({errors: errors});
            _isError = '1';
        } 
        else if(this.state.locality == null || this.state.locality.length < 2)
        {
            errors['locality'] = "*Please Enter Locality.";
            this.setState({errors: errors});
            _isError = '1';
        }
        else if(this.state.altPhone.length > 0)
        {
            if (!this.state.altPhone.match(/^[a-zA-Z ]*$/)) {
                errors['altPhone'] = '';
                _isError = 0;
            }
            else{
                errors['altPhone'] = "*Please enter valid mobile no.";    
                _isError = 1;            
            }

            if(this.state.altPhone.length < 7){
                errors['altPhone'] = "*Please enter valid alternate mobile no.";
                this.setState({errors: errors});
                _isError = '1';
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
                user_gender : this.state.selectedOption,
                add_type: this.state.phone,
                ISO3Code: _ISOCode,
                user_country:this.state.countriesList.country_Name,
                isGuest: 0,
                keyType: this.state.keyType,
                editId: this.state.editId
            });
            PostData(global.addShippingDetails, postData,'POST').then((result) => {
                if(result.success === true)
                {
                    toast.success(result.message);
                    this.setState({
                        isAddNew: false
                    });
                    this.reviewAddress();
                    //window.location.href = irisBackUrl;
                }
                else
                {
                    toast.error(result.message);
                }
            });
        }
    }

    logout() {
        localStorage.removeItem('irisUserSession');
        localStorage.removeItem('irisCart');
        global._sessiontoken = 0;
        global._sessionUser = 0;
        global._sessionOuth = 0;
        window.location.href = ("/");
    }
    
    removeAddress(e,i)
    {
        let _urlData = global.userShippingAddrRemove+'?user_Id='+_userId+'&addr_id='+e;
        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            if(responseJson.success === true)
            {
                toast.success(result.message);
                this.reviewAddress();
                window.location.href = global.BASE_URL+'customer-address';
                // this.setState({
                //     isAddNew: false
                // });
            }
            else
            {
                toast.error("Address details not found in system. Please try again.");
                return;
            }                
        });
    }

    makeDefaultAddr(e,i){
        let _urlData = global.userShippingDefaultSet+'?user_Id='+_userId+'&addr_Id='+e;
        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            if(responseJson.success === true)
            {
                toast.success("Your address information has been updated successfully");
                this.reviewAddress();
                this.setState({
                    isAddNew: false,
                });
            }
            else
            {
                toast.error("Address details not found in system. Please try again.");
                return;
            }                
        });
    }

    editAddress(e,i){
        let _urlData = global.userShippingAddressSingleDetails+'?user_Id='+_userId+'&addr_Id='+e;
        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            if(responseJson.success === true)
            {
                let _jsonRes = responseJson.response[0];
                this.setState({
                    isAddNew: true,
                    firstName: _jsonRes.user_firstName,
                    lastName: _jsonRes.user_lastName,
                    emailId: _jsonRes.user_emailId,
                    phone: _jsonRes.user_phone,
                    addressline1:_jsonRes.user_address1,
                    addressline2: _jsonRes.user_address2,
                    city: _jsonRes.user_city,
                    state: _jsonRes.user_state,
                    postcode: _jsonRes.user_zipCode,
                    locality: _jsonRes.user_locality,
                    altPhone : _jsonRes.user_altPhone,
                    selectedOption : _jsonRes.user_gender,
                    keyType: 'edit',
                    editId: e
                });
            }
            else
            {
                toast.error("Address details not found in system. Please try again.");
                return;
            }                
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
                    
                    if(addr.isActive == 1)
                    {
                        _defaultAddr = addr.id;
                        _active = 'active';
                    }

                    return (                       
                        <div className="col-lg-4"  key={i}>
                            <div className={'iris_address_box_1 '+_active}>
                            <div className="iris_addbox">
                                <div className="iris_address_box_1a">
                                    <a href="#" onClick={this.editAddress.bind(this,addr.id)}><i className="fas fa-pencil-alt"></i></a>
                                </div>
                                <div className="iris_address_box_1b">
                                    <a href="#" onClick={this.removeAddress.bind(this,addr.id)}><i className="far fa-trash-alt"></i></a>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            <div className="iris_detlbox iris_ship_add">
                                <p id="nameLine">
                                    <i className="fas fa-user"></i>&nbsp;&nbsp;{addr.user_firstName+' '+addr.user_lastName}
                                </p>
                                <span id="addressLine1">
                                    <i className="fas fa-street-view"></i>&nbsp;&nbsp;{addr.user_address1}
                                </span>
                                <span id="addressLine2">
                                    <i className="fas fa-street-view"></i>&nbsp;&nbsp;{addr.user_city+', '+addr.user_zipCode}
                                </span>
                                <span id="phoneLine">
                                    Ph - &nbsp;&nbsp;{addr.user_phone}
                                </span>
                                </div>
                            <div className="iris_linkbox">
                                <a href="#" onClick={this.makeDefaultAddr.bind(this,addr.id)}>{_prlTxt.addaddsspage.mkdefault}</a>
                            </div>
                        </div>
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
                //console.log(this.state.city+'---'+this.state.state+'---'+_stt.state_name);
                return(                                        
                <option key={index} value={_stt.state_name} selected={this.state.state == _stt.state_name}>{_stt.state_name}</option>
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
                <option key={index} value={_stt.city_name} selected={this.state.city == _stt.city_name}>{_stt.city_name}</option>
                )
            })
        }
        return _states;
    }

    render() {
        const {errors} = this.state;
        var hidden = {display:this.state.isAddNew ? "block" : "none"};
        var shown = {display:this.state.isAddNew ? "none" : "block"};
        
        return (
            <React.Fragment>
                <Helmet>
                    <title>Customer Addressess | IRIS Boutiq</title>
                    <meta name="description" content="Customer Addressess | IRIS Boutiq"/>
                    <meta name="keywords" content="Customer Addressess | IRIS Boutiq" />
                </Helmet>
                {/* Address Begins */}
                <section className="iris_my_account_main">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="iris_my_account_left_sidebar">
                                <ul>
                                    <li>
                                        <a href={global.BASE_URL+"customer-dashboard"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_demographic}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-address"} className="active"><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_addmanage}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-prescription"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_presciption}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-orders"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_orders}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-virtual-ditto"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_myditt}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-password"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_changpasw}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-referral"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_refferal}</a>
                                    </li>
                                    <li>
                                        <a href="#logout" onClick={this.logout}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_logout}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="iris_my_account_right_container iris_macc_ipad" style={shown}>
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="iris_add_address_box">
                                            <a href="#" className="link1" onClick={this.manageAllAddressNow.bind(this,'new')}>
                                                <img src={global.BASE_URL + "assets/img/iris_macc_add_icon.png"} alt="" title="" />
                                            </a>
                                            <a href="#" className="link2" onClick={this.manageAllAddressNow.bind(this,'new')}>{_prlTxt.addaddsspage.addnewadd}</a>                                        
                                        </div>
                                    </div>
                                    {this.loadShippingAddress()}
                                </div>
                                <div className="iris_space_1">&nbsp;</div>
                            </div>

                            <div className="iris_my_account_right_container iris_macc_ipad" style={hidden}>
                                <div className="newAddress_Section">
                                    <form className="iris_ship_add">
                                        <div className="row form-group">
                                            <div className="col-lg-12">
                                                <span className="iris_txt_style_10">{_prlTxt.addaddsspage.addeditadd}</span>
                                                <button className="BackAddress btn btn-warning" onClick={this.manageAllAddressNow.bind(this,'old')}>{_prlTxt.back}</button>
                                            </div>
                                        </div>                                            
                                        <div className="row form-group" style={{marginBottom: '20px'}}>
                                            <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.firstname}<span>*</span></label>
                                                <input type="text" name="firstName" className="iris_sa_name" placeholder={_prlTxt.place_firstname} onChange={this.handleChange} value={this.state.firstName || ''} noValidate required/>
                                                <span className="iris_error_txtt">{errors.firstName.length > 0 && <span className='error'>{errors.firstName}</span>}</span>
                                            </div>
                                            <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.lastname}<span>*</span></label>
                                                <input type="text" name="lastName" className="iris_sa_name" placeholder={_prlTxt.place_lastname} onChange={this.handleChange} noValidate required value={this.state.lastName || ''}/>
                                                <span className="iris_error_txtt">{errors.lastName.length > 0 && <span className='error'>{errors.lastName}</span>}</span>
                                            </div>
                                        </div>
                                        <div className="row form-group" style={{marginBottom: '20px'}}>
                                            <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.mobile}<span>*</span></label>
                                                <input type="text" name="phone" className="iris_sa_name" placeholder={_prlTxt.place_mobile} defaultValue={this.state.phone} onChange={this.handleChange} noValidate required/>
                                                <span className="iris_error_txtt">{errors.phone.length > 0 && <span className='error'>{errors.phone}</span>}</span>
                                            </div>
                                            <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.email}</label>
                                                <input type="text" name="emailId" className="iris_sa_name" placeholder={_prlTxt.place_email} value={this.state.emailId || ''} onChange={this.handleChange} noValidate required/>
                                                <span className="iris_error_txtt">{errors.emailId.length > 0 && <span className='error'>{errors.emailId}</span>}</span>
                                            </div>
                                        </div>
                                        <div className="row form-group" style={{marginBottom: '20px'}}>
                                            <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.addline1}<span>*</span></label>
                                                <textarea name="addressline1" className="iris_sa_add_L1" onChange={this.handleChange} value={this.state.addressline1 || ''} noValidate required placeholder={_prlTxt.place_add}></textarea>
                                                <span className="iris_error_txtt">{errors.addressline1.length > 0 && <span className='error'>{errors.addressline1}</span>}</span>
                                            </div>
                                            <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.addline2}</label>
                                                <textarea name="addressline2" className="iris_sa_add_L2" onChange={this.handleChange} value={this.state.addressline2 || ''} noValidate></textarea>
                                                <span className="iris_error_txtt">{errors.addressline2.length > 0 && <span className='error'>{errors.addressline2}</span>}</span>
                                            </div>
                                        </div>
                                        <div className="row form-group" style={{marginBottom: '20px'}}>
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
                                        <div className="row form-group" style={{marginBottom: '20px'}}>
                                            <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.zipcode}<span>*</span></label>
                                                <input type="text" name="postcode" className="iris_sa_name" placeholder={_prlTxt.place_zipcode} value={this.state.postcode || ''} onChange={this.handleChange} noValidate required/>
                                                <span className="iris_error_txtt">{errors.postcode.length > 0 && <span className='error'>{errors.postcode}</span>}</span>
                                            </div>
                                            <div className="col-lg-6">
                                                <label>{_prlTxt.addaddsspage.locality}<span>*</span></label>
                                                <input type="text" autoComplete="off" aria-autocomplete="list" name="locality" className="iris_sa_name" value={this.state.locality || ''} placeholder={_prlTxt.place_locality} onChange={this.handleChange} noValidate required/>
                                                <span className="iris_error_txtt">{errors.locality.length > 0 && <span className='error'>{errors.locality}</span>}</span>
                                            </div>
                                        </div>
                                        <div className="row form-group" style={{marginBottom: '20px'}}>
                                            <div className="col-lg-6 iris_sa_gender">
                                                <label className="col-lg-6">
                                                    <input type="radio" name="gender" value="Male" checked={this.state.selectedOption === 'Male'} onChange={this.handleTypeGenderOptionChange}/>
                                                    &nbsp;{_prlTxt.addaddsspage.male}</label>
                                                <label className="col-lg-6">
                                                <input type="radio" name="gender" value="Female" checked={this.state.selectedOption === 'Female'} onChange={this.handleTypeGenderOptionChange}/>
                                                &nbsp;{_prlTxt.addaddsspage.female}</label>
                                            </div>
                                            <div className="col-lg-6">
                                            <label>{_prlTxt.addaddsspage.altphone}</label>
                                            <input type="text" name="altPhone" className="iris_sa_mobile" onChange={this.handleChange} value={this.state.altPhone || ''} placeholder={_prlTxt.place_altno}/>
                                            <span className="iris_error_txtt">{errors.altPhone.length > 0 && <span className='error'>{errors.altPhone}</span>}</span>
                                        </div>
                                        </div> 
                                        <button onClick={this.submituserNewAddressnForm} style={{marginBottom: '20px',width: '200px'}} type="submit" className="shippingContinueButton pull-right prescriptionUpload">
                                            <span>{_prlTxt.addaddsspage.saveadd}</span>
                                        </button>                                        
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Address Ends */}
                <Footer />                   
            </React.Fragment>
                )
            }
        }
        
export default userDashboardAddress