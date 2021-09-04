import React from 'react'
import {PostData} from '../service/postData';
import { toast } from "react-toastify";
import {Redirect} from 'react-router-dom';
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

let _forTxt = '';
if(global.lang == 'en'){
    _forTxt = enLang;
}
else{
    _forTxt = arLang;
}
// Lang Json End

const validateForm = (errors) => {
    let valid = true;
       
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

class forgotPassword extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {            
            redirect : false,
            emailId : null,
            errors:{
                emailId:''
            }
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        
        switch (name) {              
        case 'emailId': 
        errors.emailId = 
          value.length < 5
            ? '*Please enter valid email.'
            : '';
            this.setState({emailId:value}); 
        break;
        default:
        break;
        }
    }

    forgotPassword = (event) => {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.emailId == null)
        {
            errors['emailId'] = "*Please Enter Mobile No.";
            this.setState({errors: errors});
        }

        if(validateForm(this.state.errors))
        {
            const requestData = JSON.stringify({
                email_id: this.state.emailId
            });
            PostData(global.userCheckEmail, requestData,'POST').then((result) => {
                if(result)
                {
                    if(result.success === true)
                    {
                        toast.success(result.message);
                        this.setState({redirect: true});
                        //this.setState.emailId = Buffer.from(this.state.emailId).toString('base64');
                        return;
                    }
                    else
                    {
                        toast.error(result.message);
                    }                
                }
            });
        }      
    }

    render(){
        const {errors} = this.state;
        if (this.state.redirect) {
            return (<Redirect to={{
                pathname: '/sign-in/'
            }}/>)
        }
        return(
            <React.Fragment>
                <Helmet>
                    <title>Forgot Password | Iris Boutiq</title>
                    <meta name="description" content="Forgot Password | Iris Boutiq" />
                    <meta name="keywords" content="Forgot Password | Iris Boutiq" />
                </Helmet>
            {/* Forgot Password Box Begins */}
            <section className="iris_forgot_password">
                
                <div className="container">
                    <div className="iris_fgt_bx">
                        <div className="row">
                            <div className="col-lg-12" align="center">
                                <h3 className="iris_txt_style_3">{_forTxt.forgotpassword}</h3>
                                <span className="iris_ind"></span>
                                <p className="iris_txt_style_4">{_forTxt.forgotpage.title}
                                    
                                </p>
                                <img src="assets/img/iris_forgot_img.jpg" alt="" title="" />
                            </div>
                            <div className="col-lg-4 offset-4 offsetright-4">
                                <form className="iris_login_form iris_forgot_form">
                                    <div className={errors.emailId ? "iris_login_elements iris_forgot_elements iris_error_block" : "iris_login_elements iris_forgot_elements"}>
                                        <div className="iris_login_element_1 iris_forgot_elements_1">
                                            <div className="iris_login_icon">
                                                <img src="assets/img/email_icon.png" alt="" title="" />
                                            </div>
                                            <div className="iris_login_txt">
                                                <span>{_forTxt.email_id}</span>
                                                <input type="email" name="emailId" id="emailId" className="iris_login_email" placeholder={_forTxt.place_email} onChange={this.handleChange}/>
                                            </div>
                                            <div className="clearfix"></div>
                                            <span className="iris_error_txt">{errors.emailId.length > 0 && <span className='error'>{errors.emailId}</span>}</span>
                                        </div>
                                        
                                        <div className="iris_login_element_2 iris_forgot_element_2" align="center">
                                            <ul>
                                                <li>
                                                    <button type="button" className="iris_login_btn" onClick={this.forgotPassword}>{_forTxt.submit} &gt;</button>
                                                </li>                                                
                                            </ul>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>                       
                </div>        
            </section>
            {/* Forgot Password Box Ends */}
        </React.Fragment>
        )
    }
}

export default forgotPassword