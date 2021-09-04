import React, { Component } from 'react'
import { Helmet } from 'react-helmet';
import Footer from '../containers/Footer';
import Modal from 'react-modal';

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

let irisBackUrl = localStorage.getItem('irisBackUrl');
let _clickSelected = '';
class insuranceMember extends Component {

    constructor(props){
        super(props);
        this.state={            
            modalIsOpen_INSD: false,
        };
        this.zoomRef = null;
    }

    openModalHandler(value){
        _clickSelected = 'active';
        this.setState({
            modalIsOpen_INSD: true
        });
    }

    closeModalHandler = () => {
        this.setState({
            modalIsOpen_INSD: false
        });
    }

    render () {
        return (
            <React.Fragment>
            <div className="container">
                <Helmet>
                    <title>Iris Eyewear | Insurance Member</title>
                    <meta name="description" content="Iris Eyewear | Insurance Member" />
                </Helmet>
                <section className="iris_insurance">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 offset-2 offsetright-2">
                                <p className="iris_txt_para_1">{_prlTxt.insurancememberpage.title_a}</p>
                                <h4 className="iris_txt_4A">{_prlTxt.insurancememberpage.title_b}</h4>
                                <div className="iris_insurance_companies">
                                    <ul>
                                        <li className={_clickSelected}>
                                            <button onClick={this.openModalHandler.bind(this, "Bupa")}>{_prlTxt.insurancememberpage.insurance}</button>
                                        </li>
                                    </ul>
                                    <div className="iris_login_chk">
                                        <button type="button" class="iris_btn_proceed" onClick={() => window.location.href = irisBackUrl}>{_prlTxt.procheckout}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Modal for Fream Size Begins */}
            <Modal isOpen={this.state.modalIsOpen_INSD} onRequestClose={this.closeModalHandler} id="exampleModal1">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.closeModalHandler}>
                                <span aria-hidden="true">×</span>
                            </button>
                            <div className="clearfix"></div>
                        </div>
                        <div class="modal-body">
                            <div class="ins_img">
                                <img src={global.BASE_URL + "assets/img/bupa-insurance.png"} alt="Bupa insurance" title="Bupa insurance" />
                            </div>
                            <div class="ins_txt">
                                <p>{_prlTxt.insurancememberpage.modal_title}</p>
                            </div>
                            <div class="ins_content row">
                                <div class="col-md-6 ins_block">
                                    <h6>1. {_prlTxt.insurancememberpage.modal_pt}</h6>
                                    <p>{_prlTxt.insurancememberpage.modal_pt_a}</p>
                                    <span><strong>First American Administrators</strong><br/>ATTN: OON Claims Department<br/>P.O. Box 8504<br/>Mason, OH 45040-7111</span>
                                </div>
                                <div class="col-md-6 ins_block">
                                    <h6>2. {_prlTxt.insurancememberpage.modal_pt1}</h6>
                                    <p>{_prlTxt.insurancememberpage.modal_pt1_a}</p>
                                </div>
                                <div class="col-md-6 ins_block">
                                    <h6>3. {_prlTxt.insurancememberpage.modal_pt2}</h6>
                                    <p>{_prlTxt.insurancememberpage.modal_pt2_a}</p>
                                </div>
                                <div class="col-md-6 ins_block">
                                    <h6>4. {_prlTxt.insurancememberpage.modal_pt3}</h6>
                                    <p>{_prlTxt.insurancememberpage.modal_pt3_a}</p>
                                </div>
                            </div>
                        </div>                    
                    </div>
                </div>
            </Modal>                
            {/* Modal for Fream Size Ends */}
            <Footer />
            </React.Fragment>
        )
    }
}

export default insuranceMember