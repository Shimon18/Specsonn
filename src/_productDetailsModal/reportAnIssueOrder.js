import React from 'react';
import {PostData} from '../service/postData';
import { toast } from "react-toastify";

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

const validateForm = (errors) => {
    let valid = true;
       
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

export default class reortAnIssueOrderModal extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            orderId : this.props.orderId,
            infoId : this.props.infoId,
            reason : null,
            comments : null,                        
            errors:{
                comments : '',
                reason : ''
            }
        }
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        
        switch (name) {
        case 'reason': 
        errors.reason = 
          value.length < 5
            ? '*Please enter reason.'
            : '';
            this.setState({reason:value}); 
        break;        
        case 'comments': 
        errors.comments = 
          value.length < 5
            ? '*Please enter valid comment.'
            : '';
            this.setState({comments:value}); 
        break;        
        default:
        break;
        }
    }

    clickTOReportOrder = (event) =>
    {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.reason == null)
        {
            errors['reason'] = "*Please Enter Reason.";
            this.setState({errors: errors});
        }
        if(this.state.comments == null)
        {
            errors['comments'] = "*Please Enter Comment.";
            this.setState({errors: errors});
        }
        else
        {
            const postData = JSON.stringify({
                request_reason: this.state.reason,
                request_message: this.state.comments,
                order_Id:this.state.orderId,
                info_Id:this.state.infoId
            });
            PostData(global.userOrderReportIssue, postData,'POST').then((result) => {
                if(result.success === false)
                {
                    toast.error(result.message);
                    return;
                }
                else
                {
                    toast.success(result.message);
                    window.location.reload();                 
                }
            });
        }
    }
    

    render() {
        const {errors} = this.state;

        return (            
            <div className="modal-body">
                <form>
                    <div className="form-group iris_add_address_form_element">
                        <div className="iris_add_address_form_element_icon">
                            <img src={global.BASE_URL + "assets/img/iris_icon_1.png"} alt="" title=""/>
                        </div>
                        <div className="iris_add_address_form_element_txt"><span>{_prlTxt.orderpage.reason}</span>
                            <input type="text" name="reason" id="reason" placeholder={_prlTxt.place_reason} onChange={this.handleChange}/>
                        </div>
                        <div className="clearfix"></div>
                        <span className="iris_error_txt_modal">{errors.reason.length > 0 && <span className='error'>{errors.reason}</span>}</span>
                    </div>
                    <div className="form-group iris_add_address_form_element">
                        <div className="iris_add_address_form_element_icon">
                            <img src={global.BASE_URL + "assets/img/iris_icon_2.png"} alt="" title=""/>
                        </div>
                        <div className="iris_add_address_form_element_txt"><span>{_prlTxt.orderpage.comment}</span>
                            <textarea type="text" name="comments" id="comments" placeholder={_prlTxt.place_comment} onChange={this.handleChange}></textarea>
                        </div>
                        <div className="clearfix"></div>
                        <span className="iris_error_txt_modal">{errors.comments.length > 0 && <span className='error'>{errors.comments}</span>}</span>
                    </div>
                    <div className="form-group">
                        <button type="button" className="iris_addaddress_btn" onClick={this.clickTOReportOrder}>{_prlTxt.submit} &gt;</button>
                    </div>
                </form>
            </div>
            )
        }    
}
