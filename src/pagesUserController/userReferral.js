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

let _msg = 'has sent you an invite to BalleBaazi. Use code "YTQIAH1 " to register and get Rs 50 as bonus.';
class userReferral extends React.Component {

	constructor(props){
        super(props);

        this.state = {
            error: null,
            isLoggedin : true,
            user_Referal : 'NA',
            userId : _userId,
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
                _msg = 'Hey! I Am Inviting You On IRIS Boutiq App - Best Place to Explore Your Optical Needs. Use My Referral Code "'+responseJson.user_Referal+'" to Register and Enjoy A Discount Coupon Of SAD 40. '+global.BASE_URL+'sign-up';
                this.setState({userId:responseJson.user_Id,user_Referal:responseJson.user_Referal});
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
    
	render(){
		
		return (
            <React.Fragment>
                <Helmet>
                    <title>Customer Referral | IRIS Boutiq</title>
                    <meta name="description" content="Customer Referral | IRIS Boutiq"/>
                    <meta name="keywords" content="Customer Referral | IRIS Boutiq" />
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
                                        <a href={global.BASE_URL+"customer-virtual-ditto"} ><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_myditt}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-password"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_changpasw}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-referral"} className="active"><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_refferal}</a>
                                    </li>
                                    <li>
                                    <a href="#logout" onClick={this.logout}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_logout}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className="iris_my_account_right_container">
                	
		                    <h6 className="iris_reftxt">{_prlTxt.referalpage.txt}</h6>
								<span className="line_2A"></span>
								<p className="iris_txt_3G">{_prlTxt.referalpage.title}</p>
								<p className="iris_ref_link">{this.state.user_Referal || ''}</p>
								<ul className="iris_share_ref">
									<li>{_prlTxt.referalpage.share} </li>
									<li></li>
			                    	<li><a href={"https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=Your+Subject+here&ui=2&tf=1&pli=1&body="+_msg} target="_blank"><img src={global.BASE_URL + "assets/img/gmail_icon.png"} alt="" title=""/></a></li>
			                        
			                        <li><a href={"https://web.whatsapp.com/send?text="+_msg} target="_blank"><img src={global.BASE_URL + "assets/img/whatsapp.png"} alt="" title=""/></a></li>
                                    
			                    </ul>

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
export default userReferral