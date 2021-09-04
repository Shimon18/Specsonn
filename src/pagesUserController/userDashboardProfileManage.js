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


const validateForm = (errors) => {
    let valid = true;
       
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

class userDashboardProfileManage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoggedin : true,
            userId : _userId,
            firstName : 'NA',            
            genderOption: 'Male',
            lastName : 'NA',
            redirect : false,
            emailId : 'NA',
            contactNo : '',
            finalPhone : '',
            errors:{
                firstName : '',            
                genderOption : '',
                lastName : '',
            }
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
                
                let _gender = 'male';
                if(responseJson.user_gender !== '0')
                {
                    _gender = responseJson.user_gender;
                }
                this.setState({userId:responseJson.user_Id,firstName:responseJson.user_FirstName,lastName:responseJson.user_LastName,emailId:responseJson.user_Email,contactNo:responseJson.user_Phone,finalPhone:responseJson.user_Phone,genderOption:_gender});
                return;
            }
        })
        .then(items => {
            this.setState({isLoaded: true});
        })
        .catch(error => this.setState({ error, isLoaded: false }));        
    }

    handleChange = (event) =>
    {
        event.preventDefault();
        const { name, value } = event.target;
        let errors = this.state.errors;
        
        switch (name) {
        case 'firstName': 
        errors.firstName = 
            value.length < 1 ? '*First Name must be 1 characters long!' : '';

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
        default:
        break;
        }
    }

    updateProfile = (event) => 
    {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.firstName == null)
        {
            errors['firstName'] = "*Please Enter Verification Code.";
            this.setState({errors: errors});
        }
        if(this.state.lastName == null)
        {
            errors['lastName'] = "*Please Enter Verification Code.";
            this.setState({errors: errors});
        }
        

        if(validateForm(this.state.errors))
        {
            const postData = JSON.stringify({
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                user_Id: this.state.userId,
                contactNo: this.state.contactNo,
                gender_Id: this.state.genderOption,
            });
            PostData(global.userProfileUpdate, postData,'POST').then((result) => {
                if(result.success === true)
                {
                    toast.success(result.message);
                    window.location.href = global.BASE_URL+'customer-dashboard';
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
                    <title>Customer Profile | IRIS Boutiq</title>
                    <meta name="description" content="Customer Profile | IRIS Boutiq"/>
                    <meta name="keywords" content="Customer Profile | IRIS Boutiq" />
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
                                <form action="#.php">
                                    <div className="row iris_demoG_2">
                                        <div className="col-lg-6">
                                            <div className={errors.firstName ? "iris_myacc_form_element iris_error_block" : "iris_myacc_form_element"}>
                                                <div className="iris_myacc_form_element_icon">
                                                    <img src={global.BASE_URL + "assets/img/iris_name_icon.png"} alt="" title="" />
                                                </div>
                                                <div className="iris_myacc_form_element_txt">
                                                    <label>{_prlTxt.addaddsspage.firstname}</label>
                                                    <input type="text" name="firstName" id="firstName" className="iris_macc_input" placeholder="Enter Name Here" onChange={this.handleChange} required value={this.state.firstName || ''}/>
                                                </div>
                                                <div className="clearfix">
                                                <span className="iris_error_txt">{errors.firstName.length > 0 && <span className='error'>{errors.firstName}</span>}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className={errors.lastName ? "iris_myacc_form_element iris_error_block" : "iris_myacc_form_element"}>
                                                <div className="iris_myacc_form_element_icon">
                                                    <img src={global.BASE_URL + "assets/img/iris_name_icon.png"} alt="" title="" />
                                                </div>
                                                <div className="iris_myacc_form_element_txt">
                                                    <label>{_prlTxt.addaddsspage.lastname}</label>
                                                    <input type="text" name="lastName" id="lastName" className="iris_macc_input" placeholder="Enter Name Here" onChange={this.handleChange} required value={this.state.lastName || ''}/>
                                                </div>
                                                <div className="clearfix">
                                                <span className="iris_error_txt">{errors.lastName.length > 0 && <span className='error'>{errors.lastName}</span>}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="iris_myacc_form_element">
                                                <div className="iris_myacc_form_element_icon">
                                                    <img src={global.BASE_URL + "assets/img/iris_gender_icon.png"} alt="" title="" />
                                                </div>
                                                <div className="iris_myacc_form_element_txt iris_MAC_style_3">
                                                    <label>{_prlTxt.gender}</label>
                                                    <label className="col-lg-4">
                                                        <input type="radio" value="Male" checked={this.state.genderOption === 'Male'} onChange={this.handleTypeGenderOptionChange}/>&nbsp;<span>{_prlTxt.addaddsspage.male}</span>
                                                    </label>
                                                    <label className="col-lg-4">
                                                        <input type="radio" value="Female" checked={this.state.genderOption === 'Female'} onChange={this.handleTypeGenderOptionChange}/>&nbsp;<span>{_prlTxt.addaddsspage.female}</span>
                                                    </label>
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
                                                    <label>{_prlTxt.addaddsspage.email}</label>
                                                    <input type="text" readOnly={true} name="emailId" id="emailId" className="iris_macc_input" placeholder="Enter Email Here" onChange={this.handleChange} required value={this.state.emailId || ''} />

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
                                                    <input type="number" readOnly={this.state.finalPhone == 0 ? false : true} name="contactNo" id="contactNo" className="iris_macc_input" placeholder="Enter Phone No. Here" onChange={this.handleChange} required value={this.state.contactNo || ''}/>
                                                </div>
                                                <div className="clearfix">
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <button className="iris_macc_btn" onClick={this.updateProfile}>{_prlTxt.submit} ></button>
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
        
export default userDashboardProfileManage