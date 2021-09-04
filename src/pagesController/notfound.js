import React, { Component } from 'react'
import { Helmet } from 'react-helmet';

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

let _notfoundTxt = '';
if(global.lang == 'en'){
    _notfoundTxt = enLang.notfoundpage;
}
else{
    _notfoundTxt = arLang.notfoundpage;
}

class Notfound extends Component {
    render () {
        return (
            <div className="container">
                <Helmet>
                    <title>Iris Boutiq | Error 404</title>
                    <meta name="description" content="Iris Boutiq | Error 404" />
                    <meta name="keywords" content="Iris Boutiq | Error 404" />
                </Helmet>
                <div className="std">
                    <div className="no-route">
                        <div className="row damn">
                            <div className="col-xs-6 damn-title">
                            <h1>{_notfoundTxt.error}</h1></div>
                            <div className="col-xs-6">
                                <img src={global.BASE_URL+"assets/img/404-new.png"} alt="not-found"/>
                            </div>
                        </div>
                        <div className="row text-center">
                            <div className="damn-text">{_notfoundTxt.text_a} <a href={global.BASE_URL}>{_notfoundTxt.clicktext}</a> {_notfoundTxt.text_b}</div>
                        </div>                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Notfound