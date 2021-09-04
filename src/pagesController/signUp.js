import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {PostData} from '../service/postData';

import 'react-intl-tel-input/dist/main.css';
import Modal from 'react-modal';
import { toast } from "react-toastify";
import Footer from '../containers/Footer';
import {userCartManage} from '../_commonFunction/userIrisCart';
import {userSessionManage} from '../_commonFunction/userIrisSession';

import FacebookBtn from './Facebook';
import GooglePlusBtn from './GoolgePlusLog';

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

let _signTxt = '';
if(global.lang == 'en'){
    _signTxt = enLang;
}
else{
    _signTxt = arLang;
}
// Lang Json End

var md5 = require('md5');
let irisBackUrl = localStorage.getItem('irisBackUrl');
//const validEmailRegex = RegExp( /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);

const validateForm = (errors) => {
    let valid = true;
       
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

class signUp extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isLoaded : false,
            countryList:{},
            requestId : '0',
            _countryLang:'ar',
            _countryReg:'iti__hide',
            _countryFlag:global.BASE_URL+'IrisAdmin/admin-assets/images/flags/1180953476-2020-01-17-16-06-08.png',
            _countryName:'Saudi Arabia (‫المملكة العربية السعودية‬‎)',
            _countryPh:'966',
            firstName:null,
            lastName:null,
            emailId:null,
            phone:null,
            password:null,
            refer_code:null,
            confirmPassword:null,
            verificationCode:null,
            referalCode:null,
            modalIsOpen: false,
            redirect: false,
            errors: {
                firstName: '',
                lastName: '',
                emailId: '',
                phone: '',
                password: '',
                confirmPassword: '',
                verificationCode:'',
                referalCode:'',
            }
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount(){
        let _urlCountry = global.userAllCountry;   
        let _getCountries = [];         
        PostData(_urlCountry,'','GET').then((result) => {
            _getCountries = result.response;
            this.setState({countryList:_getCountries,isLoaded:true});
        });
    }

    isset(parameters) {
        if (typeof parameters == "undefined" || parameters == null)
        {
            parameters = '0';
        }
        return parameters;
    }
    
    openModal() {
        this.setState({modalIsOpen: true});
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        
        switch (name) {
        case 'firstName': 
        errors.firstName = 
            value.length < 1 ? '*Full Name must be 1 characters long!' : '';

            if (!value.match(/^[a-zA-Z ]*$/)) {
                errors.firstName = "*Please enter alphabet characters only.";
            }
        this.setState({firstName:value});
        break;
        case 'lastName': 
        errors.lastName = 
            value.length < 1 ? '*Last Name must be 1 characters long!' : '';
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
        
        case 'emailId': 
        errors.emailId = 
          value.length < 5
            ? '*Please enter valid email.'
            : '';
            this.setState({emailId:value}); 
        break;
        /*
        case 'emailId': 
        errors.emailId = 
            validEmailRegex.test(value)
            ? ''
            : '*Email is not valid!';   errors.emailId = "*Please enter Email.";           
        break;
        */

        case 'password': 
            errors.password = 
            value.length < 5
            ? '*Password must be 5 characters long!'
            : '';
            this.setState({password:value}); 
        break;
        case 'confirmPassword': 
            errors.confirmPassword = 
            value.length < 5
            ? '*Password must be 5 characters long!'
            : '';
            this.setState({confirmPassword:value}); 
        break;

        case 'verificationCode':
            errors.verificationCode = 
            value.length < 4
            ? '*Enter the OTP to verify your mobile number!'
            : '';
            this.setState({verificationCode:value}); 
        break;
        case 'refer_code':
            this.setState({refer_code:value}); 
        break;

        default:
        break;
        }
    }

    submituserRegistrationForm = (event) =>
    {
        event.preventDefault();
        let errors = this.state.errors;

        if(this.state.firstName == null)
        {
            errors['firstName'] = "*Please Enter First Name.";
            this.setState({errors: errors});
        }
        else if(this.state.lastName == null)
        {
            errors['lastName'] = "*Please Enter Last Name.";
            this.setState({errors: errors});
        }
        else if(this.state.phone == null)
        {
            errors['phone'] = "*Please Enter Contact Number.";
            this.setState({errors: errors});
        }
        else if(this.state.emailId == null)
        {
            errors['emailId'] = "*Please Enter Email-Id.";
            this.setState({errors: errors});
        }
        else if(this.state.password == null)
        {
            errors['password'] = "*Please Enter Password.";
            this.setState({errors: errors});
        }
        else if(this.state.confirmPassword == null)
        {
            errors['confirmPassword'] = "*Please Enter Confirm Password.";
            this.setState({errors: errors});
        }
        else if(this.state.password !== this.state.confirmPassword)
        {
            errors['confirmPassword'] = "*Confirm Password not Match.";
            this.setState({errors: errors});
        }
        else
        {
            const postData = JSON.stringify({
                phone: this.state.phone,
                emailId: this.state.emailId
            });
            PostData(global.checkUserEmailMobile, postData,'POST').then((result) => {
                let responseJson = result;
                if(responseJson.email.length > 0)
                {
                    errors['emailId'] = "*"+responseJson.email;
                    this.setState({errors: errors});
                }
                else if(responseJson.mobile.length > 0)
                {
                    errors['phone'] = "*"+responseJson.mobile;
                    this.setState({errors: errors});
                }
                else
                {
                    if(responseJson.mobile.length === 0 && responseJson.email.length === 0)
                    {
                        const postData = JSON.stringify({
                            mobile: this.state._countryPh+this.state.phone,
                            lang: this.state._countryLang,
                            ISDCode: this.state._countryPh
                        });
                        PostData(global.OTPRequest, postData,'POST').then((result) => {
                            if(result.ResponseStatus === 'fail' || result.ResponseStatus === 'success')
                            {
                                this.setState({modalIsOpen: true,requestId:result.requestId});
                            }
                        });                        
                    }
                }
            });
        }
    }

    resendOTPNow = (event) =>{
        const postData = JSON.stringify({
            mobile: this.state._countryPh+this.state.phone,
            lang: this.state._countryLang,
            ISDCode: this.state._countryPh
        });
        PostData(global.OTPRequest, postData,'POST').then((result) => {
            if(result.ResponseStatus === 'fail' || result.ResponseStatus === 'success')
            {
                this.setState({modalIsOpen: true,requestId:result.requestId});
            }
        }); 
    }
    
    verifyOTP = (event) => {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.verificationCode == null)
        {
            errors['verificationCode'] = "*Please Enter Verification Code.";
            this.setState({errors: errors});
        }

        if(validateForm(this.state.errors))
        {
            const postData = JSON.stringify({
                mobile: this.state._countryPh+this.state.phone,
                otp: this.state.verificationCode,
                requestId : this.state.requestId
            });
            PostData(global.OTPVerify, postData,'POST').then((result) => {
                if(result)
                {
                    const postData = JSON.stringify({
                        country_Id: '1',
                        user_Email: this.state.emailId,
                        user_Password: this.state.password,
                        user_Encrypt: md5(this.state.password),
                        user_FirstName: this.state.firstName,
                        user_LastName: this.state.lastName,
                        user_Phone: this.state._countryPh+this.state.phone,
                        user_Referal: (this.state.refer_code),
                        social_Id: '0',
                        
                        user_Lang: this.state._countryLang,
                        user_ISDCode: this.state._countryPh,
                        isGuest: 0,
                        user_via: 'Web',
                        isActive: '1'
                    });
                    PostData(global.signUp, postData,'POST').then((result) => {
                        if(result.success === true)
                        {
                            toast.success(result.message);
                            userSessionManage(localStorage,result.response[0],'startSession');
                            let _result = userCartManage(localStorage,PostData,sessionStorage,'FirstTimeImport');
                            if(_result === '-->Gotoo')
                            {
                                let _resultt = userCartManage(localStorage,PostData,sessionStorage,'Export');
                                if(_result === '-->Gotoo')
                                {
                                    this.setState({redirect: true});
                                }
                            }
                        }
                        else
                        {
                            toast.error(result.message);
                        }
                    });
                }
            });
        }   
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

    render() {
    const {errors} = this.state;
    if (this.state.redirect || localStorage.getItem('irisUserSession'))
    {            
        window.location.href = irisBackUrl;
    }
    return (
        <React.Fragment>
            <Helmet>
                <title>Sign Up | Iris Boutiq</title>
                <meta name="description" content="Sign Up | Iris Boutiq" />
                <meta name="keywords" content="Sign Up | Iris Boutiq" />
            </Helmet>
        {/* Sign Up Box Begins */}
        <section className="iris_signup_container">
            <div className="container">
                <div className="iris_signup_box">
                    <div className="row">
                        <div className="col-lg-6 iris_desk">
                            <div className="iris_signup_image">
                                <img src="assets/img/iris_signup_banner.jpg" alt="" title="" />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="iris_signup_content">
                                <div className="iris_signup_head">
                                    <h2>{_signTxt.signuppage.signup}</h2>
                                    <span></span>
                                    <p>{_signTxt.signuppage.title}</p>
                                </div>
                                <form action="#.php" className="iris_signup_form">
                                    
                                    <div className="iris_signup_elements">
                                        <div className={errors.firstName ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                            <div className="iris_signup_icon">
                                                <img src="assets/img/iris_name_icon.png" alt="" title="" />
                                            </div>
                                            <div className="iris_signup_txt">
                                                <span>{_signTxt.signuppage.firstname} <b>*</b></span>
                                                <input type="text" name="firstName" className="iris_signup_fname" placeholder={_signTxt.place_firstname} onChange={this.handleChange} noValidate required/>
                                            </div>
                                            <div className="clearfix"></div>
                                            <span className="iris_error_txt">{errors.firstName.length > 0 && <span className='error'>{errors.firstName}</span>}</span>
                                        </div>
                                        <div className={errors.lastName ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                            <div className="iris_signup_icon">
                                                <img src="assets/img/iris_name_icon.png" alt="" title="" />
                                            </div>
                                            <div className="iris_signup_txt">
                                                <span>{_signTxt.signuppage.lastname} <b>*</b></span>
                                                <input type="text" name="lastName" className="iris_signup_lname" placeholder={_signTxt.place_lastname} onChange={this.handleChange}/>
                                            </div>
                                            <div className="clearfix"></div>
                                            <span className="iris_error_txt">{errors.lastName.length > 0 && <span className='error'>{errors.lastName}</span>}</span>
                                        </div>
                                        <div className={errors.emailId ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                            <div className="iris_signup_icon">
                                                <img src="assets/img/email_icon.png" alt="" title="" />
                                            </div>
                                            <div className="iris_signup_txt">
                                                <span>{_signTxt.signuppage.email} <b>*</b></span>
                                                <input type="email" name="emailId" id="emailId" className="iris_signup_email" placeholder={_signTxt.place_email} onChange={this.handleChange}/>
                                            </div>
                                            <div className="clearfix"></div>
                                            <span className="iris_error_txt">{errors.emailId.length > 0 && <span className='error'>{errors.emailId}</span>}</span>
                                        </div>
                                        <div className={errors.phone ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                            <div className="iris_signup_icon">
                                                <img src="assets/img/iris_mobile_icon.png" alt="" title="" />
                                            </div>
                                            <div className="iris_signup_txt">
                                                <span>{_signTxt.signuppage.mobile} <b>*</b></span>
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
                                                
                                                <input type="text" autoComplete="off" name="phone" id="itiPhone" className="iris_signup_password" placeholder="Like 589XXXXX" onChange={this.handleChange}/>
                                            </div>
                                            <div className="clearfix"></div>
                                            <span className="iris_error_txt">{errors.phone.length > 0 && <span className='error'>{errors.phone}</span>}</span>
                                        </div>
                                        <div className={errors.password ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                            <div className="iris_signup_icon">
                                                <img src="assets/img/password_icon.png" alt="" title="" />
                                            </div>
                                            <div className="iris_signup_txt">
                                                <span>{_signTxt.signuppage.password} <b>*</b></span>
                                                <input type="password" autoComplete="off" name="password" className="iris_signup_password" placeholder={_signTxt.place_password} onChange={this.handleChange}/>
                                            </div>
                                            <div className="clearfix"></div>
                                            <span className="iris_error_txt">{errors.password.length > 0 && <span className='error'>{errors.password}</span>}</span>
                                        </div>
                                        <div className={errors.confirmPassword ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                            <div className="iris_signup_icon">
                                                <img src="assets/img/password_icon.png" alt="" title="" />
                                            </div>
                                            <div className="iris_signup_txt">
                                                <span>{_signTxt.signuppage.confirmpassword} <b>*</b></span>
                                                <input type="password" name="confirmPassword" className="iris_signup_password" placeholder={_signTxt.place_confirmpassword} onChange={this.handleChange}/>
                                            </div>
                                            <div className="clearfix"></div>
                                            <span className="iris_error_txt">{errors.confirmPassword.length > 0 && <span className='error'>{errors.confirmPassword}</span>}</span>
                                        </div>
                                        <div className="iris_signup_element_1">
                                            <div className="iris_signup_icon">
                                                <img src="assets/img/iris_discount_icon.png" alt="" title="" />
                                            </div>
                                            <div className="iris_signup_txt">
                                                <span>{_signTxt.signuppage.referralcode}</span>                                               
                                                <input type="text" name="refer_code" id="referalCode" className="iris_signup_referral" placeholder={_signTxt.place_referralcode} onChange={this.handleChange}/>
                                            
                                            </div>                                                
                                            <div className="clearfix"></div>
                                        </div>
                                        
                                        <div className="iris_signup_element_2">
                                            <ul>
                                                <li>
                                                    <button type="button" className="iris_signup_btn" onClick={this.submituserRegistrationForm} >{_signTxt.signup} ></button>
                                                </li>                                                
                                                <li><a href="/sign-in">{_signTxt.login}</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </form>
                                <div className="iris_signup_head">
                                    <h2>{_signTxt.signuppage.orsignup}</h2>
                                </div>
                                <div className="iris_signup_social">
                                    <ul>	
                                        <li>
                                        <FacebookBtn />
                                        </li>
                                        <li>
                                        <GooglePlusBtn />
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 iris_mob">
                            <div className="iris_signup_image">
                                <img src="assets/img/iris_signup_banner.jpg" alt="" title="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* Sign Up Box Ends */}
        
        {/* OTP modal Begins */}
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          id="SignUpOTP_Modal"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <button type="button" className="close" onClick={this.closeModal}>
                        <span aria-hidden="true">×</span>
                    </button>                    
                    <div className="modal-body">
                    <div className="row myownh1Y">
                            <div className="col-sm-5 myownh1YA">
                                <span>
                                <img src="assets/img/otp-img.png" alt="" title="" />
                                </span>
                            </div>
                            <div className="col-sm-7 myownh1YB">
                                <h5>Verify With OTP</h5>
                                <span className="styBorder"></span>
                                <p>{_signTxt.signuppage.otp_txt}</p>
                                <form>
                                    <div className="iris_otp_1A">                                    
                                        <input type="text" name="verificationCode" id="verificationCode" placeholder="4-Digit Code" onChange={this.handleChange} autoComplete="off" className={errors.verificationCode ? "SignUpOTP_ModalInputError" : "SignUpOTP_ModalInput"}/>
                                        <span style={{'display': 'block','color': 'red'}}>{errors.verificationCode.length > 0 && <span className='error'>{errors.verificationCode}</span>}</span>
                                        <a href="#Resend" onClick={this.resendOTPNow}><i className="fas fa-redo-alt"></i>&nbsp;&nbsp;{_signTxt.resend_otp}</a>
                            
                        
                                    </div>
                                    <div className="iris_otp_1B">
                                        <button className="iris_btn_style_3" onClick={this.verifyOTP} type="button">{_signTxt.submit}</button>
                                    </div>
                                    <div className="clearfix"></div>
                                </form>
                            </div>
                        </div>                    
                    </div>                    
                </div>
            </div>
        </Modal>
        {/* OTP modal Ends */}
        <Footer />
        </React.Fragment> 
    );
    }
}

export default signUp