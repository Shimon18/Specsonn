import React from 'react'
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

export default class weightGroupMD extends React.Component {
    render() {
        return (            
            <div className="modal-body">
                <p>{_prlTxt.modalweightgroup.line_a}<br/> {_prlTxt.modalweightgroup.line_b}</p>
                <br/>
                <ul>
                    <li><p>{_prlTxt.modalweightgroup.line_c}</p></li>
                    <li><p>{_prlTxt.modalweightgroup.line_d}</p></li>
                    <li><p>{_prlTxt.modalweightgroup.line_e}</p></li>
                    <li><p>{_prlTxt.modalweightgroup.line_f}</p></li>
                </ul>
                <br/>
                <p>{_prlTxt.modalweightgroup.line_g}</p>
            </div>
            )
        }    
}
