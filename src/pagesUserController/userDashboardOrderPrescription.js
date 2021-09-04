import React from 'react'
import {PostData} from '../service/postData';
import Footer from '../containers/Footer';
import { toast } from "react-toastify";
import Modal from 'react-modal';
import ModalImage from 'react-modal-image';
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


var FormData = require('form-data');
var fs = require('fs');


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

let _imgPath = '';
let hideCartDiv = 'hiddenData';
let hideEmptyDiv = '';

class userDashboardOrdersPrescription extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            error: null,

            dropShpirical_r : null,
            dropClinder_r : null,
            dropAxis_r : null,
            dropShpirical_l : null,
            dropClinder_l : null,
            dropAxis_l : null,
            dropPD_l : null,

            userPrescriptions:[],
            isLoggedin : true,
            redirect : false,
            userId : _userId,
            orderArray : [],
            _orderItemId : 0,
            _orderId : 0,
            _orderProduct_Id : 0,
            _user_Id:0,
            modalIsOpen_Prescription_Im:false,
            modalIsOpen_Prescription_FM:false,
            modalIsOpen_Call_REQ:false,
            modalIsOpen_Email_REQ:false,
            modalIsOpen_Prescription_OLD:false,
            file_IM: null,
            imagePreviewUrl: '',

            sph_right:'0.00',
            sph_left:'0.00',
            cyl_right:'Please Select',
            cyl_left:'Please Select',
            axis_right: 'Please Select',
            axis_left: 'Please Select',
            pd_left: 'Please Select',
            box_right: '1',
            box_left: '1',
            errors: {
                file_IM: ''
            }
        }
    }

    componentDidMount ()
    {
        const paramerters = new URLSearchParams(this.props.location.search);
        let guestOrderId = paramerters.get('token');
        let _listing = {};

        if(guestOrderId === undefined || guestOrderId === null)
        {
            window.location.href = global.BASE_URL+'customer-orders';
        }

        let _arry = guestOrderId.split('12174800');
        if(_arry[1] === undefined || _arry[1] === null)
        {
            window.location.href = global.BASE_URL+'customer-orders';
        }
        else{
            guestOrderId = _arry[1];
        }

        document.getElementById('headerContainer').innerHTML = '';

        let _url_GetData = global.userOrderData+'?orderId='+guestOrderId;
        PostData(_url_GetData,'','GET').then(result => {            
            let _listingPresc = {};
            let _listing = {};
            
            let _urlData = global.userPrescriptionDetails+'?user_Id='+_userId;
            PostData(_urlData,'','GET').then((precData) => {
                if(precData.success === true)
                {
                    _listingPresc = precData.response;
                    _imgPath = precData.imgPath;                    
                }
                let responseJson = result;
                _listing = responseJson.response[0];
                this.setState({orderArray:_listing,isLoaded:true,_orderItemId:guestOrderId,_orderId:responseJson.response[0].order_Id,_orderProduct_Id:responseJson.response[0].product_Id,_user_Id:responseJson.response[0].user_Id,userPrescriptions:_listingPresc,userIds:_userId});
            });            
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
    
    closeModal = () => {
        this.setState({
            modalIsOpen_Prescription_Im: false,
            modalIsOpen_Prescription_FM:false,
            modalIsOpen_Email_REQ:false,
            modalIsOpen_Call_REQ:false,
            modalIsOpen_Prescription_OLD:false,
        });
    }

    openModalHandler(value){
        if(value === 'modalIsOpen_Call_REQ')
        {
            this.sendCallRequest();
        }
        else if(value === 'modalIsOpen_Email_REQ')
        {
            this.sendEmailRequest();
        }
        else if(value === 'doLater')
        {
            this.doLaterRequest();
            window.location.href = global.BASE_URL+"customer-orders";
            return;
        }
        this.setState({
            [value]: true
        });
    }

    onChangeFileUploadHandler=event=>{       
        let reader = new FileReader();
        let file = event.target.files[0];        
        let errors = this.state.errors;
        errors['file_IM'] = '';
        reader.onloadend = () => {
        this.setState({
            file_IM: file,
            imagePreviewUrl: reader.result,
            errors : errors
        });
        }
        reader.readAsDataURL(file);
    }

    uploadUserPrescriptionImage= (event) =>
    {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.file_IM == null || this.state.file_IM == undefined)
        {
            errors['file_IM'] = "*Please Upload Prescription.";
            this.setState({errors: errors});
        }
        else
        {
            var imageFormData = new FormData();
            imageFormData.append('image', this.state.file_IM);
            imageFormData.append('info_Id', this.state._orderItemId);
            imageFormData.append('order_Id', this.state._orderId);
            imageFormData.append('product_Id', this.state._orderProduct_Id);
            imageFormData.append('user_Id', this.state._user_Id);
                        
            new Promise((resolve, reject) =>{
                fetch(global.userOrderPrescriptionUpload, {
                    method:  'POST',
                    body: imageFormData
                })
            .then((response) => response.json())
            .then((res) => {
                if(res.success === true)
                {
                    toast.success('Preacription save successfully.');
                    window.location.href = global.BASE_URL+'customer-orders';
                }
                else
                {
                    toast.error('Preacription not updated. Please try again.');
                }
            })
            .catch((error) => {
                    //reject(error);
                });
            });
        }        
    }

    uploadUserPrescriptionImagePrevious(e,f,i){
        const postData = JSON.stringify({            
            info_Id : this.state._orderItemId,
            order_Id : this.state._orderId,
            product_Id : this.state._orderProduct_Id,
            image_precId : e,
            image_prec : f
        });
        PostData(global.userOrderPrescriptionPrevious, postData,'POST').then((result) => {
            let responseJson = result;
            if(result.success === true)
            {
                toast.success('Preacription call request save successfully.');
                window.location.href = global.BASE_URL+'customer-orders';
            }
            else
            {
                toast.success('Preacription not updated. Please try again.');
            }
        });
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        alert(name);
        switch (name) {
        case 'sph_right':         
        this.setState({sph_right:value});
        break;
        case 'sph_left':         
        this.setState({sph_left:value});
        break;
        case 'cyl_right':         
        this.setState({cyl_right:value});
        break;
        case 'cyl_left':         
        this.setState({cyl_left:value});
        break;
        case 'axis_right':         
        this.setState({axis_right:value});
        break;
        case 'axis_left':         
        this.setState({axis_left:value});
        break;
        case 'box_right':         
        this.setState({box_right:value});
        break;
        case 'box_left':         
        this.setState({box_left:value});
        break;
        case 'pd_left':         
        this.setState({pd_left:value});
        break;
        

        default:
        break;
        }
    }

    uploadUserPrescriptionForm = (event) =>{  
        
        let _cy_r = this.state.cyl_right;
        let _cy_l = this.state.cyl_left;
        let _ax_r = this.state.axis_right;
        let _ax_l = this.state.axis_left;
        if(this.state.cyl_right == 'Please Select'){
            _cy_r = '0';
        }
        if(this.state.cyl_left == 'Please Select'){
            _cy_l = '0';
        }
        if(this.state.axis_right == 'Please Select'){
            _ax_r = '0';
        }
        if(this.state.axis_left == 'Please Select'){
            _ax_l = '0';
        }

        const postData = JSON.stringify({
            sph_right: this.state.sph_right,
            sph_left: this.state.sph_left,
            cyl_right: _cy_r,
            cyl_left: _cy_l,
            axis_right: _ax_r,
            axis_left: _ax_l,
            box_right: this.state.box_right,
            box_left: this.state.box_left,
            pd_left: this.state.pd_left,
            info_Id : this.state._orderItemId,
            order_Id : this.state._orderId,
            product_Id : this.state._orderProduct_Id
        });
        PostData(global.userOrderPrescriptionFM, postData,'POST').then((result) => {
            let responseJson = result;
            if(result.success === true)
            {
                toast.success('Preacription save successfully.');
                window.location.href = global.BASE_URL+'customer-orders';
            }
            else
            {
                toast.success('Preacription not updated. Please try again.');
            }
        });
    }

    sendCallRequest = (event) => {
        const postData = JSON.stringify({            
            info_Id : this.state._orderItemId,
            order_Id : this.state._orderId,
            product_Id : this.state._orderProduct_Id,
            req_Call : '1'
        });
        PostData(global.userOrderPrescriptionCallRequest, postData,'POST').then((result) => {
            let responseJson = result;
            if(result.success === true)
            {
                toast.success('Preacription call request save successfully.');
                //window.location.href = global.BASE_URL+'customer-orders';
            }
            else
            {
                toast.success('Preacription not updated. Please try again.');
            }
        });
    }

    sendEmailRequest = (event) => {
        const postData = JSON.stringify({            
            info_Id : this.state._orderItemId,
            order_Id : this.state._orderId,
            product_Id : this.state._orderProduct_Id,
            req_Mail : '1'
        });
        PostData(global.userOrderPrescriptionCallRequest, postData,'POST').then((result) => {
            let responseJson = result;
            if(result.success === true)
            {
                toast.success('Preacription email send request save successfully.');
                //window.location.href = global.BASE_URL+'customer-orders';
            }
            else
            {
                toast.success('Preacription not updated. Please try again.');
            }
        });
    }

    doLaterRequest = (event) => {
        const postData = JSON.stringify({            
            info_Id : this.state._orderItemId,
            order_Id : this.state._orderId,
            product_Id : this.state._orderProduct_Id,
            doLater : '1'
        });
        PostData(global.userOrderPrescriptionCallRequest, postData,'POST').then((result) => {
            let responseJson = result;
            if(result.success === true)
            {
                toast.success('Preacription email send request save successfully.');
                //window.location.href = global.BASE_URL+'customer-orders';
            }
            else
            {
                toast.success('Preacription not updated. Please try again.');
            }
        });
    }

    previousPrescription(){
        if(this.state.isLoaded === true)
        {
            let _presDetails = this.state.userPrescriptions;
            let dataPresc = '';
            if(_presDetails.length > 0)
            {
                dataPresc = _presDetails.map((pres, i) =>
                {
                    let _filename = pres.user_prescription;
                    let _fileExt = _filename.split('.');
                    let _hideImg = 'text-art';
                    let _hidePd = '';
                    //console.log(_imgPath + pres.user_prescription);
                    if(_fileExt[1] == 'png' || _fileExt[1] == 'jpg' || _fileExt[1] == 'jpeg' || _fileExt[1] == 'gif'){
                        _hideImg = 'previewPrescImg';
                        _hidePd = 'text-art';
                    }

                    let _active = '';
                    return ( 
                        <div key={i} className="row col-lg-12 iris_myownh4A">
                            <div className="col-lg-4" style={{marginLeft: '50px',marginTop: '15px'}}>
                                <button className="previousUploadBtn" onClick={this.uploadUserPrescriptionImagePrevious.bind(this,pres.id,pres.user_prescription)}><i className="fas fa-upload"></i> Use This Prescripton</button>
                            </div>
                            <div className="col-lg-4" id={_hideImg} style={{marginLeft: '-50px',marginRight: '-50px',lineHeight: '50px'}}>
                                <ModalImage
                                    small={_imgPath + pres.user_prescription}
                                    large={_imgPath + pres.user_prescription}
                                    alt={pres.user_description}
                                    hideDownload={true}
                                    hideZoom={true}
                                />
                            </div>
                            <div className="iris_linkbox2" id={_hidePd} style={{'text-align': 'center','fontSize': '13px'}}>
                                <a href={_imgPath + pres.user_prescription} target="_blank" title="{pres.user_description}"><i className="fas fa-file-pdf"></i> Prescription File</a>
                            </div>

                            <div className="col-lg-4" style={{margin: '0px -35px',marginTop: '15px'}}>
                                <span><i style={{color: '#ebc668'}} className="fas fa-user"></i>&nbsp;&nbsp;{pres.user_title}</span>
                            </div>
                        </div>
                    )
                })
            }
            else{
                dataPresc = _prlTxt.prespuploadpage.msgprescupload;
            }
            return dataPresc;
        }
    }

    removePreviewImages(){
        this.setState({
            file_IM: null,
            imagePreviewUrl: ''
        });
    }

    openDropDown(e,f){
        if(e == 'spherical_r'){
            this.setState({dropShpirical_r : 'show'});
        }
        else if(e == 'cylinder_r'){
            this.setState({dropClinder_r : 'show'});
        }
        else if(e == 'axis_r'){
            this.setState({dropAxis_r : 'show'});
        }
        else if(e == 'spherical_l'){
            this.setState({dropShpirical_l : 'show'});
        }
        else if(e == 'cylinder_l'){
            this.setState({dropClinder_l : 'show'});
        }
        else if(e == 'axis_l'){
            this.setState({dropAxis_l : 'show'});
        }
        else if(e == 'pd_l'){
            this.setState({dropPD_l : 'show'});
        }
    }

    toggleItem = (e,f) =>{
        if(f == 'sp_r'){
            this.setState({sph_right : e});
        }
        else if(f == 'cy_r'){
            this.setState({cyl_right : e});
        }
        else if(f == 'ax_r'){
            this.setState({axis_right : e});
        }
        else if(f == 'sp_l'){
            this.setState({sph_left : e});
        }
        else if(f == 'cy_l'){
            this.setState({cyl_left : e});
        }
        else if(f == 'ax_l'){
            this.setState({axis_left : e});
        }
        else if(f == 'pd_l'){
            this.setState({pd_left : e});
        }
        this.handleMouseLeave();
    }

    getLimitsPositive(e,f){
        let _lis = [];
        for (var i = 0; i < e; i++) {
            if(i != 0){
                let _key = (i/4);
                _lis.push(<li onClick={() => this.toggleItem(_key,f)} key={_key}><div>+{_key}</div></li>);
            }            
        }
        return (
            <ul>{_lis}</ul>
        );
    }

    getLimitsNegtive(e,f){
        let _lis = [];
        for (var i = 0; i < e; i++) {
            if(i != 0){
                let _key = (i/4);
                _lis.push(<li onClick={() => this.toggleItem('-'+_key,f)} key={_key}><div>-{_key}</div></li>);
            }            
        }
        return (
            <ul>{_lis}</ul>
        );
    }

    getLimitsAxis(e,f){
        let _lis = [];
        for (var i = 0; i < e; i++) {
            if(i != 0){
                let _key = (i*5);
                _lis.push(<li onClick={() => this.toggleItem(_key,f)} key={_key}><div>{_key}</div></li>);
            }            
        }
        return (
            <ul>{_lis}</ul>
        );
    }

    getPDValue(e,f){
        let _lis = [];
        for (var i = e; i <= f; i++)
        {
            let _key = (i);
            _lis.push(<li onClick={() => this.toggleItem(_key,'pd_l')} key={i}><div>{_key}</div></li>);
            //_lis.push(<option value={i}>{i}</option>);
        }
        return (
            <ul>{_lis}</ul>
        );
    }

    handleMouseLeave = (event) =>{    
        this.setState({
            dropShpirical_r : 'hide',
            dropClinder_r : 'hide',
            dropAxis_r : 'hide',
            dropShpirical_l : 'hide',
            dropClinder_l : 'hide',
            dropAxis_l : 'hide',
            dropPD_l : 'hide',            
        });
    }

    render() {
        const {errors} = this.state;

        let {imagePreviewUrl} = this.state;
        let $imagePreview = [];
        if (imagePreviewUrl) {
            $imagePreview.push(<div key="12"><i onClick={this.removePreviewImages.bind(this)} className="fas fa-times" id="removeImgs"></i><img id="previewImage" src={imagePreviewUrl} /></div>);
        } else {
            $imagePreview.push(<div className="previewText" key="12">Please select an Image for Preview</div>);
        }
        
        if (this.state.redirect)
        {            
            window.location.href = global.BASE_URL+'sign-in/';
        }
        return (
            
            <React.Fragment>
                <Helmet>
                    <title>Upload Prescription | IRIS Boutiq</title>
                    <meta name="description" content="Upload Prescription | IRIS Boutiq"/>
                    <meta name="keywords" content="Upload Prescription | IRIS Boutiq" />
                </Helmet>
                {/* User Order Begins */}
                <section className="iris_PRSC_AFCHKT_1">
                    <div className="container">
                        <div className="row iris_border_2" align="center">
                            <div className="col-md-4">
                                <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                                    <tbody>
                                        <tr>
                                            <td width="15%">
                                                <img src={global.BASE_URL + "assets/img/thumbup.png"} alt="" />
                                            </td>
                                            <td width="85%">
                                                <span className="iris_txt_12C">{_prlTxt.prespuploadpage.thankfororder}</span>
                                                <img src={global.BASE_URL + "assets/img/main_logo_iris.png"} alt="" title="" width="210px" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-4">
                                <p className="iris_txt_12A">{_prlTxt.prespuploadpage.yourdetailfor}</p>
                                <p className="iris_txt_12B">{_prlTxt.prespuploadpage.ordernumber} 12174800{this.state._orderItemId}</p>
                                <p className="iris_txt_12A">{_prlTxt.prespuploadpage.captu}</p>
                            </div>
                            <div className="col-md-4">
                                <p className="iris_txt_12A">{_prlTxt.prespuploadpage.anyconcern}</p>
                                <p className="iris_txt_12B">(0) 98989 89899</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 iris_myownh1">
                                <div className="titleContainer">
                                    <div></div>
                                    <div className="nav-link active" href="#menu1" data-toggle="tab">
                                        <img src={this.state.orderArray.product_image} alt="" />
                                        <br/> {this.state.orderArray.name}
                                    </div>
                                    <div></div>
                                </div>
                                <div className="tab-content">
                                    <div className="tab-pane active" role="tabpanel" id="menu1">
                                        <div className="row roww_iris">
                                            <div className="col-md-6 iris_myownh1A">
                                                <a onClick={this.openModalHandler.bind(this, "modalIsOpen_Prescription_FM")}>
                                                    <img src={global.BASE_URL + "assets/img/uploadmanual.png"} alt="" title="" />&nbsp;&nbsp;{_prlTxt.prespuploadpage.prescman}
                                                </a>
                                            </div>
                                            <div className="col-md-6 iris_myownh1A">
                                                <a onClick={this.openModalHandler.bind(this, "modalIsOpen_Prescription_Im")}>
                                                    <img src={global.BASE_URL + "assets/img/uploadpresc.png"} alt="" title="" />&nbsp;&nbsp;{_prlTxt.prespuploadpage.uploadpresc}
                                                </a>
                                            </div>
                                            <div className="col-md-6 iris_myownh1A">
                                                <a onClick={this.openModalHandler.bind(this, "modalIsOpen_Call_REQ")}>
                                                    <img src={global.BASE_URL + "assets/img/reqcallback.png"} alt="" title="" />&nbsp;&nbsp;{_prlTxt.prespuploadpage.callback}
                                                </a>
                                            </div>
                                            <div className="col-md-6 iris_myownh1A iris_marg3">
                                                <a onClick={this.openModalHandler.bind(this, "modalIsOpen_Email_REQ")}>
                                                    <img src={global.BASE_URL + "assets/img/sendviaemail.png"} alt="" title="" />&nbsp;&nbsp;{_prlTxt.prespuploadpage.sendmail}
                                                </a>
                                            </div>
                                            
                                            <div className="col-md-6 iris_myownh1A">
                                                <a onClick={this.openModalHandler.bind(this, "modalIsOpen_Prescription_OLD")}>
                                                    <img src={global.BASE_URL + "assets/img/savedprsc.png"} alt="" title="" />&nbsp;&nbsp;{_prlTxt.prespuploadpage.prescselect}
                                                </a>
                                            </div>
                                            <div className="col-md-6 iris_myownh1A iris_marg3">
                                                <a onClick={this.openModalHandler.bind(this, "doLater")}>
                                                    <img src={global.BASE_URL + "assets/img/willdolater.png"} alt="" title="" />&nbsp;&nbsp;{_prlTxt.prespuploadpage.iwilldolater}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* User Order Box Ends */}

                {/* Upload Prescrition Begins */}
                <Modal
                isOpen={this.state.modalIsOpen_Prescription_Im}
                onRequestClose={this.closeModal}
                id="Power_Frame_ModalB"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <button type="button" className="close" onClick={this.closeModal}>
                                <span aria-hidden="true" id="modalCloseBtm">×</span>
                            </button>                    
                            <div className="modal-body">
                                <div className="row iris_myownh2 titleContainer">
                                    <div className="col-md-3">
                                        <img src={this.state.orderArray.product_image} alt="" title="" />
                                    </div>
                                    <div className="col-md-9">
                                        <p>{this.state.orderArray.name}</p>
                                    </div>
                                </div>

                                <div className="iris_myownh2F">
                                    <div className="file-upload">
                                    <form>
                                        <button className="file-upload-btn" type="button" onClick={this.uploadUserPrescriptionImage}>{_prlTxt.prespuploadpage.uploadpresc}</button>

                                        <div className="image-upload-wrap">
                                            <input type="file" className="nj-file-input" aria-label="File browser example" name="file" onChange={this.onChangeFileUploadHandler}/>
                                            <span className="iris_error_txtPI">{errors.file_IM.length > 0 && <span className='error'>{errors.file_IM}</span>}</span>                                            
                                            <div className="file-upload-content">                                                
                                                {$imagePreview}
                                            </div>
                                        </div>
                                    </form>    
                                    </div>
                                </div>
                            </div>    
                        </div>
                    </div>
                </Modal>
                        
                {/* Upload Prescrition Ends */}

                {/* Upload Prescrition Form Begins */}
                <Modal
                isOpen={this.state.modalIsOpen_Prescription_FM}
                onRequestClose={this.closeModal}
                id="Power_Frame_ModalB"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <button type="button" className="close" onClick={this.closeModal}>
                                <span aria-hidden="true" id="modalCloseBtm">×</span>
                            </button>                    
                            <div className="modal-body">
                                <div className="row iris_myownh2 titleContainer">
                                    <div className="col-md-3">
                                        <img src={this.state.orderArray.product_image} alt="" title="" />
                                    </div>
                                    <div className="col-md-9">
                                        <p>{this.state.orderArray.name}</p>
                                    </div>
                                </div>

                                <div className="row iris_myownh2A">
                                    <div className="col-md-3">
                                        <p>{_prlTxt.prespuploadpage.addpower}</p>
                                    </div>
                                    <div className="col-md-5 offset-4">
                                        <a href="#">{_prlTxt.prespuploadpage.learnhowtoread}</a>
                                    </div>
                                </div>
                                <div className="iris_myownh2B">
                                    <table width="100%" cellPadding="0" cellSpacing="0" border="0">
                                        <tbody>
                                        <tr>
                                            <td width="33.33%" className="iris_prscA" align="center"><p>EYE</p></td>
                                            <td width="33.33%" className="iris_prscA" align="center"><p>RIGHT-EYE</p></td>
                                            <td width="33.33%" className="iris_prscA" align="center"><p>LEFT-EYE</p></td>
                                        </tr>
                                        <tr>
                                            <td className="iris_prscB" align="center"><p>SPHERICAL (SPH)</p></td>
                                            <td className="iris_prscC" align="center">
                                                <div className="custom-dropdown cl-dd">
                                                    <div className=" dropdown-container cl-dd" onMouseEnter={this.openDropDown.bind(this,'spherical_r')} onMouseLeave={this.handleMouseLeave}>
                                                        <div className=" dropdown-display cl-dd">
                                                            <span className="cl-dd">{this.state.sph_right}</span>
                                                            <i className="fa fa-chevron-down pull-right padding-t8 padding-r10 cl-dd" aria-hidden="true"></i>
                                                        </div>
                                                        <div className={"dropdown-list negative positive both "+ this.state.dropShpirical_r}>
                                                            <div className="cl-power-list">
                                                                <ul className="negative-list list pull-left right-power">
                                                                    {this.getLimitsNegtive('49','sp_r')}
                                                                </ul>
                                                                <ul className="positive-list list pull-left right-power">
                                                                    {this.getLimitsPositive('49','sp_r')}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="iris_prscC" align="center">
                                                <div className="custom-dropdown cl-dd">
                                                    <div className=" dropdown-container cl-dd" onMouseEnter={this.openDropDown.bind(this,'spherical_l')} onMouseLeave={this.handleMouseLeave}>
                                                        <div className=" dropdown-display cl-dd">
                                                            <span className="cl-dd">{this.state.sph_left}</span>
                                                            <i className="fa fa-chevron-down pull-right padding-t8 padding-r10 cl-dd" aria-hidden="true"></i>
                                                        </div>
                                                        <div className={"dropdown-list negative positive both "+ this.state.dropShpirical_l}>
                                                            <div className="cl-power-list">
                                                                <ul className="negative-list list pull-left right-power">
                                                                    {this.getLimitsNegtive('49','sp_l')}
                                                                </ul>
                                                                <ul className="positive-list list pull-left right-power">
                                                                    {this.getLimitsPositive('49','sp_l')}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="iris_prscB" align="center"><p>CYLENDRICAL (CYL)</p></td>
                                            <td className="iris_prscC" align="center">
                                                <div className="custom-dropdown cl-dd">
                                                    <div className=" dropdown-container cl-dd" onMouseEnter={this.openDropDown.bind(this,'cylinder_r')} onMouseLeave={this.handleMouseLeave}>
                                                        <div className=" dropdown-display cl-dd">
                                                            <span className="cl-dd">{this.state.cyl_right}</span>
                                                            <i className="fa fa-chevron-down pull-right padding-t8 padding-r10 cl-dd" aria-hidden="true"></i>
                                                        </div>
                                                        <div className={"dropdown-list negative positive both "+ this.state.dropClinder_r}>
                                                            <div className="cl-power-list">
                                                                <ul className="negative-list list pull-left right-power">
                                                                    {this.getLimitsNegtive('49','cy_r')}
                                                                </ul>
                                                                <ul className="positive-list list pull-left right-power">
                                                                    {this.getLimitsPositive('49','cy_r')}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="iris_prscC" align="center">
                                                <div className="custom-dropdown cl-dd">
                                                    <div className=" dropdown-container cl-dd" onMouseEnter={this.openDropDown.bind(this,'cylinder_l')} onMouseLeave={this.handleMouseLeave}>
                                                        <div className=" dropdown-display cl-dd">
                                                            <span className="cl-dd">{this.state.cyl_left}</span>
                                                            <i className="fa fa-chevron-down pull-right padding-t8 padding-r10 cl-dd" aria-hidden="true"></i>
                                                        </div>
                                                        <div className={"dropdown-list negative positive both "+ this.state.dropClinder_l}>
                                                            <div className="cl-power-list">
                                                                <ul className="negative-list list pull-left right-power">
                                                                    {this.getLimitsNegtive('49','cy_l')}
                                                                </ul>
                                                                <ul className="positive-list list pull-left right-power">
                                                                    {this.getLimitsPositive('49','cy_l')}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="iris_prscB" align="center"><p>AXIS (AXIS)</p></td>
                                            <td className="iris_prscC" align="center">
                                                <div className="custom-dropdown cl-dd">
                                                    <div className=" dropdown-container cl-dd" onMouseEnter={this.openDropDown.bind(this,'axis_r')} onMouseLeave={this.handleMouseLeave}>
                                                        <div className=" dropdown-display cl-dd">
                                                            <span className="cl-dd">{this.state.axis_right}</span>
                                                            <i className="fa fa-chevron-down pull-right padding-t8 padding-r10 cl-dd" aria-hidden="true"></i>
                                                        </div>
                                                        <div className={"dropdown-list positive single "+ this.state.dropAxis_r}>
                                                            <div className="cl-power-list">
                                                                <ul className="positive-list list pull-left right-power">
                                                                    {this.getLimitsAxis('37','ax_r')}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="iris_prscC" align="center">
                                                <div className="custom-dropdown cl-dd">
                                                    <div className=" dropdown-container cl-dd" onMouseEnter={this.openDropDown.bind(this,'axis_l')} onMouseLeave={this.handleMouseLeave}>
                                                        <div className=" dropdown-display cl-dd">
                                                            <span className="cl-dd">{this.state.axis_left}</span>
                                                            <i className="fa fa-chevron-down pull-right padding-t8 padding-r10 cl-dd" aria-hidden="true"></i>
                                                        </div>
                                                        <div className={"dropdown-list positive single "+ this.state.dropAxis_l}>
                                                            <div className="cl-power-list">
                                                                <ul className="positive-list list pull-left right-power">
                                                                    {this.getLimitsAxis('37','ax_l')}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>                                        
                                        <tr>
                                            <td className="iris_prscB" align="center"><p>PD Values</p></td>
                                            <td className="iris_prscC dropAx" align="center" colSpan="2">
                                                {/* <select name="box_right" value={this.state.box_right} onChange={this.handleChange}>
                                                    {this.getPDValue('30','80')}
                                                </select> */}
                                                <div className="custom-dropdown cl-dd">
                                                    <div className=" dropdown-container cl-dd" onMouseEnter={this.openDropDown.bind(this,'pd_l')} onMouseLeave={this.handleMouseLeave}>
                                                        <div className=" dropdown-display cl-dd">
                                                            <span className="cl-dd">{this.state.pd_left}</span>
                                                            <i className="fa fa-chevron-down pull-right padding-t8 padding-r10 cl-dd" aria-hidden="true"></i>
                                                        </div>
                                                        <div className={"dropdown-list positive single "+ this.state.dropPD_l}>
                                                            <div className="cl-power-list">
                                                                <ul className="positive-list list pull-left right-power">
                                                                    {this.getPDValue('30','80')}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="iris_prscE" align="center">
                                                <button onClick={this.uploadUserPrescriptionForm}>Submit</button>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            
                            </div>    
                        </div>
                    </div>
                </Modal>
                        
                {/* Upload Prescrition Form Ends */}

                {/* Request Call Begins */}
                <Modal
                isOpen={this.state.modalIsOpen_Call_REQ}
                onRequestClose={this.closeModal}
                id="Power_Frame_ModalB"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <button type="button" className="close" onClick={this.closeModal}>
                                <span aria-hidden="true" id="modalCloseBtm">×</span>
                            </button>                    
                            <div className="modal-body">
                                <div className="row iris_myownh2 titleContainer">
                                    <div className="col-md-3">
                                        <img src={this.state.orderArray.product_image} alt="" title="" />
                                    </div>
                                    <div className="col-md-9">
                                        <p>{this.state.orderArray.name}</p>
                                    </div>
                                </div>

                                <div className="iris_myownh2H">
                                    <i className="far fa-check-circle"></i>
                                    <h6>{_prlTxt.prespuploadpage.successfulyauthnticate}</h6>
                                    <p>{_prlTxt.prespuploadpage.callrequesttxt}</p>
                                    <a href={global.BASE_URL+'customer-orders'}>{_prlTxt.prespuploadpage.continue}</a>
                                </div>                            
                            </div>    
                        </div>
                    </div>
                </Modal>
                        
                {/* Request Call Ends */}

                {/* Request Call Begins */}
                <Modal
                isOpen={this.state.modalIsOpen_Email_REQ}
                onRequestClose={this.closeModal}
                id="Power_Frame_ModalB"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <button type="button" className="close" onClick={this.closeModal}>
                                <span aria-hidden="true" id="modalCloseBtm">×</span>
                            </button>                    
                            <div className="modal-body">
                                <div className="row iris_myownh2 titleContainer">
                                    <div className="col-md-3">
                                        <img src={this.state.orderArray.product_image} alt="" title="" />
                                    </div>
                                    <div className="col-md-9">
                                        <p>{this.state.orderArray.name}</p>
                                    </div>
                                </div>
                                <div className="iris_myownh2G">
                                    <h6>{_prlTxt.prespuploadpage.emailenquiry}</h6>
                                    <p>
                                        <i className="fas fa-envelope-open-text"></i>&nbsp;&nbsp;&nbsp;&nbsp;support@iris-eyewear.com
                                    </p>
                                    <a href={global.BASE_URL+'customer-orders'}>{_prlTxt.prespuploadpage.continue}</a>
                                </div>                            
                            </div>    
                        </div>
                    </div>
                </Modal>
                        
                {/* Request Call Ends */}
                
                {/* Upload Prescrition Old Begins */}
                <Modal
                isOpen={this.state.modalIsOpen_Prescription_OLD}
                onRequestClose={this.closeModal}
                id="Power_Frame_ModalE"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <button type="button" className="close" onClick={this.closeModal}>
                                <span aria-hidden="true" id="modalCloseBtm">×</span>
                            </button>                    
                            <div className="modal-body">
                                <div className="row iris_myownh2 titleContainer">
                                    <div className="col-md-3">
                                        <img src={this.state.orderArray.product_image} alt="" title="" />
                                    </div>
                                    <div className="col-md-9">
                                        <p>{this.state.orderArray.name}</p>
                                    </div>
                                </div>
                                <div className="iris_myownh4">
                                    <h6>{_prlTxt.prespuploadpage.selectsavedpresc}</h6>
                                    {this.previousPrescription()}
                                </div>
                            </div>    
                        </div>
                    </div>
                </Modal>
                        
                {/* Upload Prescrition Old Ends */}
            </React.Fragment>
                )
            }
        }
        
export default userDashboardOrdersPrescription