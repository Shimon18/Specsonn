import React from 'react';

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

export default class LensPowersModal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            modalContent : props._modalPower_tabsData,
            modalTitle : props._modalPower_Titles,
            modalTabActivation : props.modalTabActivation,
        }
    }

    componentDidMount(){  
        //alert(this.state.dataBind);
    }

    render(){
        return(
            <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{_prlTxt.lensforwithpower}</h5>
                            <button type="button" className="close" onClick={this.props.closeModalHandler}>
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body row iris_addcart_content">
                            <div className="lenstab">
                                <ul className="nav nav-tabs" role="tablist">
                                    {this.state.modalTitle}                               
                                </ul>
                            </div>
                            
                            <div className="lens-details-wrap Single-Vision Bifocal ZERO-Power active">
                                <ul className="sliderTab">
                                    {this.state.modalContent}                                        
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}