import React, { Component } from 'react';

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

let _fooTxt = '';
if(global.lang == 'en'){
    _fooTxt = enLang;
}
else{
    _fooTxt = arLang;
}
// Lang Json End

export default class FooterInner extends Component{
    render()
    {
        return (
            <footer className="footer">
                <section className="iris_app_info">
                    <div className="row">
                        <div className="col-lg-2 iris_new_footer_1">
                            <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_1.png"} alt="" title="" />
                            <span>{_fooTxt.trackorder}</span>
                        </div>
                        <div className="col-lg-1 iris_new_footer_1">
                            <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_2.png"} alt="" title="" />
                            <span>{_fooTxt.contactus}</span>
                        </div>
                        <div className="col-lg-5 iris_new_footer_2">
                            <p>{_fooTxt.footerpage.title_a}</p>
                            <h6><a href="mailto:support@irisboutique.com" target="_top">support@irisboutique.com</a></h6>
                            <p>{_fooTxt.footerpage.title_b}</p>
                        </div>
                        <div className="col-lg-4 iris_new_footer_2">
                            <p>{_fooTxt.footerpage.title_c}</p>
                            <h6>0124-444-5800</h6>
                            <p>10:00 am to 7:00 pm</p>
                        </div>
                    </div>
                    <div className="row iris_PLF">
                        <div className="col-lg-2 iris_footer_new_3 wd1">
                            <table width="100%" cellPadding="0" cellSpacing="0">
                                <tbody>
                                <tr>
                                    <td width="20%">
                                        <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_3.png"} alt="" />
                                    </td>
                                    <td width="80%">
                                        <p>{_fooTxt.footerpage.quality}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" height="5">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td width="20%">
                                        <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_4.png"} alt="" />
                                    </td>
                                    <td width="80%">
                                        <p>{_fooTxt.footerpage.secure}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" height="5">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td width="20%">
                                        <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_5.png"} alt="" />
                                    </td>
                                    <td width="80%">
                                        <p>{_fooTxt.footerpage.returns}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" height="5">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td width="20%">
                                        <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_6.png"} alt="" />
                                    </td>
                                    <td width="80%">
                                        <p>{_fooTxt.footerpage.cash}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" height="5">&nbsp;</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-2 iris_footer_new_4 wd2">
                            <h6>{_fooTxt.Products}</h6>
                            <ul>
                                <li><a href={global.BASE_URL + "eyeglasses"}>Eyeglasses</a></li>
                                <li><a href={global.BASE_URL + "sunglasses"}>Sunglasses</a></li>
                                <li><a href={global.BASE_URL + "contact-lenses"}>Contact Lenses</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 iris_footer_new_4 wd2">
                            <h6>{_fooTxt.footerpage.usefull}</h6>
                            <ul>                                    
                                <li><a href={global.BASE_URL + "return-policy"}>{_fooTxt.returnpolicy}</a></li>
                                <li><a href={global.BASE_URL + "term-condition"}>{_fooTxt.termcon}</a></li>
                                <li><a href={global.BASE_URL + "cancel-return-policy"}>{_fooTxt.cancelreturnpolicy}</a></li>
                                <li><a href={global.BASE_URL + "warranty-policy"}>{_fooTxt.warrantypolicy}</a></li>
                                <li><a href={global.BASE_URL + "privacy-policy"}>{_fooTxt.privacypolicy}</a></li>
                                <li><a href={global.BASE_URL + "about-us"}>{_fooTxt.about}</a></li>
                                <li><a href={global.BASE_URL + "faq"}>{_fooTxt.faq}</a></li>
                            </ul>
                        </div>
                        <div className="col-lg-2 iris_footer_1 wd3">
                            <h6>{_fooTxt.contactus}</h6>
                            <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                                <tbody>
                                    <tr>
                                        <td width="10%" valign="middle">
                                            <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_7.png"} alt="" title="" />
                                        </td>
                                        <td width="90%" valign="middle">
                                            <p className="iris_add">+91-98100-456-567</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="10%" valign="middle">
                                            <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_8.png"} alt="" title="" />
                                        </td>
                                        <td width="93%" valign="middle">
                                            <p className="iris_add">
                                                <a href="mailto:info@iris-arabia.com" target="_top">info@iris-arabia.com</a>
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="10%" valign="middle">
                                            <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_9.png"} alt="" title="" />
                                        </td>
                                        <td width="93%" valign="middle">
                                            <p className="iris_add">{_fooTxt.livechat}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-lg-2 iris_footer_1 wd4">
                            <h6>{_fooTxt.follow}</h6>
                                <ul className="iris_footer_socials">
                                    <li><a href="https://www.facebook.com/" onClick={e => e.preventDefault()}><img src={global.BASE_URL + "assets/img/facebook.png"} alt="" title="" /></a></li>
                                    <li><a href="https://www.instagram.com/" onClick={e => e.preventDefault()}><img src={global.BASE_URL + "assets/img/instagram.png"} alt="" title="" /></a></li>
                                    <li><a href="https://twitter.com/" onClick={e => e.preventDefault()}><img src={global.BASE_URL + "assets/img/twitter.png"} alt="" title="" /></a></li>
                                </ul>
                            <br/>
                            <h6>{_fooTxt.weaccept}</h6>
                            <img id="paymentIcon_FT" src={global.BASE_URL + "assets/img/paytabs-logo.png"} alt="" title="" />
                        </div>
                        <div className="col-lg-2 iris_footer_1 wd3">
                            <h6>{_fooTxt.download}</h6>
                            <img src={global.BASE_URL + "assets/img/iris_play_store.png"} alt="" style={{minWidth:'78%'}} />
                            <br/>
                            <br/>
                            <img src={global.BASE_URL + "assets/img/iris_itunes.png"} alt="" style={{minWidth:'78%'}} />
                        </div>
                    </div>                    
                </section>
            </footer>      
        )
    }
}