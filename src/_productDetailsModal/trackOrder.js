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

export default class trackOrderModal extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let _complete = 'disabled';
        let _dispatch = 'disabled';
        let _process = 'disabled';
        let _placed = 'disabled';
        
        let _orderData = this.props.orderPos[0];
        let _dateComplete = _orderData.place;
        let _datePlace = _orderData.place;
        let _dateInprocss = _orderData.place;
        let _dateDispatch = _orderData.place;

        if(_orderData.orderPos == 'COMPLETED'){
            _complete = 'complete';
            _dispatch = 'complete';
            _process = 'complete';
            
            _datePlace = _orderData.place;
            _dateInprocss = _orderData.inprocess;
            _dateDispatch = _orderData.indispatch;
            _dateComplete = _orderData.incomplete;

            if(_orderData.incomplete == '0'){
                _dateDispatch = _orderData.place;
                _dateInprocss = _orderData.place;
                _dateComplete = _orderData.place;
            }
        }
        else if(_orderData.orderPos == 'PLACED'){
            _placed = 'active';
            _datePlace = _orderData.place;
            _dateInprocss = '';_dateComplete = '';_dateDispatch = '';
        }
        else if(_orderData.orderPos == 'INHOUSEPROCESS'){
            _placed = 'complete';
            _process = 'active';
            _dateInprocss = _orderData.inprocess;
            _datePlace = _orderData.place;
            if(_orderData.inprocess == '0'){
                _dateInprocss = _orderData.place;
            }
            _dateComplete = '';_dateDispatch = '';
        }
        else if(_orderData.orderPos == 'DISPATCHED'){
            _placed = 'complete';
            _process = 'complete';
            _dispatch = 'active';
            
            _datePlace = _orderData.place;
            _dateInprocss = _orderData.inprocess;
            _dateDispatch = _orderData.indispatch;
            if(_orderData.indispatch == '0'){
                _dateDispatch = _orderData.place;
                _dateInprocss = _orderData.place;
            }
            _dateComplete = '';
        }
        else{
            _placed = 'active';
        }
        return (            
            <div className="modal-body">
                <div className="row bs-wizard" style={{borderBottom:'0'}}>
                    <div className="col-lg-3 bs-wizard-step complete">
                        <div className="text-center bs-wizard-stepnum">{_prlTxt.orderpage.orderplaced}</div>
                        <div className="progress">
                            <div className="progress-bar"></div>
                        </div>
                        <a href="JavaScript:Void(0);" className="bs-wizard-dot"></a>
                        <div className="bs-wizard-info text-center">{_datePlace}</div>
                    </div>
                    <div className={"col-lg-3 bs-wizard-step "+_process}>
                        <div className="text-center bs-wizard-stepnum">{_prlTxt.orderpage.orderprocess}</div>
                        <div className="progress">
                            <div className="progress-bar"></div>
                        </div>
                        <a href="JavaScript:Void(0);" className="bs-wizard-dot"></a>
                        <div className="bs-wizard-info text-center">{_dateInprocss}</div>
                    </div>
                    <div className={"col-lg-3 bs-wizard-step "+_dispatch}>
                        <div className="text-center bs-wizard-stepnum">{_prlTxt.orderpage.orderdispa}</div>
                        <div className="progress">
                            <div className="progress-bar"></div>
                        </div>
                        <a href="JavaScript:Void(0);" className="bs-wizard-dot"></a>
                        <div className="bs-wizard-info text-center">{_dateDispatch}</div>
                    </div>
                    <div className={"col-lg-3 bs-wizard-step "+_complete}>
                        <div className="text-center bs-wizard-stepnum">{_prlTxt.orderpage.orderdeliver}</div>
                        <div className="progress">
                            <div className="progress-bar"></div>
                        </div>
                        <a href="JavaScript:Void(0);" className="bs-wizard-dot"></a>
                        <div className="bs-wizard-info text-center">{_dateComplete}</div>
                    </div>
                </div>
            </div>
            )
        }    
}
