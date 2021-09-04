import React from 'react'
import {PostData} from '../service/postData';
import Footer from '../containers/Footer';
import { toast } from "react-toastify";
import Modal from 'react-modal';
import {userSessionManage} from '../_commonFunction/userIrisSession';
import { Helmet } from 'react-helmet';

import ReortAnIssueOrderModal from '../_productDetailsModal/reportAnIssueOrder';
import TrackOrderModal from '../_productDetailsModal/trackOrder';
import CancelOrderModal from '../_productDetailsModal/cancelOrder';

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

let hideCartDiv = 'hiddenData';
let hideEmptyDiv = 'hiddenData';
let _loader = 'glb-ldr-prt active';

class userDashboardOrders extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            error: null,
            isLoggedin : true,
            redirect : false,
            userId : _userId,
            orderArray : [],
            precArray : [], 
            modalIsOpen_DFO : false,
            _modalTitle : '',
            _modalKey:'',
            _modalIds : '',
            _orderId: 0,
            _infoId:0,
            _orderPos : '',
        }
    }

    componentDidMount ()
    {
        let _url_GetData = global.userOrderList+'?country_Id='+localStorage.getItem('countryId')+'&language_Id='+localStorage.getItem('languageId')+'&userId='+_userId;
        PostData(_url_GetData,'','GET').then(result => {
            let responseJson = result;

            let _url_GetData = global.userDetail+'?uid='+_userId;
            PostData(_url_GetData,'','GET')
            .then(result => {
                userSessionManage(localStorage,result.response[0],'startSession');
            })

            if(responseJson.success === false)
            {  
                hideCartDiv = 'hiddenData';
                hideEmptyDiv = '';
                this.setState({isLoaded:true});                
            }
            else
            {
                hideCartDiv = '';
                hideEmptyDiv = 'hiddenData';
                let _orderArray = responseJson.response;                
                this.setState({orderArray:_orderArray,isLoaded:true});               
            }             
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
    
    loadOrderListing(){        
        if(this.state.isLoaded === true)
        {
            let _orderDetails = this.state.orderArray;
            let dataOrdr = [];
            //console.log(_orderDetails);
            if(_orderDetails.length > 0)
            {
                hideCartDiv = '';
                hideEmptyDiv = 'hiddenData'; 
            }

            if(_orderDetails.length > 0)
            {                          
                _orderDetails.map((ordrDatas, i) =>
                {
                    let ordrItmData = ordrDatas.orderItems;
                    let _j = 98;
                    ordrItmData.map((ordrData, i) =>
                    {
                        _j = ordrData.orderItemId;
                        let _uploadPres = 'NA';
                        var _getPrescripton = '';
                        let _prescriptonChk = ordrData.prescriptionData;
                        
                        if(_prescriptonChk.length > 0)
                        {
                            _getPrescripton = _prescriptonChk.filter(item => (item.info_Id == ordrData.orderItemId && item.order_Id == ordrData.order_Id));
                            
                            if(_getPrescripton[0] != undefined || _getPrescripton[0] != null && ordrData.lens_Id > 0)
                            {
                                _uploadPres = 'YUP';
                            }
                        }                    
                        
                        let _dtt = ordrData.order_Date;
                        let _expData = ordrData.expected_days;
                        var dateOffset = (24*60*60*1000) * parseInt(_expData); //5 days
                        var myDate = new Date(new Intl.DateTimeFormat('en-US', options).format(_dtt));
                        let _expDate = myDate.setTime(myDate.getTime() + dateOffset);                
                        
                        var options = {year: 'numeric', month: 'long', day: 'numeric' };
                        var optionsNormal = {year: 'numeric', month: 'numeric', day: 'numeric'};

                        let _orderPropsTrack = [];
                        var objTrak = {
                        'place' : new Intl.DateTimeFormat('en-US',optionsNormal).format(_dtt),
                        'inprocess' : ordrData.inprocess,
                        'indispatch' : ordrData.indispatch,
                        'incancel' : ordrData.incancel,
                        'incomplete' : ordrData.incomplete,
                        'orderPos' : ordrData.order_Status
                        }
                        _orderPropsTrack.push(objTrak);
                        
                        let _active = '';                    
                        let _total = Number(ordrData.lens_afterDiscount) + Number(ordrData.frame_afterDiscount);

                        let _buttons = [];

                        if((ordrData.lens_Id > 0 && ordrData.lensPower_Type == '3') || (ordrData.lens_Id > 0 && ordrData.productType_Id == '2'))
                        {
                            if(_uploadPres === 'YUP')
                            {
                                _buttons.push(<li key={ordrData.orderItemId}><a className="disabledBtn" href="na" onClick={e => e.preventDefault()}><i className="fas fa-upload"></i>&nbsp;{_prlTxt.addprescpage.uploadpresc}</a></li>)
                            }
                            else{
                                _buttons.push(<li key={ordrData.orderItemId}><a href={global.BASE_URL+"customer-orders-prescription?token=12174800"+ordrData.orderItemId} target="_blank"><i className="fas fa-upload"></i>&nbsp;{_prlTxt.addprescpage.uploadpresc}</a></li>)
                            }                        
                        }

                        let _IndicateArea = [];
                        if(_uploadPres === 'YUP')
                        {
                            let _notifyt = '';
                            if(_getPrescripton[0].image_precId > 0 && _getPrescripton[0].image_New == 0)
                            {
                                _notifyt = 'You have uploaded a copy of prescription from your saved prescriptions. Click here to change it.';
                            }
                            else if(_getPrescripton[0].req_Call > 0)
                            {
                                _notifyt = 'You have scheduled a call back for your prescription. Click here to change it.';
                            }
                            else if(_getPrescripton[0].req_Mail > 0)
                            {
                                _notifyt = 'You have sent us an email for your prescription. Click here to change it.';
                            }
                            else if(_getPrescripton[0].doLater > 0)
                            {
                                _notifyt = 'You have not uploaded your prescription yet, please upload.';
                            }
                            else if(_getPrescripton[0].image_New == 1)
                            {
                                _notifyt = 'You have uploaded your prescription. Click here to change it';
                            }                        
                            else{
                                _notifyt = 'You have uploaded your prescription manually. Click here to change it.';
                            }

                        _IndicateArea.push(<div key={87} className="notifyTxt"><a href={global.BASE_URL+"customer-orders-prescription?token=12174800"+ordrData.orderItemId} target="_blank">{_notifyt}</a></div>)
                        }

                        let _paid = 'Cash - Paid';
                        let _status = 'Delivered';
                        let _hideCanReq = '';
                        let _hideIssReq = '';
                        let _hideIssTrc = '';
                        if(ordrData.order_Status == 'PLACED'){
                            _status = 'Order Placed';
                            _paid = 'COD - Unpaid';
                        }
                        else if(ordrData.order_Status == 'INHOUSEPROCESS'){
                            _status = 'In-Process';
                            _hideCanReq = 'hiddenData';
                            _paid = 'COD - Unpaid';
                        }
                        else if(ordrData.order_Status == 'DISPATCHED'){
                            _status = 'Dispatched';
                            _hideCanReq = 'hiddenData';
                            _paid = 'COD - Unpaid';
                        }
                        else if(ordrData.order_Status == 'CANCELED'){
                            _status = 'Cancelled';
                            _hideCanReq = 'hiddenData';
                            _hideIssReq = 'hiddenData';
                            _hideIssTrc = 'hiddenData';
                            _paid = 'COD';
                            _buttons = [];
                        }
                        else{
                            _hideCanReq = 'hiddenData';
                            _hideIssReq = 'hiddenData';
                            _buttons = [];
                        }

                        let _lensName = 'NA';
                        if(ordrData.lens_Id > 0){
                            _lensName = ordrData.lens_name+' ('+ordrData.lens_type+')';
                        }

                        //console.log(ordrData.order_PaymentVia);
                        
                        if(ordrData.order_PaymentVia == 'CARD'){
                            _paid = 'Pay By Card (Paid)';
                        }

                        let _requestArea = [];
                        let _cancelArea = [];
                        let _requestData = ordrData.orderRequest;
                        if(_requestData.length > 0){
                            for(let _x = 0; _x < _requestData.length;_x++){
                                if(_requestData[_x].request_type == 'ReportRequest'){
                                    _hideIssReq = 'hiddenData';

                                    _requestArea.push(<div className="notifyTxt" key={_x}><span id="typeTitl">{_prlTxt.orderpage.reportrequest} </span><span id="typeRe">{_requestData[_x].request_reason} : </span>{_requestData[_x].request_message}</div>);
                                }
                                if(_requestData[_x].request_type == 'CancelRequest'){
                                    _hideCanReq = 'hiddenData';

                                    _cancelArea.push(<div className="notifyTxt" key={_x}><span id="typeTitl">{_prlTxt.orderpage.cancelrequest} </span><span id="typeRe">{_requestData[_x].request_reason} : </span>{_requestData[_x].request_message}</div>);
                                }
                            }
                        }
                        //console.log(_hideIssTrc+'------'+_status);
                        dataOrdr.push (
                            <div key={_j} className="iris_my_order_box">
                                <div className="row iris_my_order_head">
                                    <div className="col-lg-8"><span className="iris_mo_title">{ordrData.name}</span></div>
                                    <div className="col-lg-2"><a className="iris_order_status" id={_status}>{_status}</a></div>
                                    <div className="col-lg-2">
                                        <ul className="iris_order_rating">
                                            <li><i className="fas fa-star"></i></li>
                                            <li><i className="fas fa-star"></i></li>
                                            <li><i className="fas fa-star"></i></li>
                                            <li><i className="fas fa-star-half-alt"></i></li>
                                            <li><i className="far fa-star"></i></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="row iris_my_order1">
                                    <div className="col-lg-3">
                                        <div className="iris_mod_img">
                                            <div className="wrapperSmall">
                                                <div className="block"><img src={ordrData.product_image} alt={ordrData.name} className="block__pic"/></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-9">
                                        <div className="row">
                                        <div className="col-lg-12 iris_div_4" style={{padding:'0'}}>
                                                <div className="iris_mo_price"><img src={global.BASE_URL + "assets/img/order_id_icon.png"} alt="" title="" />
                                                    <p>{_prlTxt.orderpage.orderTitle} <span>#{ordrData.order_Id} </span>
                                                    (<span>{_prlTxt.orderpage.orderAmountPaid} {ordrData.currencyCode+' '+ordrDatas.order_amountPaid}</span>)</p>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 iris_div_4" style={{padding:'0'}}>
                                                <div className="iris_mo_price"><img src={global.BASE_URL + "assets/img/iris_name_icon.png"} alt="" title="" />
                                                    <p>{_prlTxt.orderpage.name} <span>{ordrData.user_firstName+' '+ordrData.user_lastName}</span> ( {_prlTxt.orderpage.orderPaidVia} <span>{_paid}</span>)</p>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 iris_div_2" style={{paddingLeft:'0'}}>
                                                <div className="iris_mo_price"><img src={global.BASE_URL + "assets/img/price_icon.png"} alt="" title="" />
                                                    <p>{_prlTxt.orderpage.price} <span>{ordrData.currencyCode+' '+_total}<span id="numQty"> (Qty*{ordrData.quantity})</span></span></p>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </div>
                                            <div className="col-lg-8 iris_div_3" style={{padding:'0'}}>
                                                <div className="iris_mo_price"><img src={global.BASE_URL + "assets/img/iris_lens_icon.png"} alt="" title="" />
                                                    <p>{_prlTxt.orderpage.lens} <span>{_lensName}</span></p>
                                                    <div className="clearfix"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="iris_mo_date">
                                            <div className="iris_mo_date_1"><img src={global.BASE_URL + "assets/img/iris_calendar_icon.png"} alt="" title="" />
                                                <p>{_prlTxt.orderpage.orderdate} <span>{new Intl.DateTimeFormat('en-US', options).format(_dtt)}</span></p>
                                                <div className="clearfix"></div>
                                            </div>
                                            <div className="iris_mo_date_1 iris_mo_date_1A"><img src={global.BASE_URL + "assets/img/iris_calendar_icon.png"} alt="" title="" />
                                                <p>{_prlTxt.orderpage.deliverydate} <span>{new Intl.DateTimeFormat('en-US', options).format(_expDate)}</span></p>
                                            </div>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="iris_mo_add"><img src={global.BASE_URL + "assets/img/location_icon.png"} alt="" title="" />
                                            <p>{_prlTxt.orderpage.deliveryadd} <span>{ordrData.user_address+', '+ordrData.user_city+', '+ordrData.user_zipCode}</span></p>
                                            <div className="clearfix"></div>
                                        </div>
                                        <div className="iris_mo_btns">
                                            <ul>
                                                <li id={_hideIssTrc}><a href="#track" onClick={e => e.preventDefault(),this.openModalHandler.bind(this, "trackOrder",ordrData.order_Id,ordrData.orderItemId,_orderPropsTrack)}><i className="fas fa-file-contract"></i>&nbsp;{_prlTxt.orderpage.trackorder}</a></li>
                                                <li id={_hideCanReq}><a href="#canel" onClick={e => e.preventDefault(),this.openModalHandler.bind(this, "cancelOrder",ordrData.order_Id,ordrData.orderItemId,ordrData.order_Status)}><i className="fas fa-times"></i>&nbsp;{_prlTxt.orderpage.ordercancel}</a></li>
                                                <li id={_hideIssReq}><a href="#report" onClick={e => e.preventDefault(),this.openModalHandler.bind(this, "reportAnOrder",ordrData.order_Id,ordrData.orderItemId,ordrData.order_Status)}><i className="fas fa-file-signature"></i>&nbsp;{_prlTxt.orderpage.reportissue}</a></li>
                                                {_buttons}                                            
                                            </ul>                                        
                                        </div>
                                        {_cancelArea}
                                        {_requestArea}
                                        {_IndicateArea}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                })
            }
            return dataOrdr;
        }
    }

    openModalHandler(value,id,infoId,poss){
        let _modalIdsData = '';
        let _modalIdsTitle = '';
        if(value === 'trackOrder')
        {
            _modalIdsData = 'iris_track_order_modal';
            _modalIdsTitle = _prlTxt.orderpage.trackorder;
        }
        else if(value === 'cancelOrder')
        {
            _modalIdsData = 'iris_cancel_order_modal';
            _modalIdsTitle = _prlTxt.orderpage.ordercancel;
        }
        else if(value === 'reportAnOrder')
        {
            _modalIdsData = 'iris_report_issue_modal';
            _modalIdsTitle = _prlTxt.orderpage.reportissue;
        }
        this.setState({
            modalIsOpen_DFO: true,
            _modalKey: value,
            _modalIds: _modalIdsData,
            _modalTitle: _modalIdsTitle,
            _orderId : id,
            _infoId : infoId,
            _orderPos : poss
        });
    }

    closeModalHandler = () => {
        this.setState({
            modalIsOpen_DFO: false,
        });
    }

    renderModalData = () =>{
        if(this.state._modalKey === 'trackOrder'){
            return (
                <TrackOrderModal orderId={this.state._orderId} infoId={this.state._infoId} orderPos={this.state._orderPos}/>
            )
        }
        else if(this.state._modalKey === 'cancelOrder')
        {
            return (
                <CancelOrderModal orderId={this.state._orderId} infoId={this.state._infoId} orderPos={this.state._orderPos}/>
            )
        }
        else if(this.state._modalKey === 'reportAnOrder')
        {
            return (
                <ReortAnIssueOrderModal orderId={this.state._orderId} infoId={this.state._infoId} orderPos={this.state._orderPos}/>
            )
        }
    }

    render() {
        if(this.state.isLoaded == true){
            _loader = 'glb-ldr-prt';
        }

        if (this.state.redirect)
        {            
            window.location.href = global.BASE_URL+'sign-in/';
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>Customer Orders | IRIS Boutiq</title>
                    <meta name="description" content="Customer Orders | IRIS Boutiq"/>
                    <meta name="keywords" content="Customer Orders | IRIS Boutiq" />
                </Helmet>
                {/* User Order Begins */}
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
                                        <a href={global.BASE_URL+"customer-orders"} className="active"><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_orders}</a>
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
                            <div className="iris_my_account_right_container" id={hideCartDiv}>
                                {this.loadOrderListing()}
                                <div className="iris_space_1">&nbsp;</div>
                            </div>
                            <div className="orderEmpty" id={hideEmptyDiv}>
                                <div className="col-md-12 alert alert-warning">{_prlTxt.orderpage.noorder}</div>
                            </div>
                        </div>                        
                    </div>
                </section>               
                {/* User Order Box Ends */}
                <Footer />
                <div id="global_loader" className={_loader}>
                    <div className="gl-ldr-cld">
                        <img id="loaderIcon" src={global.BASE_URL+'assets/img/loaderx.gif'} />
                    </div>
                </div>

                {/* Modal for Fream Size Begins */}
                <Modal isOpen={this.state.modalIsOpen_DFO} onRequestClose={this.closeModalHandler} id={this.state._modalIds}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.state._modalTitle}</h5>
                                <button type="button" className="close" onClick={this.closeModalHandler}>
                                    <span aria-hidden="true">×</span>
                                </button>
                                <div className="clearfix"></div>
                            </div>
                            {this.renderModalData()}
                        </div>
                    </div>    
                </Modal>                
                {/* Modal for Fream Size Ends */}
            </React.Fragment>
        )
    }
}
        
export default userDashboardOrders