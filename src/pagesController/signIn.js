import React from 'react'
import {PostData} from '../service/postData';
import Modal from 'react-modal';
import { toast } from "react-toastify";
import Footer from '../containers/Footer';
import {userCartManage} from '../_commonFunction/userIrisCart';
import {userSessionManage} from '../_commonFunction/userIrisSession';

import {localStorageSession} from '../service/localStorage';
import { Helmet } from 'react-helmet';
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

const validateForm = (errors) => {
    let valid = true;
       
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}


class signIn extends React.Component {
    
    constructor(props){
        super(props);
        
        this.state = {
            isLoaded : false,
            countryList:{},
            requestId : 0,
            _countryLang:'ar',
            _countryReg:'iti__hide',
            _countryFlag:global.BASE_URL+'IrisAdmin/admin-assets/images/flags/1180953476-2020-01-17-16-06-08.png',
            _countryName:'Saudi Arabia (‫المملكة العربية السعودية‬‎)',
            _countryPh:'966',
            shown:true,
            isLoggedin : false,
            modalIsOpen: false,
            userName : '',
            userId : '',
            outhKey : '',
            loginError : '',
            redirect : false,
            contactNo : null,
            emailId : null,
            password : null,
            verificationCode:null,
            errors:{
                contactNo : '',
                password : '',
                emailId:'',
                verificationCode:'',
            }
        }
    }    

    componentDidMount(){
        let _urlCountry = global.userAllCountry;   
        let _getCountries = [];         
        PostData(_urlCountry,'','GET').then((result) => {
            _getCountries = result.response;
            this.setState({countryList:_getCountries,isLoaded:true});
        });
    }

    toggle(){
        this.setState({
            shown: !this.state.shown
        })
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
        case 'emailId': 
        errors.emailId = 
          value.length < 5
            ? '*Please enter valid email.'
            : '';
            this.setState({emailId:value}); 
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

    clickTOSignIn = (event) =>
    {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.contactNo == null)
        {
            errors['contactNo'] = "*Please Enter Mobile No.";
            this.setState({errors: errors});
        }
        else
        {
            this.signInMode('mobile',this.state.contactNo);
        }
    }

