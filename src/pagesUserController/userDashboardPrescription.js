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


class userDashboardPrescription extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            keyType: 'add',
            editId : 0,
            error: null,
            userIds:'0',
            isLoggedin : true,            
            redirect : false,
            modalIsOpen_NewPrescription:false,
            prec_Name:null,
            prec_Image:null,
            prec_Description:null,
            imagePreviewUrl:'',
            userPrescriptions:[],
            errors: {
                prec_Name: '',
                prec_Image: '',
                prec_Description: '',
            }
        }
    }

    componentDidMount ()
    {
        this.reviewPrescriptions();    
    }

    reviewPrescriptions(){
        let _listing = {};
        let _urlData = global.userPrescriptionDetails+'?user_Id='+_userId;
        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            if(responseJson.success === false)
            {
            }
            else
            {
                _listing = responseJson.response;
                _imgPath = responseJson.imgPath;
                this.setState({userPrescriptions:_listing,isLoaded:true,userIds:_userId});
            }                
        });
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        
        switch (name) {
        case 'prec_Name': 
        errors.prec_Name = 
            value.length < 1 ? '*Prescription title must be 1 characters long!' : '';

            if (!value.match(/^[a-zA-Z ]*$/)) {
                errors.prec_Name = "*Please enter alphabet characters only.";
            }
        this.setState({prec_Name:value});
        break;
        case 'prec_Description': 
        errors.prec_Description = 
            value.length < 1 ? '*Prescription description must be 1 characters long!' : '';
            if (!value.match(/^[a-zA-Z ]*$/)) {
                errors.prec_Description = "*Please enter alphabet characters only.";
            }
            this.setState({prec_Description:value});   
        break;
        
        default:
        break;
        }
    }

    closeModal = () => {
        this.setState({
            modalIsOpen_NewPrescription: false,
        });
    }

    openModalHandler(value){
        let errors = this.state.errors;
        errors['prec_Image'] = '';
        this.setState({
            [value]: true,
            errors: errors,
            prec_Name:null,
            prec_Image:null,
            prec_Description:null,
            keyType: 'add',
            editId: '0',
        });
    }
   
    onChangeFileUploadHandler=event=>{       
        let reader = new FileReader();
        let file = event.target.files[0];        
        let errors = this.state.errors;
        errors['prec_Image'] = '';
        reader.onloadend = () => {
        this.setState({
            prec_Image: file,
            errors: errors,
            imagePreviewUrl: reader.result
        });
        }
        reader.readAsDataURL(file);
    }

    uploadPrescriptionForm = (event) =>{
        
        event.preventDefault();
        let errors = this.state.errors;
        let _isError = '0';
        

        if(this.state.prec_Name == null)
        {
            _isError = '1';
            errors['prec_Name'] = "*Please Enter Prescription Title.";
            this.setState({errors: errors});
        }
        
        if(this.state.prec_Description == null)
        {
            _isError = '1';
            errors['prec_Description'] = "*Please Enter Prescription Description.";
            this.setState({errors: errors});
        }
        
        if(this.state.editId == '0')
        {
            if(this.state.prec_Image == null || this.state.prec_Image == undefined)
            {
                _isError = '1';
                errors['prec_Image'] = "*Please Upload Prescription.";
                this.setState({errors: errors});
            }
        }

        if(_isError == '0')
        {
            var imageFormData = new FormData();
            imageFormData.append('image', this.state.prec_Image);
            imageFormData.append('_userId', _userId);
            imageFormData.append('prec_Name', this.state.prec_Name);
            imageFormData.append('prec_Description', this.state.prec_Description);
            imageFormData.append('editId', this.state.editId);
            imageFormData.append('keyType', this.state.keyType);
         
            new Promise((resolve, reject) =>{
                fetch(global.userAddPrescriptionDetails, {
                    method:  'POST',
                    body: imageFormData
                })
            .then((response) => response.json())
            .then((res) => {                
                    if(res.success === true)
                    {
                        toast.success(res.message);
                        this.setState({
                            keyType: 'add',
                            editId: '0',
                            modalIsOpen_NewPrescription:false
                        });
                        this.reviewPrescriptions();
                    }
                    else
                    {
                        toast.error(res.message);
                    }
                })
            .catch((error) => {
                    //reject(error);
                });
            });

            
        }
    }

    logout() {
        localStorage.removeItem('irisUserSession');
        localStorage.removeItem('irisCart');
        global._sessiontoken = 0;
        global._sessionUser = 0;
        global._sessionOuth = 0;
        window.location.href = ("/");
    }
    
    removePrescripton(e,i)
    {
        let _urlData = global.userPrescriptionRemove+'?user_Id='+_userId+'&pres_id='+e;
        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            if(responseJson.success === true)
            {
                toast.success(result.message);
                this.reviewPrescriptions();
                window.location.href = global.BASE_URL+'customer-prescription';
                // this.setState({
                //     isAddNew: false
                // });
            }
            else
            {
                toast.error("Prescripton details not found in system. Please try again.");
                return;
            }                
        });
    }

    editPrescripton(e,i){
        let _urlData = global.userPrescriptionSingleDetails+'?user_Id='+_userId+'&pres_id='+e;
        PostData(_urlData,'','GET').then((result) => {
            let responseJson = result;
            if(responseJson.success === true)
            {
                let _jsonRes = responseJson.response[0];
                this.setState({
                    isAddNew: true,
                    prec_Name: _jsonRes.user_title,
                    prec_Description: _jsonRes.user_description,
                    keyType: 'edit',
                    editId: e,
                    modalIsOpen_NewPrescription:true
                });                
            }
            else
            {
                toast.error("Address details not found in system. Please try again.");
                return;
            }                
        });        
    }

    loadPrescriptionData(){
        if(this.state.isLoaded === true)
        {
            let _presDetails = this.state.userPrescriptions;
            let dataPresc = '';
            if(_presDetails.length > 0)
            {
                dataPresc = _presDetails.map((pres, i) =>
                {
                    let _active = '';
                    let _filename = pres.user_prescription;
                    let _fileExt = _filename.split('.');
                    let _hideImg = 'text-art';
                    let _hidePd = '';
                    if(_fileExt[1] == 'png' || _fileExt[1] == 'jpg' || _fileExt[1] == 'jpeg' || _fileExt[1] == 'gif'){
                        _hideImg = '';
                        _hidePd = 'text-art';
                    }
                    return (                       
                        <div key={i} className="col-lg-4">
                            <div className="iris_address_box_1 iris_address_box_2">
                                <div className="iris_addbox">
                                    <div className="iris_address_box_1a">
                                        <a href="#" onClick={this.editPrescripton.bind(this,pres.id)}><i className="fas fa-pencil-alt"></i></a>
                                    </div>
                                    <div className="iris_address_box_1b">
                                        <a href="#" onClick={this.removePrescripton.bind(this,pres.id)}><i className="far fa-trash-alt"></i></a>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <div className="iris_detlbox">
                                    <p><i className="fas fa-user"></i>&nbsp;&nbsp;{pres.user_title}</p>
                                </div>
                                <div className="iris_linkbox iris_linkbox2" id={_hideImg}>
                                    <a data-toggle="modal" data-target="#iris_prescription_modal">
                                        <ModalImage
                                            small={_imgPath + pres.user_prescription}
                                            large={_imgPath + pres.user_prescription}
                                            alt={pres.user_description}
                                            hideDownload={true}
                                            hideZoom={true}
                                        />
                                    </a>
                                </div>
                                <div className="iris_linkbox2" id={_hidePd} style={{'text-align': 'center','fontSize': '13px'}}>
                                    <a href={_imgPath + pres.user_prescription} target="_blank" title="{pres.user_description}"><i className="fas fa-file-pdf"></i> Prescription File</a>
                                </div>
                            </div>
                        </div>
                    )
                })
            }            
            return dataPresc;
        }
    }
    
    render() {
        const {errors} = this.state;
        if (this.state.redirect)
        {            
            window.location.href = global.BASE_URL+'sign-in/';
        }

        return (
            <React.Fragment>
                <Helmet>
                    <title>Customer Uploaded Prescription | IRIS Boutiq</title>
                    <meta name="description" content="Customer Uploaded Prescription | IRIS Boutiq"/>
                    <meta name="keywords" content="Customer Uploaded Prescription | IRIS Boutiq" />
                </Helmet>
                {/* Prescription Begins */}
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
                                        <a href={global.BASE_URL+"customer-prescription"} className="active"><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_presciption}</a>
                                    </li>
                                    <li>
                                        <a href={global.BASE_URL+"customer-orders"}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_orders}</a>
                                    </li>
                                    <li>
                                        <a href="#" onClick={e => e.preventDefault()}><i className="fas fa-check-circle"></i>&nbsp;&nbsp;{_prlTxt.menu_myditt}</a>
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
                        <div className="col-lg-9 iris_macc_ipad">
                            <div className="iris_my_account_right_container">
                                <div className="row">
                                    <div className="col-lg-4">
                                        <div className="iris_add_address_box iris_add_address_boxAA">
                                            <a href="#" className="link1" onClick={this.openModalHandler.bind(this, "modalIsOpen_NewPrescription")}>
                                                <i className="fas fa-file-upload"></i>
                                            </a>
                                            <a href="#" className="link2" onClick={this.openModalHandler.bind(this, "modalIsOpen_NewPrescription")}>{_prlTxt.addprescpage.uploadpresc}</a>
                                        </div>
                                    </div>

                                    {this.loadPrescriptionData()}    
                                </div>
                                <div className="iris_space_1">&nbsp;</div>
                            </div>
                        </div>                            
                    </div>
                </section>                
                {/* Prescription Ends */}

                {/* Request New Prescripton Begins */}
                <Modal
                isOpen={this.state.modalIsOpen_NewPrescription}
                onRequestClose={this.closeModal}
                id="iris_upload_prescription_modal"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="iris_upload_prescription_modal">{_prlTxt.addprescpage.uploadpresc}</h5>
                                <button type="button" className="close" onClick={this.closeModal}>
                                    <span aria-hidden="true">×</span>
                                </button> 
                            </div>
                                               
                            <div className="modal-body">
                                <form action="#.php">
                                    <div className={errors.prec_Name ? "form-group iris_add_address_form_element iris_error_block" : "form-group iris_add_address_form_element"}>
                                        <div className="iris_add_address_form_element_icon">
                                            <img src={global.BASE_URL + "assets/img/iris_name_icon.png"} alt="" title="" />
                                        </div>
                                        <div className="iris_add_address_form_element_txt"><span>{_prlTxt.addprescpage.title}</span>
                                            <input type="text" name="prec_Name" className="iris_signup_lname" placeholder="Enter Prescription Title Here" value={this.state.prec_Name || ''} onChange={this.handleChange}/>
                                        </div>
                                        <div className="clearfix"></div>
                                        <span className="iris_error_txt">{errors.prec_Name.length > 0 && <span className='error'>{errors.prec_Name}</span>}</span>
                                    </div>

                                    <div className={errors.prec_Image ? "form-group iris_add_address_form_element iris_error_block" : "form-group iris_add_address_form_element"}>
                                        <div className="iris_add_address_form_element_icon">
                                            <img src={global.BASE_URL + "assets/img/upload_icon.png"} alt="" title="" />
                                        </div>
                                        <div className="iris_add_address_form_element_txt"><span>{_prlTxt.addprescpage.uploadpresc}</span>
                                            <input type="file" name="prec_Image" onChange={this.onChangeFileUploadHandler}/>
                                        </div>
                                        <div className="clearfix"></div>
                                        <span className="iris_error_txt">{errors.prec_Image.length > 0 && <span className='error'>{errors.prec_Image}</span>}</span>
                                    </div>
                                    <div className={errors.prec_Description ? "form-group iris_add_address_form_element iris_error_block" : "form-group iris_add_address_form_element"}>
                                        <div className="iris_add_address_form_element_icon">
                                            <img src={global.BASE_URL + "assets/img/location_icon.png"} alt="" title="" />
                                        </div>
                                        <div className="iris_add_address_form_element_txt"><span>{_prlTxt.addprescpage.prescdescrip}</span>
                                            <textarea type="text" value={this.state.prec_Description || ''} name="prec_Description" className="iris_signup_lname" placeholder="Enter Prescription Description Here" onChange={this.handleChange}></textarea>
                                        </div>
                                        <div className="clearfix"></div>
                                        <span className="iris_error_txt">{errors.prec_Description.length > 0 && <span className='error'>{errors.prec_Description}</span>}</span>
                                    </div>
                                    <div className="form-group">
                                    <button type="button" className="iris_addaddress_btn" onClick={this.uploadPrescriptionForm} >{_prlTxt.submit} ></button>
                                    </div>
                                </form>
                            </div>                                
                        </div>
                    </div>
                </Modal>
                        
                {/* Request New Prescripton Ends */}
                <Footer />                   
            </React.Fragment>
                )
            }
        }
        
export default userDashboardPrescription