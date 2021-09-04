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

export default class freamSizeMD extends React.Component {
    render() {
        return (
                    <div className="modal-body iris_frame_detail_modal_A">
                            <div className="iris_myownh6">
                                <h6 className="iris_txt_style_13">{_prlTxt.modalframegroup.step_1_a}</h6>
                                <div className="row">
                                    <div className="col-md-6"> 
                                        <span className="iris_txt_style_14">{_prlTxt.modalframegroup.step_1_b}</span>
                                        <img src={global.BASE_URL + "assets/img/frame_detail_modal_img_1.png"} alt="" title="" className="iris_img_A" />
                                        <p className="iris_txt_style_14A"> {_prlTxt.modalframegroup.step_1_c}</p>
                                    </div>
                                    <div className="col-md-6"> 
                                        <span className="iris_txt_style_14">{_prlTxt.modalframegroup.step_1_d}</span> 
                                        <img src={global.BASE_URL + "assets/img/frame_detail_modal_img_2.png"} alt="" title="" className="iris_img_B" />
                                        <p className="iris_txt_style_14A"> {_prlTxt.modalframegroup.step_1_e}</p>
                                    </div>
                                    <div className="col-md-12 iris_modal_MGT">
                                        <span className="iris_txt_style_14">{_prlTxt.modalframegroup.step_1_f}</span>
                                        <div className="row">
                                            <div className="col-md-4 iris_myownh6A">
                                                <img src={global.BASE_URL + "assets/img/frame_detail_modal_img_3.png"} alt="" title="" />
                                                <p> {_prlTxt.modalframegroup.step_1_g} </p>
                                                <span> {_prlTxt.modalframegroup.step_1_h} </span>
                                                <ul>
                                                    <li> <a href={global.BASE_URL+'eyeglasses'}>{_prlTxt.eyeglass}</a> </li>
                                                    <li> <a href={global.BASE_URL+'sunglasses'}>{_prlTxt.sunglass}</a> </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-4 iris_myownh6A">
                                                <img src={global.BASE_URL + "assets/img/frame_detail_modal_img_4.png"} alt="" title="" />
                                                <p> {_prlTxt.modalframegroup.step_1_i} </p>
                                                <span> {_prlTxt.modalframegroup.step_1_j} </span>
                                                <ul>
                                                    <li> <a href={global.BASE_URL+'eyeglasses'}>{_prlTxt.eyeglass}</a> </li>
                                                    <li> <a href={global.BASE_URL+'sunglasses'}>{_prlTxt.sunglass}</a> </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-4 iris_myownh6A">
                                                <img src={global.BASE_URL + "assets/img/frame_detail_modal_img_5.png"} alt="" title="" />
                                                <p> {_prlTxt.modalframegroup.step_1_k} </p>
                                                <span> {_prlTxt.modalframegroup.step_1_l} </span>
                                                <ul>
                                                    <li> <a href={global.BASE_URL+'eyeglasses'}>{_prlTxt.eyeglass}</a> </li>
                                                    <li> <a href={global.BASE_URL+'sunglasses'}>{_prlTxt.sunglass}</a> </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="iris_myownh6">
                                <h6 className="iris_txt_style_13">{_prlTxt.modalframegroup.step_2_a}</h6>
                                <div className="row">
                                    <div className="col-md-12">
                                        <p className="iris_txt_style_14A"> {_prlTxt.modalframegroup.step_2_b} </p>
                                        <br/>
                                        <br/>
                                        <img src={global.BASE_URL + "assets/img/frame_detail_modal_img_6.png"} alt="" title="" className="iris_img_A" />
                                        <span className="iris_txt_style_14 iris_txt_style_14D">{_prlTxt.modalframegroup.step_2_c}</span>
                                        <div className="table-responsive iris_myownh6B">
                                            <table border="1" cellpadding="0" cellspacing="0" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <p><strong>{_prlTxt.framesize}</strong></p>
                                                        </td>
                                                        <td>
                                                            <p><strong>{_prlTxt.eyeglass}</strong></p>
                                                        </td>
                                                        <td>
                                                            <p><strong>{_prlTxt.sunglass}</strong></p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <p>{_prlTxt.small}</p>
                                                        </td>
                                                        <td>
                                                            <p>{_prlTxt.modalframegroup.step_2_d}</p>
                                                        </td>
                                                        <td>
                                                            <p>{_prlTxt.modalframegroup.step_2_e}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <p>{_prlTxt.medium}</p>
                                                        </td>
                                                        <td>
                                                            <p>{_prlTxt.modalframegroup.step_2_f}</p>
                                                        </td>
                                                        <td>
                                                            <p>{_prlTxt.modalframegroup.step_2_g}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <p>{_prlTxt.large}</p>
                                                        </td>
                                                        <td>
                                                            <p>{_prlTxt.modalframegroup.step_2_h}</p>
                                                        </td>
                                                        <td>
                                                            <p>{_prlTxt.modalframegroup.step_2_i}</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="iris_txt_style_14E">{_prlTxt.modalframegroup.step_2_j}</p>
                                        <p className="iris_txt_style_14F">{_prlTxt.modalframegroup.step_2_k}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="iris_myownh6">
                                <h6 className="iris_txt_style_13">{_prlTxt.modalframegroup.step_3_a}</h6>
                                <div className="row">
                                    <div className="col-md-12 iris_myownh6C">
                                        <ul>
                                            <li>{_prlTxt.modalframegroup.step_3_b}</li>
                                            <li>{_prlTxt.modalframegroup.step_3_c}</li>
                                            <li>{_prlTxt.modalframegroup.step_3_d}</li>
                                            <li>{_prlTxt.modalframegroup.step_3_e}</li>
                                            <li>{_prlTxt.modalframegroup.step_3_f}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                
            )
        }    
}
