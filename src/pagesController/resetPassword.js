import React from 'react'
import {PostData} from '../service/postData';
import { toast } from "react-toastify";
import {Redirect} from 'react-router-dom';
import Footer from '../containers/Footer';
import { Helmet } from 'react-helmet';

let md5 = require('md5');
const queryString = require('query-string');

let _requestEmail = '';

const validateForm = (errors) => {
    let valid = true;
       
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

class resetPassword extends React.Component{
    constructor(props){
        super(props);
        
        this.state = {            
            redirect : false,
            password:null,
            emailId:_requestEmail,
            confirmPassword:null,
            errors:{
                password: '',
                confirmPassword: '',
            }
        }
    }

    componentDidMount(){
        let params = queryString.parse(window.location.search);
        _requestEmail = (params.token) ? (Buffer.from(params.token, 'base64').toString('ascii')) : 'NA';
        this.setState({emailId:_requestEmail});
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        
        switch (name) {              
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
            default:
            break;
        }
    }

    resetPassword = (event) => {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.password == null)
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

        if(validateForm(this.state.errors))
        {
            const requestData = JSON.stringify({
                email_id: this.state.emailId,
                password: this.state.password,
                user_Encrypt: md5(this.state.password),
            });
            
            PostData(global.userResetPassword, requestData,'POST').then((result) => {
                if(result)
                {
                    if(result.success === true)
                    {
                        this.setState({redirect: true});
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
            window.location.href = global.BASE_URL+'sign-in';
        }

        return(
            <React.Fragment>
                <Helmet>
                    <title>Reset Password | IRIS Boutiq</title>
                    <meta name="description" content="Reset Password | IRIS Boutiq"/>
                    <meta name="keywords" content="Reset Password | IRIS Boutiq" />
                </Helmet>
                {/* Reset Password Box Begins */}
                <section className="iris_login_container">
                    <div className="container">
                        <div className="iris_login_box">
                            <div className="row">
                                
                                <div className="col-lg-6">
                                    <div className="iris_reset_1">
                                        <h3>reset password</h3>
                                        <span></span>
                                        <img src={global.BASE_URL + "assets/img/iris_reset_icon.png"} alt="" title="" />
                                        <p>
                                            To Reset your password Enter new password <br/>and then re-enter your new password.
                                        </p>
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="iris_login_content iris_reset_content">
                                        <form className="iris_login_form">
                                            <div className="iris_login_elements">
                                                <div className={errors.password ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/password_icon.png"} alt="" title="" />
                                                    </div>
                                                    <div className="iris_login_txt">
                                                        <span>New Password</span>
                                                        <input type="password" autoComplete="off" name="password" className="iris_login_password" placeholder="Enter Password Here" onChange={this.handleChange}/>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <span className="iris_error_txt">{errors.password.length > 0 && <span className='error'>{errors.password}</span>}</span>
                                                </div>
                                                <div className={errors.confirmPassword ? "iris_signup_element_1 iris_error_block" : "iris_signup_element_1"}>
                                                    <div className="iris_login_icon">
                                                        <img src={global.BASE_URL + "assets/img/password_icon.png"} alt="" title="" />
                                                    </div>
                                                    <div className="iris_login_txt">
                                                        <span>Retype Password</span>
                                                        <input type="password" name="confirmPassword" className="iris_login_password" placeholder="Enter Password Here" onChange={this.handleChange}/>
                                                    </div>
                                                    <div className="clearfix"></div>
                                                    <span className="iris_error_txt">{errors.confirmPassword.length > 0 && <span className='error'>{errors.confirmPassword}</span>}</span>
                                                </div>
                                                <div className="iris_login_element_2">
                                                    <ul>
                                                        <li>
                                                            <button type="button" className="iris_login_btn" onClick={this.resetPassword} >Submit ></button>
                                                        </li>                                                        
                                                    </ul>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Reset Password Box Ends */}
                <Footer />
        </React.Fragment>
        )
    }
}

export default resetPassword