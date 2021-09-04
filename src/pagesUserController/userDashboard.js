import React from 'react'
import {PostData} from '../service/postData';
import Footer from '../containers/Footer';
import { toast } from "react-toastify";
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

class userDashboard extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            error: null,
            isLoggedin : true,
            fullName : 'NA',
            userId : _userId,
            gender : 'NA',
            emailId : 'NA',
            contactNo : 'NA',
            address : 'NA',
            redirect : false,            
        }
    }

    componentDidMount ()
    {
        let _url_GetData = global.userDetail+'?uid='+_userId;
        PostData(_url_GetData,'','GET')
        .then(result => {
            if(result.success === false)
            {
                toast.error(result.message);
                this.setState({redirect: true});
                return;
            }            
            else
            {
                let responseJson = result.response[0];
                
                let _gender = responseJson.user_gender;
                if(responseJson.user_gender == 0){
                    _gender = 'NA';
                }

                let _phone = responseJson.user_Phone;
                if(responseJson.user_Phone == 0){
                    _phone = 'NA';
                }

                this.setState({userId:responseJson.user_Id,fullName:(responseJson.user_FirstName+' '+responseJson.user_LastName),emailId:responseJson.user_Email,contactNo:_phone,gender:_gender});
                return;
            }
        })
        .then(items => {
            this.setState({isLoaded: true});
        })
        .catch(error => this.setState({ error, isLoaded: false }));        
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
        if (this.state.redirect)
        {   
            this.logout();         
            window.location.href = global.BASE_URL+'sign-in/';
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>Customer Dashboard | IRIS Boutiq</title>
                    <meta name="description" content="Customer Dashboard | IRIS Boutiq"/>
                    <meta name="keywords" content="Customer Dashboard | IRIS Boutiq" />
                </Helmet>
                {/* About Us Begins */}
                <section className="iris_my_account_main">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="iris_my_account_left_sidebar">
                                <ul>
                                    <li>
                                        <a href={global.BASE_URL+"customer-dashboard"} className="active"><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_demographic}</a>
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
                            <div className="iris_my_account_right_container">
                                <div className="iris_demoG_1">
                                    <a href={global.BASE_URL + "customer-demographic"}><i className="fas fa-pencil-alt"></i>&nbsp;Edit</a>
                                </div>
                                <div className="row iris_demoG_2">
                                    <div className="col-lg-6">
                                        <div className="iris_myacc_form_element">
                                            <div className="iris_myacc_form_element_icon">
                                                <img src={global.BASE_URL + "assets/img/iris_name_icon.png"} alt="" title="" />
                                            </div>
                                            <div className="iris_myacc_form_element_txt">
                                                <label>{_prlTxt.fullname}</label>
                                                <span className="iris_MA_txt">{this.state.fullName || ''}</span>
                                            </div>
                                            <div className="clearfix">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="iris_myacc_form_element">
                                            <div className="iris_myacc_form_element_icon">
                                                <img src={global.BASE_URL + "assets/img/iris_gender_icon.png"} alt="" title="" />
                                            </div>
                                            <div className="iris_myacc_form_element_txt">
                                                <label>{_prlTxt.gender}</label>
                                                <span className="iris_MA_txt">{this.state.gender || ''}</span>
                                            </div>
                                            <div className="clearfix">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="iris_myacc_form_element">
                                            <div className="iris_myacc_form_element_icon">
                                                <img src={global.BASE_URL + "assets/img/email_icon.png"} alt="" title="" />
                                            </div>
                                            <div className="iris_myacc_form_element_txt">
                                                <label>{_prlTxt.email_id}</label>
                                                <span className="iris_MA_txt">{this.state.emailId || ''}</span>
                                            </div>
                                            <div className="clearfix">
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="iris_myacc_form_element">
                                            <div className="iris_myacc_form_element_icon">
                                                <img src={global.BASE_URL + "assets/img/iris_mobile_icon.png"} alt="" title="" />
                                            </div>
                                            <div className="iris_myacc_form_element_txt">
                                                <label>{_prlTxt.mobilenumber}</label>
                                                <span className="iris_MA_txt">{this.state.contactNo || ''}</span>
                                            </div>
                                            <div className="clearfix">
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
        
export default userDashboard