    clickTOSignInEmail = (event) =>
    {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.emailId == null)
        {
            errors['emailId'] = "*Please Enter Mobile No.";
            this.setState({errors: errors});
        }
        if(this.state.password == null)
        {
            errors['password'] = "*Please Enter Password.";
            this.setState({errors: errors});
        }
        else
        {
            this.signInMode('email',this.state.emailId);
        }
    }

    signInMode(type,res)
    {        
        if (type === 'mobile')
        {
            const postData = JSON.stringify({
                phone: this.state._countryPh+res,
                lang: this.state._countryLang,
                ISDCode: this.state._countryPh
            });
            PostData(global.checkLoginRequest, postData,'POST').then((result) => {
                let responseJson = result;
                if(responseJson.success === false)
                {
                    toast.error(responseJson.message);
                    return;
                }
                else
                {
                    this.setState.userId = responseJson.outhKey;
                    this.setState.userName = responseJson.userName;
                    this.setState.outhKey = responseJson.outhKey; 
                    const postData = JSON.stringify({
                        mobile: this.state._countryPh+this.state.contactNo,//'917697675560',//
                        lang: this.state._countryLang,
                        ISDCode: this.state._countryPh //'91'//
                    });
                    PostData(global.OTPRequest, postData,'POST').then((result) => {
                        if(result.ResponseStatus === 'fail' || result.ResponseStatus === 'success')
                        {
                            toast.info('Verification code send to your register contact number.');
                            this.setState({modalIsOpen: true,requestId:result.requestId});
                        }
                    }); 
                }
            });            
        }
        else if (type === 'email')
        {
            const requestData = JSON.stringify({
                password: this.state.password,
                encrypt: md5(this.state.password),
                email_id:this.state.emailId
            });
            
            PostData(global.userSigninViaEmail, requestData,'POST').then((result) => {
                let responseJson = result;                
                if(responseJson.success === false)
                {
                    toast.error(responseJson.message);
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
                                        this.setState({redirect: true});
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

    resendOTPNow = (event) =>{
        const postData = JSON.stringify({
            mobile: this.state._countryPh+this.state.contactNo,//'917697675560',//
            lang: this.state._countryLang,
            ISDCode: this.state._countryPh //'91'//
        });
        PostData(global.OTPRequest, postData,'POST').then((result) => {
            if(result.ResponseStatus === 'fail' || result.ResponseStatus === 'success')
            {
                toast.info('Verification code send to your register contact number.');
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
                mobile: this.state._countryPh+this.state.contactNo,
                otp: this.state.verificationCode,
                requestId:this.state.requestId
            });
            PostData(global.OTPVerify, postData,'POST').then((result) => {
                if(result.success === false)
                {
                    toast.error(result.message);
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
                                        this.setState({redirect: true});
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

    closeModal = () => {
        this.setState({modalIsOpen: false});
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

    render ()
    {        
        const {errors} = this.state;
        var shown = {display:this.state.shown ? "block" : "none"};
        var hidden = {display:this.state.shown ? "none" : "block"};
        if (this.state.redirect || localStorage.getItem('irisUserSession'))
        {
            if(window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up' || window.location.pathname === '/sign-in/' || window.location.pathname === '/sign-up/')
            {
                window.location.href = global.BASE_URL;
            }
            else{
                window.location.href = irisBackUrl;
            }
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>Sign In - Login | Iris Boutiq</title>
                    <meta name="description" content="Sign In - Login | Iris Boutiq" />
                    <meta name="keywords" content="Sign In - Login | Iris Boutiq" />
                </Helmet>
                {/* Login Box Using Mobile No Begins */}
                <section className="iris_login_container" style={ shown }>
                    <div className="container">
                        <div className="iris_login_box">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="iris_login_content">
                                        <div className="iris_login_head">
                                            <h2>{_signTxt.signinpage.title}</h2>
                                            <span></span>
                                            <p>{_signTxt.signinpage.heading}</p>
                                        </div>
                                        <form action="#.php" className="iris_login_form">
                                            <div className="iris_login_elements">
                                                <div className={errors.contactNo ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/email_icon.png"} alt="" title="" />
                                                    </div>
                                                    <div className="iris_login_txt">
                                                        <span>{_signTxt.signinpage.mobile}</span>
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
                                                    <span className="iris_error_txt">{errors.contactNo.length > 0 && <span className='error'>{errors.contactNo}</span>}</span>
                                                </div>
                                                                                                
                                                <div className="iris_login_element_2">
                                                    <ul>
                                                        <li>
                                                            <button type="button" className="iris_login_btn" onClick={this.clickTOSignIn} >{_signTxt.requestOTP} ></button>
                                                        </li>
                                                        <li>
                                                            <a href="#EM" onClick={this.toggle.bind(this)}>{_signTxt.signinpage.signemail}</a>
                                                        </li>
                                                        <li>
                                                            <a href={global.BASE_URL+"forgot-password"}>{_signTxt.forgotpassword} ?</a>
                                                        </li>
                                                        <li>
                                                            <a href={global.BASE_URL + "sign-up"}>{_signTxt.signup}</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="iris_login_head">
                                            <h2>{_signTxt.signinpage.or}</h2>
                                            <span></span>
                                        </div>
                                        <div className="iris_login_social">
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
                                <div className="col-lg-6">
                                    <div className="iris_login_image">
                                        <img src={global.BASE_URL + "assets/img/iris_login_banner.jpg"} alt="" title="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Login Box Ends */}

                {/* Login Box Using Email Begins */}
                <section className="iris_login_container" style={ hidden }>
                    <div className="container">
                        <div className="iris_login_box">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="iris_login_content">
                                        <div className="iris_login_head">
                                            <h2>{_signTxt.signinpage.title}</h2>
                                            <span></span>
                                            <p>{_signTxt.signinpage.emailLogin}</p>
                                        </div>
                                        <form action="#.php" className="iris_login_form">
                                            <div className="iris_login_elements">
                                                <div  className={errors.emailId ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/email_icon.png"} alt="" title="" />
                                                    </div>
                                                    <div className="iris_login_txt">
                                                        <span>{_signTxt.signinpage.email_id}</span>
                                                        <input type="email" name="emailId" id="emailId" className="iris_login_email" placeholder={_signTxt.place_email} onChange={this.handleChange} />
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <span className="iris_error_txt">{errors.emailId.length > 0 && <span className='error'>{errors.emailId}</span>}</span>
                                                </div>
                                                <div className={errors.password ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/password_icon.png"} alt="" title="" />
                                                    </div>
                                                    <div className="iris_login_txt">
                                                        <span>{_signTxt.signinpage.password}</span>
                                                        <input type="password" autoComplete="off" name="password" className="iris_login_password" placeholder={_signTxt.place_password} onChange={this.handleChange}/>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <span className="iris_error_txt">{errors.password.length > 0 && <span className='error'>{errors.password}</span>}</span>
                                                </div>
                                                <div className="iris_login_element_2">
                                                    <ul>
                                                        <li>
                                                            <button type="button" className="iris_login_btn" onClick={this.clickTOSignInEmail}>{_signTxt.login} ></button>
                                                        </li>
                                                        <li>
                                                            <a href="#WM" onClick={this.toggle.bind(this)}>{_signTxt.signinpage.signmobile}</a>
                                                        </li>
                                                        <li>
                                                            <a href={global.BASE_URL + "forgot-password"}>{_signTxt.forgotpassword} ?</a>
                                                        </li>
                                                        <li>
                                                            <a href={global.BASE_URL + "sign-up"}>{_signTxt.signup}</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </form>
                                        <div className="iris_login_head">
                                            <h2>{_signTxt.signinpage.or}</h2>
                                            <span></span>
                                        </div>
                                        <div className="iris_login_social">
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
                                <div className="col-lg-6">
                                    <div className="iris_login_image">
                                        <img src={global.BASE_URL + "assets/img/iris_login_banner.jpg"} alt="" title="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Login Box Ends */}

                {/* OTP Modal Begins */}
                <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                id="SignInOTP_Modal"
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
                                        <img src={global.BASE_URL + "assets/img/otp-img.png"} alt="" title="" />
                                        </span>
                                    </div>
                                    <div className="col-sm-7 myownh1YB">                                
                                        <h5>{_signTxt.signinpage.verify}</h5>
                                        <span className="styBorder"></span>
                                        <p>{_signTxt.signinpage.otp_txt}</p>
                                        <form>
                                            <div className="iris_otp_1A">                                    
                                                <input type="text" name="verificationCode" id="verificationCode" placeholder="Verification Code" onChange={this.handleChange} autoComplete="off" className={errors.verificationCode ? "SignInOTP_ModalInputError" : "SignInOTP_ModalInput"}/>
                                                <span id="erorOtpLn" style={{'display': 'block','color': 'red'}}></span>
                                                {errors.verificationCode.length > 0 && <span className='error' id="erorOtpMsg">{errors.verificationCode}</span>}
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
        )
    }
}

export default signIn