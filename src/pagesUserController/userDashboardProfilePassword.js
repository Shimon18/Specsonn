import React from 'react'
import Footer from '../containers/Footer';
import { toast } from "react-toastify";
import {PostData} from '../service/postData';
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

class userDashboardProfilePassword extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoggedin : true,
            userId : _userId,
            currentPassword : null,            
            newPassword : null,
            redirect : false,
            rePassword : null,
            errors:{
                currentPassword : '',            
                rePassword : '',
                newPassword : '',
            }
        }
    }

    componentDidMount ()
    {   
        console.log(localStorage);
    }

    handleChange = (event) =>
    {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        
        switch (name) {
        case 'currentPassword': 
        errors.currentPassword = 
            value.length < 1 ? '*Current Password must be 1 characters long!' : '';            
        this.setState({currentPassword:value});
        break;
        case 'newPassword': 
        errors.newPassword = 
            value.length < 5 ? '*New Password must be 5 characters long!' : '';            
            this.setState({newPassword:value});   
        break;
        case 'rePassword': 
            errors.rePassword = 
            value.length < 5
            ? '*Password must be 5 characters long!'
            : '';
            this.setState({rePassword:value}); 
        break;
        
        default:
        break;
        }
    }

    updatePassword = (event) => 
    {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.currentPassword == null)
        {
            errors['currentPassword'] = "*Please Enter Current Password.";
            this.setState({errors: errors});
        }
        else if(this.state.newPassword == null)
        {
            errors['newPassword'] = "*Please Enter New Password.";
            this.setState({errors: errors});
        }
        else if(this.state.rePassword == null)
        {
            errors['rePassword'] = "*Please Enter ReType Password.";
            this.setState({errors: errors});
        }
        else if(this.state.newPassword !== this.state.rePassword)
        {
            errors['rePassword'] = "*ReType Password not Match.";
            this.setState({errors: errors});
        }
        else
        {
            const postData = JSON.stringify({
                currentPassword: this.state.currentPassword,
                newPassword: this.state.newPassword,
                user_Id: this.state.userId,
            });

            PostData(global.userPasswordUpdate, postData,'POST').then((result) => {
                if(result.success === true)
                {
                    toast.success(result.message);
                    const postDataMail = JSON.stringify({
                        FR_sendTo: irisUserSession.email,
                        FR_usernames: irisUserSession.firstName
                    });

                    PostData(global.mailUpdatePassword, postDataMail,'POST').then((resultt) => {
                    });
                    
                    localStorage.removeItem('irisUserSession');
                    localStorage.removeItem('irisCart');
                    global._sessiontoken = 0;
                    global._sessionUser = 0;
                    global._sessionOuth = 0;
                    window.location.href = global.BASE_URL+'sign-in';
                }
                else
                {
                    toast.error(result.message);
                }
            })
        }
    }

    handleTypeGenderOptionChange = (event) => {
        this.setState({
            genderOption: event.target.value
        });
    }

    logout() {
        localStorage.removeItem('irisUserSession');
        localStorage.removeItem('irisCart');
        global._sessiontoken = 0;
        global._sessionUser = 0;
        global._sessionOuth = 0;
        window.location.href = ("/");
    }

    render() {
        const {errors} = this.state;
        return (
            <React.Fragment>
                <Helmet>
                    <title>Customer Password | IRIS Boutiq</title>
                    <meta name="description" content="Customer Password | IRIS Boutiq"/>
                    <meta name="keywords" content="Customer Password | IRIS Boutiq" />
                </Helmet>
                {/* About Us Begins */}
                <section className="iris_my_account_main">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="iris_my_account_left_sidebar">
                                <ul>
                                <li>
                                        <a href={global.BASE_URL+"customer-dashboard"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_demographic}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-address"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_addmanage}</a>
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
                                        <a href={global.BASE_URL+"customer-password"} className="active"><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_changpasw}</a>
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
                            <div className="iris_my_account_right_container">
                                <form action="#.php">
                                    <div className="row iris_demoG_2">
                                        <div className="col-lg-6">
                                            <div className={errors.currentPassword ? "iris_myacc_form_element iris_error_block" : "iris_myacc_form_element"}>
                                                <div className="iris_myacc_form_element_icon">
                                                    <img src={global.BASE_URL + "assets/img/password_icon.png"} alt="" title="" />
                                                </div>
                                                <div className="iris_myacc_form_element_txt">
                                                    <label>{_prlTxt.chpwdpage.currentpwd}</label>
                                                    <input type="password" name="currentPassword" id="currentPassword" className="iris_macc_input" placeholder="Enter Current Password Here" onChange={this.handleChange} required value={this.state.currentPassword || ''}/>
                                                </div>
                                                <div className="clearfix">
                                                <span className="iris_error_txt">{errors.currentPassword.length > 0 && <span className='error'>{errors.currentPassword}</span>}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className={errors.newPassword ? "iris_myacc_form_element iris_error_block" : "iris_myacc_form_element"}>
                                                <div className="iris_myacc_form_element_icon">
                                                    <img src={global.BASE_URL + "assets/img/password_icon.png"} alt="" title="" />
                                                </div>
                                                <div className="iris_myacc_form_element_txt">
                                                    <label>{_prlTxt.chpwdpage.newpwd}</label>
                                                    <input type="password" name="newPassword" id="newPassword" className="iris_macc_input" placeholder="Enter New Password Here" onChange={this.handleChange} required value={this.state.newPassword || ''}/>
                                                </div>
                                                <div className="clearfix">
                                                <span className="iris_error_txt">{errors.newPassword.length > 0 && <span className='error'>{errors.newPassword}</span>}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className={errors.rePassword ? "iris_myacc_form_element iris_error_block" : "iris_myacc_form_element"}>
                                                <div className="iris_myacc_form_element_icon">
                                                    <img src={global.BASE_URL + "assets/img/password_icon.png"} alt="" title="" />
                                                </div>
                                                <div className="iris_myacc_form_element_txt">
                                                    <label>{_prlTxt.chpwdpage.repwd}</label>
                                                    <input type="password" name="rePassword" id="rePassword" className="iris_macc_input" placeholder="Enter ReType Password Here" onChange={this.handleChange} required value={this.state.rePassword || ''}/>
                                                </div>
                                                <div className="clearfix">
                                                <span className="iris_error_txt">{errors.rePassword.length > 0 && <span className='error'>{errors.rePassword}</span>}</span>
                                                </div>
                                                <div className="clearfix">
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-12">
                                            <button className="iris_macc_btn" onClick={this.updatePassword}>{_prlTxt.submit} ></button>
                                        </div>
                                    </div>
                                </form>
                                <div className="iris_space_1">&nbsp;</div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* About Us Box Ends */}
                <Footer />                   
            </React.Fragment>
                )
            }
        }
        
export default userDashboardProfilePassword