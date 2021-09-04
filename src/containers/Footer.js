import React, { Component } from 'react';

// Lang Json Start
import enLang from '../translations/en.json';
import arLang from '../translations/ar.json';

import Collapsible from 'react-collapsible';


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

export default class Footer extends Component{
    render()
    {
        return (
            <footer className="footer">
                <section className="iris_app_info">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-1 iris_new_footer_1">
                                <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_1.png"} alt="" title="" />
                                <span>{_fooTxt.trackorder}</span>
                            </div>
                            <div className="col-lg-1 iris_new_footer_1">
                                <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_2.png"} alt="" title="" />
                                <span>{_fooTxt.contactus}</span>
                            </div>
                            <div className="col-lg-6 iris_new_footer_2">
                                <p>{_fooTxt.footerpage.title_a}</p>
                                <h6><a href="mailto:support@irisboutique.com" target="_top">support@irisboutique.com</a></h6>
                                <p>{_fooTxt.footerpage.title_b}</p>
                            </div>
                            <div className="col-lg-3 iris_new_footer_2">
                                <p>{_fooTxt.footerpage.title_c}</p>
                                <h6>0124-444-5800</h6>
                                <p>10:00 am to 7:00 pm</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="iris_footer">
                    <div className="container">
                        <div className="row">
                            <div className="Footer_specification_div iris_footer_new_3 wd1">

                                <div className="specification_inner_div">
                                    <div className="responsive_width">
                                       <div className="d-flex align-items-center ">
                                          <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_3.png"} alt="icon"/>
                                          <p>{_fooTxt.footerpage.quality}</p>
                                       </div>
                                    </div>
                                    <div className="responsive_width">
                                       <div className="d-flex align-items-center">
                                         <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_4.png"} alt="icon"/>
                                         <p>{_fooTxt.footerpage.secure}</p>
                                       </div>
                                    </div>
                                </div>
                                <div className="specification_inner_div">
                                <div className="responsive_width">
                                    <div className="d-flex align-items-center">
                                       <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_5.png"} alt="icon"/>
                                       <p>{_fooTxt.footerpage.returns}</p>
                                    </div>
                                </div>
                                    <div className="responsive_width">
                                       <div className="d-flex align-items-center">
                                        <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_6.png"} alt="icon"/>
                                        <p>{_fooTxt.footerpage.cash}</p>
                                      </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-lg-2 col-sm-6 col-6 for_desktop iris_footer_new_4 wd2">
                                <h6>{_fooTxt.Products}</h6>
                                <ul>                                    
                                    <li><a href={global.BASE_URL + "eyeglasses"}>{_fooTxt.eyeglass}</a></li>
                                    <li><a href={global.BASE_URL + "sunglasses"}>{_fooTxt.sunglass}</a></li>
                                    <li><a href={global.BASE_URL + "contact-lenses"}>{_fooTxt.contactlens}</a></li>
                                </ul>
                            </div>
                            <div className=" col-lg-2 col-sm-6 col-6 for_desktop iris_footer_new_4 wd2">
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
                            <div className=" col-lg-2 col-sm-6 col-6 for_desktop iris_footer_1 wd3">
                                <h6>{_fooTxt.contactus}</h6>
                                <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                                <tbody>
                                    <tr>
                                        <td width="10%" valign="middle"> 
                                            <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_7.png"} alt="" title="" />
                                        </td>
                                        <td width="90%" valign="middle">
                                            <p className="iris_add">	
                                                +91-98100-456-567
                                            </p>
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
                            <div className=" col-lg-2 col-sm-6 col-6 for_desktop iris_footer_1 wd4">
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
                            <div className=" col-lg-2 col-sm-6 col-6 for_desktop iris_footer_1 wd3">
                                <h6>{_fooTxt.download}</h6>
                                <a href="https://irisboutiq.com/apk/IRIS.apk" target="_blank"><img src={global.BASE_URL + "assets/img/iris_play_store.png"} alt="app" style={{'minWidth':'78%'}} /></a>
                                <br/><br/>
                                <img src={global.BASE_URL + "assets/img/iris_itunes.png"} alt="app" style={{'minWidth':'78%'}} />
                            </div>
                        </div>
                    </div>

                    <div className="for_mobile">
                        <div className="container-fluid">
                        <Collapsible trigger={_fooTxt.Products}>
                                 <ul>                                    
                                    <li><a href={global.BASE_URL + "eyeglasses"}>{_fooTxt.eyeglass}</a></li>
                                    <li><a href={global.BASE_URL + "sunglasses"}>{_fooTxt.sunglass}</a></li>
                                    <li><a href={global.BASE_URL + "contact-lenses"}>{_fooTxt.contactlens}</a></li>
                                </ul>
                        </Collapsible>
                        <Collapsible trigger={_fooTxt.footerpage.usefull}>
                        <ul>                                    
                                    <li><a href={global.BASE_URL + "return-policy"}>{_fooTxt.returnpolicy}</a></li>
                                    <li><a href={global.BASE_URL + "term-condition"}>{_fooTxt.termcon}</a></li>
                                    <li><a href={global.BASE_URL + "cancel-return-policy"}>{_fooTxt.cancelreturnpolicy}</a></li>
                                    <li><a href={global.BASE_URL + "warranty-policy"}>{_fooTxt.warrantypolicy}</a></li>
                                    <li><a href={global.BASE_URL + "privacy-policy"}>{_fooTxt.privacypolicy}</a></li>
                                    <li><a href={global.BASE_URL + "about-us"}>{_fooTxt.about}</a></li>
                                    <li><a href={global.BASE_URL + "faq"}>{_fooTxt.faq}</a></li>
                                </ul>
                        </Collapsible>
                        <Collapsible trigger={_fooTxt.contactus}>
                                 <ul>                                    
                                    <li className="d-flex"><img src={global.BASE_URL + "assets/img/iris_new_footer_icon_7.png"} alt="" title="" className="small_ico" />
                                      <p className="iris_add">+91-98100-456-567</p>
                                    </li>
                                    <li className="d-flex">
                                    <img src={global.BASE_URL + "assets/img/iris_new_footer_icon_8.png"} alt="" title="" className="small_ico" />
                                    <p className="iris_add">	
                                                <a href="mailto:info@iris-arabia.com" target="_top">info@iris-arabia.com</a>
                                            </p>                                    </li>
                                    <li className="d-flex"><img src={global.BASE_URL + "assets/img/iris_new_footer_icon_9.png"} alt="" title=""  className="small_ico" />
                                    <p className="iris_add">{_fooTxt.livechat}</p>
                                    </li>
                                  
                                </ul>
                        </Collapsible>
                        <Collapsible trigger={_fooTxt.follow}>
                        <ul className="iris_footer_socials">
                                    <li><a href="https://www.facebook.com/" onClick={e => e.preventDefault()}><img src={global.BASE_URL + "assets/img/facebook.png"} alt="" title="" /></a></li>
                                    <li><a href="https://www.instagram.com/" onClick={e => e.preventDefault()}><img src={global.BASE_URL + "assets/img/instagram.png"} alt="" title="" /></a></li>
                                    <li><a href="https://twitter.com/" onClick={e => e.preventDefault()}><img src={global.BASE_URL + "assets/img/twitter.png"} alt="" title="" /></a></li>
                                </ul>
                        </Collapsible>
                        <Collapsible trigger={_fooTxt.download}>
                        <a href="https://irisboutiq.com/apk/IRIS.apk" target="_blank"><img src={global.BASE_URL + "assets/img/iris_play_store.png"} alt="app" style={{'minWidth':'48%'}} /></a>
                                <br/><br/>
                                <img src={global.BASE_URL + "assets/img/iris_itunes.png"} alt="app" style={{'minWidth':'48%'}} />
                        </Collapsible>
                        </div>
                    </div>

                    
                </section>
            </footer>       
        )
    }
}