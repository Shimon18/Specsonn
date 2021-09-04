import React from 'react'
import Footer from '../containers/Footer';
import {PostData} from '../service/postData';
import FreamSizeMD from '../_productDetailsModal/freamSizeModal';
import WeightGroupMD from '../_productDetailsModal/weightGroupModal';
import { Helmet } from 'react-helmet';
import Modal from 'react-modal';
import Base64 from 'react-native-base64';
import IrisCart from '../_commonFunction/IrisCart';
import ProductDetailLoader from '../_LoaderHere/ProductDetailLoader';
import ReactImageZoom from 'react-image-zoom';
import {userCartManage} from '../_commonFunction/userIrisCart';
import Slider from "react-slick";


import {
    FacebookShareButton,
    WhatsappShareButton,
} from "react-share";

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

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4
};

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

let _pageTitle = '';
let _loader = 'glb-ldr-prt active';

let _typTxt = '';
let _catsTxt = '';
let _firstBaseImage = '';
let _frontTitle = '';

let _modalPower_Titles = [];
let _modalPower_tabsData = [];

let _frameSizeTP = '';
let _hide_leftPower = 'hiddenData';

let _hide_CY_L = 'hiddenData';
let _hide_AX_L = 'hiddenData';
let _hide_CY_R = 'hiddenData';
let _hide_AX_R = 'hiddenData';

let _CL_CY_Power_L = [];
let _CL_CY_Power_R = [];
let _CL_AX_Power_L = [];
let _CL_AX_Power_R = [];

const zoomClass = {
    width: 800,
    height: 384,
    zoomWidth: 384,
    offset: {vertical: 0, horizontal: 10},
    zoomLensStyle: 'opacity: 0.5;background-color: white;border: 1px solid rgb(136, 136, 136);',
    zoomStyle:"border:1px solid rgb(0, 0, 0);cursor: pointer;z-index: 9;"
};

const validateForm = (errors) => {
    let valid = true;
       
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}

let _postalCodeMsgCss = 'successDelivery';
let _addErrorClass_SPL = '';
let _addErrorClass_SPR = '';
let _addErrorClass_CYL = '';
let _addErrorClass_CYR = '';
let _addErrorClass_AXL = '';
let _addErrorClass_AXR = '';

let _recentListClass = 'col-lg-6';
let _similarListClass = 'col-lg-12';

let _defaultImage = global.BASE_URL+'assets/img/iris_CL_hover_img.png';

class productDataViewCL extends React.Component {
    
    constructor(props){
        super(props);
        this.state={
            isPower : false,
            selectedOption : 'only',
            _postalCodeMsgCss : 'successDelivery',
            postalCodeMsg : null, 
            postalCode : null,
            zoomProps: zoomClass,
            _finalBaseImage : '',
            _imgKeys : 0,
            _modalKey:'',
            _modalIds : '',
            _modalTitle : '',
            error: null,
            isLoaded: false,
            items: {},
            cl_powers: {},
            _180rotationFull_left : "-186.429vw",
            _180rotation_left : '-79.499vw',
            _default180 : 'NAAAA',
            renderProducts:[],
            lensPower:{},
            hover: false,
            modalIsOpen_FS: false,
            modalIsOpen_powerLens: false,
            modalIsOpen_cart:false,
            checkedPower : 0,
            checkedPowerLens : 0,
            cartManage: '',

            selectBox_AX_R:'NA',
            selectBox_AX_L:'NA',
            selectBox_CY_R:'NA',
            selectBox_CY_L:'NA',
            selectBox_SP_R:'NA',
            selectBox_SP_L:'NA',
            selectBox_AX_P_R:'NA',
            selectBox_AX_P_L:'NA',
            selectBox_CY_P_R:'NA',
            selectBox_CY_P_L:'NA',
            selectBox_SP_P_R:'NA',
            selectBox_SP_P_L:'NA',
            selectBox_R:'1',
            selectBox_L:'1',
            errors:{
                postalCode : ''
            }
        };
        this.zoomRef = null;
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        
        let errors = this.state.errors;
        switch (name) {
        case 'postalCode': 
        errors.postalCode = 
            value.length < 5
            ? '*Please enter valid postal code.'
            : '';
            this.setState({postalCode:value,postalCodeMsg:''}); 
        break;
                
        case 'axis_attribute_left': 
            var index = event.target.selectedIndex;
            var optionElement = event.target.childNodes[index]
            var _power =  optionElement.getAttribute('data-id');
            _addErrorClass_AXL = '';
            this.setState({selectBox_AX_L:value,selectBox_AX_P_L:_power}); 
        break;
        case 'axis_attribute_right':
            var index = event.target.selectedIndex;
            var optionElement = event.target.childNodes[index]
            var _power =  optionElement.getAttribute('data-id'); 
            _addErrorClass_AXR = '';
            this.setState({selectBox_AX_R:value,selectBox_AX_P_R:_power}); 
        break;
        
        case 'numberOfBox_left': 
            this.setState({selectBox_L:value}); 
        break;

        case 'numberOfBox-right': 
            this.setState({selectBox_R:value}); 
        break;
        
        default:
        break;
        }
    }

    getZoomRef = (ref) => { this.zoomRef = ref; };

    componentDidMount ()
    {
        const handle = this.props.match.params;
        
        let irisCartCaount = localStorage.getItem('irisCart');
        if(irisCartCaount === null || irisCartCaount === undefined){
            document.getElementById('counterCount').innerHTML = 0;
        }
        else{
            irisCartCaount = JSON.parse(irisCartCaount);
        }        

        let cartManage = localStorage.getItem('cartList');
        this.setState({cartManage:cartManage});

        _typTxt = handle.productId;
        _catsTxt = 'contact-lenses';
        
        let _urlData = global.productDetails+'?country_Id='+global.country_Ids+'&language_Id='+global.language_Ids+'&token='+_typTxt;
        PostData(_urlData,'','GET')
        .then(res => {
            
            if(res.response == null || res.response == undefined){
                window.location.href = global.BASE_URL+'not-found/';
                return false;
            }

            let _listing = res.response;
            
            let _imgBox = _listing.extraData.images[0] ? _listing.extraData.images[0].size_M+_listing.extraData.images[0].imagesUrl : _defaultImage;

            var obj = {
            'product_Id' : _listing.product_Id,
            'sku' : _listing.sku,
            '_token' : _listing._token,
            'product_Name' : _listing.product_Name,
            'product_izPrice' : _listing.product_izPrice,
            'product_discountPrice' : _listing.product_discountPrice,
            'image' : _imgBox
            }
            
            let recentViewList = localStorage.getItem('recentlyView');            
            if(recentViewList === null || recentViewList === undefined){
                recentViewList = [];
                recentViewList.push(obj);
                localStorage.setItem('recentlyView', JSON.stringify(recentViewList));
            }
            else{
                recentViewList = JSON.parse(recentViewList);
                const findIds = (this.getItem_RCV(_listing.product_Id));
                if(findIds == '0')
                {
                    if(recentViewList.length > 4){
                        recentViewList = recentViewList.filter((rmItems,index) => index !== 0);
                    }
                    recentViewList.push(obj);
                    localStorage.setItem('recentlyView', JSON.stringify(recentViewList));
                }
            }
            //localStorage.removeItem('recentlyView');

            if(_listing.spherical_Power == 0 && _listing.cylinder_Power == 0 && _listing.axis_Power == 0){
                _listing.extraData.images.forEach((items, index) => {
                    index === 0 ? _listing.extraData.images[index].isActive = true : _listing.extraData.images[index].isActive = false
                });
                this.setState({items: _listing,isLoaded: true}); 
            }else{
                let _urlPowerData = global.contactLensSinglePowerList+'?token='+_listing.product_Id+'&sku='+_listing.sku;
                PostData(_urlPowerData,'','GET')
                .then(res => {
                    let _clPower = res.powerData[0];
                    
                    _listing.extraData.images.forEach((items, index) => {
                        index === 0 ? _listing.extraData.images[index].isActive = true : _listing.extraData.images[index].isActive = false
                    });


                    this.setState({items: _listing,isLoaded: true,cl_powers:_clPower,isPower:true}); 
                });
            }                                            
        })
        .catch(error => this.setState({ error, isLoaded: false }));        
    }
        
    loadFilterData(){
        const _productImages = [];
        const _productImages180s = [];
        const _ColorSmallBox = [];

        if(this.state.isLoaded === true)
        {
            let _baseImage = '';
            let _proids = '';
            
            let _extraData_Imgs = this.state.items.extraData.images;
            let _extraData_Colrs = this.state.items.extraData.colors;
            _frontTitle = this.state.items.brand_Name+' '+this.state.items.shape_Name+' '+this.state.items.productType_Name;

            let _imgAngleShow = false;

            for(let _k = 0; _k < _extraData_Imgs.length; _k++)
            {
                
                let _imgUl_Base = '';
                let _imgUl_Small = '';
                let _imgUl_Medium = '';
                let _actCls = '';
                let _altTitle = 'Product Image';

                if(typeof(_extraData_Imgs[_k].imagesUrl) != "undefined" && _extraData_Imgs[_k].imagesUrl !== null)
                {
                    _imgUl_Base = _extraData_Imgs[_k].size_F+_extraData_Imgs[_k].imagesUrl;
                    _imgUl_Medium = _extraData_Imgs[_k].size_M+_extraData_Imgs[_k].imagesUrl;
                    _imgUl_Small = _extraData_Imgs[_k].size_S+_extraData_Imgs[_k].imagesUrl;
                    _altTitle = _extraData_Imgs[_k].alt_tag.replace("_", " ");
                }
                else
                {
                    _imgUl_Base = _extraData_Imgs[_k].defaultImage;
                    _imgUl_Small = _extraData_Imgs[_k].defaultImage;
                    _imgUl_Medium = _extraData_Imgs[_k].defaultImage;
                }
                
                if(_extraData_Imgs[_k].isActive)
                {
                    if(_extraData_Imgs[_k].alt_tag === 'Female_headturn' || _extraData_Imgs[_k].alt_tag === 'Male_headturn')
                    {
                        _imgAngleShow = true;
                        _imgUl_Base = _extraData_Imgs[_k].size_M+_extraData_Imgs[_k].imagesUrl;
                    }
                    else
                    {
                        _imgUl_Base = _extraData_Imgs[_k].size_F+_extraData_Imgs[_k].imagesUrl;
                    }

                    _baseImage = _imgUl_Base;
                    _actCls = 'active';
                    this.state.zoomProps.img = _baseImage;
                }                

                if(_extraData_Imgs[_k].alt_tag === 'Image_Front')
                {
                    _firstBaseImage = _imgUl_Medium;
                }

                if(_extraData_Imgs[_k].alt_tag === 'Female_headturn' || _extraData_Imgs[_k].alt_tag === 'Male_headturn')
                {
                    var divStyle = {
                        backgroundImage: 'url(' + _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl + ')',
                        backgroundPosition: '-350px 0px'
                    }
                    _productImages180s.push(<div className={_actCls + " rotate-thumbnail-btn"} onMouseOver={this.mouseOver.bind(this, _k)} key={_extraData_Imgs[_k].alt_tag+_k} data-src={_extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl} style={divStyle} onClick={this.manage180Image.bind(this)}></div>
                    );
                }
                else
                {                    
                    _productImages.push(<li className={_actCls} key={_proids+_k} onMouseOver={this.mouseOver.bind(this, _k)}>
                <img src={_imgUl_Small} alt={_extraData_Imgs[_k].alt_tag} title={_altTitle}/></li>);
                }
            }
            
            for(let _k = 0; _k < _extraData_Colrs.length; _k++)
            {
                let _actCls = '';
                if(_extraData_Colrs[_k].color_type === 'HEXA')
                {
                    let _explo = _extraData_Colrs[_k].colors_Hexa.split(',rgba');
                    let _spnColA = _extraData_Colrs[_k].colors_Hexa;
                    let _spnColB = _extraData_Colrs[_k].colors_Hexa;
                    if(_explo.length > 1)
                    {
                        _spnColA = _explo[0];_spnColB = "rgba"+_explo[1];
                    }

                    _ColorSmallBox.push(<li className="color-images" key={_proids+_k}><a  href={global.BASE_URL+_catsTxt+'/'+_extraData_Colrs[_k].product_Url}><span className={_actCls+" colorIcons"} id={_proids}><span className="colorIcons_colorTop" alt={this.state.items.product_Name_Display} title={this.state.items.product_Name_Display} style={{'background':_spnColA}}><span className="colorIcons_colorBottom" style={{'background':_spnColB}}></span></span></span></a></li>);
                }
                else
                {
                    _ColorSmallBox.push(<li className="color-images" key={_proids+_k}><a  href={global.BASE_URL+_catsTxt+'/'+_extraData_Colrs[_k].product_Url}><img id={_proids} className={_actCls+" colorIcons"} src={this.state.items.colorPath+_extraData_Colrs[_k].colors_Hexa} alt={this.state.items.product_Name_Display} title={this.state.items.product_Name_Display} style={{width:'15px'}}></img></a></li>)
                }   
            }
            
            let _callCenter = '';
            if(_imgAngleShow === true)
            {
                _callCenter = <div className="product-image-zoom">
                    <div className="image-zoom" id="headturn-container" style={{width: '70.6658vw'}} onMouseMove={this.rotate180FullImage}>
                        <img id="headturn" src={_baseImage} alt="180 degree view" style={{width: '433.661vw',left:`${this.state._180rotationFull_left}`}} />
                    </div>
                </div>
            }
            else
            {
                if(_extraData_Imgs.length > 0){
                    _callCenter = <div className="block" id="imagBase">
                        <ReactImageZoom ref={this.getZoomRef} {...this.state.zoomProps} />    
                    </div>
                }
                else{
                    _firstBaseImage = _baseImage;
                    _callCenter = <div className="block" id="imagBase">
                        <img src={_baseImage} style={{width: '800px',height: '384px'}} />    
                    </div>
                }
            }

            return(
                <div id="demo1" className="carousel slide iris_prouct_image_slider" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="wrapper">                                
                                {_callCenter}
                            </div>
                        </div>                                            
                    </div>
                    <div className="iris_prouct_image_colors row">
                        <div className="col-sm-6">
                            <ul>
                                <li>{_prlTxt.productviewpage.colors}</li>
                                {_ColorSmallBox}
                            </ul>
                        </div>
                    </div>
                    <div className="thumb-container zoom-image-thumbnail display-flex">
                        <div className="rotate-image-thumbnail">
                            <div className="display-flex align-items-center">
                                <div className="margin-r5 layout center container-180deg">
                                    <img src={global.BASE_URL + "assets/img/iris_180D_img.jpg"} alt="rotateIcon" />
                                </div>
                                <div className="img-block display-flex">
                                    {_productImages180s}
                                </div>
                            </div>
                        </div>

                        <div className="product-image-thumbnail">
                            <div className="zoom-image-thumbnail display-flex">
                                <div className="custom-btn margin-r10 margin-l5">{_prlTxt.productviewpage.views}</div>
                                <ul className="carousel-indicators">
                                    {_productImages}
                                </ul>
                            </div>    
                        </div>
                    </div>                                        
                </div>
            );            
        }
    }

    handleTypeOptionChange = (event) => {
        if(!event.target.checked){
            event.target.value = 'only';
            _hide_leftPower = 'hiddenData';
        }
        else{
            _hide_leftPower = '';
        }
        this.setState({
            selectedOption: event.target.value,
        });
    }

    handleType_SP_Power(side,event){
        //alert(event.target.selectedIndex);
        var index = event.target.selectedIndex;
        var optionElement = event.target.childNodes[index]
        var _power =  optionElement.getAttribute('data-id');
        
        if(side == 'left'){
            _CL_CY_Power_L = [];
            _addErrorClass_SPL = '';
        }
        else{
            _CL_CY_Power_R = [];
            _addErrorClass_SPR = '';
        }

        if(this.state.items.cylinder_Power > 0){
            let _cl_Power = this.state.cl_powers.cylinder;
                                    
            for(var _i = 0; _i < _cl_Power.length;_i++){
                let _powerIcon = '';
                if(_cl_Power[_i].sp_icon == '+'){
                    _powerIcon = _cl_Power[_i].sp_icon;
                }
                
                if(side == 'left'){
                    _CL_CY_Power_L.push(
                    <option key={_cl_Power[_i].id} value={_cl_Power[_i].id} data-id={_cl_Power[_i].cy_powerNum}>{_powerIcon+_cl_Power[_i].cy_powerNum}</option>
                    );
                }
                else{
                    _CL_CY_Power_R.push(
                        <option key={_cl_Power[_i].id} value={_cl_Power[_i].id} data-id={_cl_Power[_i].cy_powerNum}>{_powerIcon+_cl_Power[_i].cy_powerNum}</option>
                    );
                }                
            }
        }
        if(side == 'left'){
            this.setState({selectBox_SP_L:event.target.value,selectBox_SP_P_L:_power});
        }
        else{
            this.setState({selectBox_SP_R:event.target.value,selectBox_SP_P_R:_power});
        }
        this.rightTitleCpop(this.state.items);
    }

    handleType_CY_Power(side,event){
        var index = event.target.selectedIndex;
        var optionElement = event.target.childNodes[index]
        var _power =  optionElement.getAttribute('data-id');

        if(side == 'left'){
            _CL_AX_Power_L = [];
            _addErrorClass_CYL = '';
        }
        else{
            _CL_AX_Power_R = [];
            _addErrorClass_CYR = '';
        }

        if(this.state.items.cylinder_Power > 0){
            let _cl_Power = this.state.cl_powers.axis;
            
           
            for(var _i = 0; _i < _cl_Power.length;_i++){
                let _powerIcon = '';
                if(_cl_Power[_i].ax_icon == '+'){
                    _powerIcon = _cl_Power[_i].ax_icon;
                }
                
                if(side == 'left'){
                    _CL_AX_Power_L.push(
                    <option key={_cl_Power[_i].id} value={_cl_Power[_i].id} data-id={_cl_Power[_i].ax_powerNum}>{_powerIcon+_cl_Power[_i].ax_powerNum}</option>
                    );
                }
                else{
                    _CL_AX_Power_R.push(
                        <option key={_cl_Power[_i].id} value={_cl_Power[_i].id} data-id={_cl_Power[_i].ax_powerNum}>{_powerIcon+_cl_Power[_i].ax_powerNum}</option>
                    );
                }                
            }            
        }       
        if(side == 'left'){
            this.setState({selectBox_CY_L:event.target.value,selectBox_CY_P_L:_power});
        }
        else{
            this.setState({selectBox_CY_R:event.target.value,selectBox_CY_P_R:_power});
        }
        this.rightTitleCpop(this.state.items); 
    }

    rightTitleCpop(productD)
    {
        _pageTitle = entities.decode(productD.product_Name);
        const _applyPower = [];
        const _CL_SP_Power = [];
        const _cartbutton = [];
        let _hide_rightPower = 'hiddenData';       
        
        let _posCss = 'iris_product_info mb-5Nj';

        let _priceSingle = [];
        
        if(this.state.isLoaded === true)
        {
            if(this.state.isPower === true){

                if(this.state.items.spherical_Power > 0){
                    let _cl_Power = this.state.cl_powers.spherical;
                    for(var _i = 0; _i < _cl_Power.length;_i++){
                        let _powerIcon = '';
                        if(_cl_Power[_i].sp_icon == '+'){
                            _powerIcon = _cl_Power[_i].sp_icon;
                        }
                        _CL_SP_Power.push(
                        <option key={_cl_Power[_i].id} value={_cl_Power[_i].id} data-id={_cl_Power[_i].sp_powerNum}>{_powerIcon+_cl_Power[_i].sp_powerNum}</option>
                        );
                    }
                }
                
                if(this.state.items.cylinder_Power > 0){
                    _hide_CY_L = '';
                    _hide_AX_L = '';
                    _hide_CY_R = '';
                    _hide_AX_R = '';
                }

                _applyPower.push(
                    <div key={this.state.items.spherical_Power+this.state.items.cylinder_Power}>
                        <div id="use_prescription_for_both_eyes" className="use_prescription_for_both_eyes configurable">
                            <div className="field-group">
                                <label htmlFor="prescription_for_both_eyes" className="checkboxLabel"><i className="fas fa-info-circle"></i> {_prlTxt.productviewpage.ineedpower}</label>

                                <span className="divInput">
                                <input type="checkbox" className="checkbox prescription-attribute" name="prescription_eyes" id="prescription_for_both_eyes" checked={this.state.selectedOption === 'both'} onChange={this.handleTypeOptionChange} value="both"/>
                                <span className="checkbox-custom"></span>
                                </span>
                            </div>
                            <div id="eyes-container-right" className="different-lens right">
                                <div className="head-title" id={_hide_leftPower}>
                                    <div className="control">
                                        <label className="label" htmlFor="super_attribute_right">Left eye</label>
                                    </div>
                                </div>
                                <div>
                                    <div className="field title required left-sphere-power-box">
                                        <label className="label" htmlFor="super_attribute_214"><span>Sphere (Power)</span></label>
                                    </div>
                                    <div className="field required left-sphere-power-box">
                                        <div className="control">
                                            <select name="spherical_attribute_left" id="spherical_attribute_left" className={_addErrorClass_SPL+" product-power-option"} onChange={this.handleType_SP_Power.bind(this,'left')}>
                                                <option key='NA' value="NA" disabled selected>- Select SP -</option>
                                                {_CL_SP_Power}                               
                                            </select>                                                    
                                        </div>
                                    </div>
                                    <div className="field title required left-sphere-power-box" id={_hide_CY_L}>
                                        <label className="label" htmlFor="super_attribute_215"><span>Cylinder (Power)</span></label>
                                    </div>
                                    <div className="field required left-sphere-power-box" id={_hide_CY_L}>
                                        <div className="control">
                                            <select name="cylinder_attribute_left" id="cylinder_attribute_left" onChange={this.handleType_CY_Power.bind(this,'left')} className={_addErrorClass_CYL+" product-power-option"} title="Cylinder L" data-validate="{required:true}" aria-required="true" aria-invalid="true">
                                                <option value="" selected disabled>-Select CY-</option>
                                                {_CL_CY_Power_L}
                                            </select>                                                    
                                        </div>
                                    </div>
                                    <div className="field title required left-sphere-power-box" id={_hide_CY_L}>
                                        <label className="label" htmlFor="super_attribute_216"><span>Axis</span></label>
                                    </div>
                                    <div className="field required left-sphere-power-box" id={_hide_CY_L}>
                                        <div className="control">
                                            <select name="axis_attribute_left" onChange={this.handleChange} id="axis_attribute_left" className={_addErrorClass_AXL+" product-power-option"} title="Axis L" data-validate="{required:true}" aria-required="true" aria-invalid="true">
                                                <option value="" selected disabled>-Select AX-</option>
                                                {_CL_AX_Power_L}
                                            </select>                                                    
                                        </div>
                                    </div>

                                    <div className="field title required left-sphere-power-box">
                                        <label className="label" htmlFor="super_attribute_216"><span>No of Boxes</span></label>
                                    </div>
                                    <div className="field required left-sphere-power-box">
                                        <div className="control">
                                            <select name="numberOfBox_left" id="numberOfBox_left" className="product-power-option mage-error" title="Axis L" onChange={this.handleChange} data-validate="{required:true}" aria-required="true" aria-invalid="true" >
                                                <option value="" disabled>-Boxes-</option><option value="1">1 Box</option><option value="2">2 Box</option><option value="3">3 Box</option><option value="4">4 Box</option><option value="5">5 Box</option><option value="6">6 Box</option><option value="7">7 Box</option><option value="8">8 Box</option><option value="9">9 Box</option>
                                            </select>                                                    
                                        </div>
                                    </div>

                                </div>                                        
                            </div>
                            <div id="eyes-container-left" className="different-lens left">
                                <div id={_hide_leftPower}>
                                    <div className="head-title">
                                        <div className="control">
                                            <label className="label" htmlFor="super_attribute_right">Right eye</label>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="field required right-sphere-power-box">
                                            <div className="control">
                                                <select name="spherical_attribute_right" id="spherical_attribute_right" className={_addErrorClass_SPR+" product-power-option"} title="Sphere (Power) R" data-validate="{required:true}" onChange={this.handleType_SP_Power.bind(this,'right')} aria-required="true">
                                                    <option value="" disabled selected>- Select SP -</option>
                                                    {_CL_SP_Power}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="field required right-sphere-power-box" id={_hide_CY_L}>
                                            <div className="control">
                                                <select name="cylinder_attribute_right" id="cylinder_attribute_right" onChange={this.handleType_CY_Power.bind(this,'right')} className={_addErrorClass_CYR+" product-power-option"} title="Cylinder R" data-validate="{required:true}" aria-required="true">
                                                <option value="" selected disabled>-Select CY-</option>
                                                    {_CL_CY_Power_R}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="field required right-sphere-power-box" id={_hide_CY_L}>
                                            <div className="control">
                                                <select name="axis_attribute_right" id="axis_attribute_right" className={_addErrorClass_AXR+" product-power-option"} onChange={this.handleChange} title="Axis R" data-validate="{required:true}" aria-required="true">
                                                    <option value="">-Select AX-</option>
                                                    {_CL_AX_Power_R}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="field required right-sphere-power-box">
                                            <div className="control">
                                                <select name="numberOfBox-right" id="numberOfBox-right" className="product-power-option" onChange={this.handleChange} title="Box" data-validate="{required:true}" aria-required="true">
                                                    <option value="" disabled>-Boxes-</option><option value="1">1 Box</option><option value="2">2 Box</option><option value="3">3 Box</option><option value="4">4 Box</option><option value="5">5 Box</option><option value="6">6 Box</option><option value="7">7 Box</option><option value="8">8 Box</option><option value="9">9 Box</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
            else{
                _posCss = 'iris_product_info';
            }
            
            if(this.state.items.cylinder_Power > 0 && this.state.items.isSolutions == 0){
                if(_CL_CY_Power_L.length == 0){
                    _cartbutton.push(<div className="row iris_myownh_outStock" key={898}><div className="col-lg-12 iris_pd_A"><p>{_prlTxt.outstock}</p></div></div>);
                }
                else if(_CL_AX_Power_L.length == 0){
                    _cartbutton.push(<div className="row iris_myownh_outStock" key={898}><div className="col-lg-12 iris_pd_A"><p>{_prlTxt.outstock}</p></div></div>);
                }
                else{
                    _cartbutton.push(<div className="row iris_myownh7IX col-lg-12" key={this.state.items.isPowerLens+1}><div className="col-lg-12 iris_pd_A"><button type="button" className="iris_proction_btn" onClick={this.validateCartButton.bind(this,this.state.items.product_Id,0,0,0,0)}>ADD TO CART</button></div></div>);
                }
            }
            else if(this.state.items.spherical_Power > 0 && this.state.items.cylinder_Power == 0){
                if(_CL_SP_Power.length == 0){
                    _cartbutton.push(<div className="row iris_myownh_outStock" key={898}><div className="col-lg-12 iris_pd_A"><p>{_prlTxt.outstock}</p></div></div>);
                }
                else{
                    _cartbutton.push(<div className="row iris_myownh7IX col-lg-12" key={this.state.items.isPowerLens+1}><div className="col-lg-12 iris_pd_A"><button type="button" className="iris_proction_btn" onClick={this.validateCartButton.bind(this,this.state.items.product_Id,0,0,0,0)}>ADD TO CART</button></div></div>);
                }
            }
            else if((this.state.items.product_avaQty == 0 && this.state.items.isSolutions == 1)){
                _cartbutton.push(<div className="row iris_myownh_outStock" key={898}><div className="col-lg-12 iris_pd_A"><p>{_prlTxt.outstock}</p></div></div>);
            }
            else{
                _cartbutton.push(<div className="row iris_myownh7IX col-lg-12" key={this.state.items.isPowerLens+1}><div className="col-lg-12 iris_pd_A"><button type="button" className="iris_proction_btn" onClick={this.validateCartButton.bind(this,this.state.items.product_Id,0,0,0,0)}>ADD TO CART</button></div></div>);      
            }

            
            if(productD.product_discountPrice == productD.product_izPrice){
                _priceSingle.push(
                    <div key={2323}>
                        <div className="iris_product_price">
                            <p>{global.currencyCode} <span>{productD.product_discountPrice}</span></p>
                        </div>
                    </div>
                )
            }
            else{
                _priceSingle.push(
                    <div key={2323}>
                        <div className="iris_product_price">
                            <p>{global.currencyCode} <span>{productD.product_discountPrice}</span></p>
                        </div>
                        <div className="iris_product_discount_price">
                            <p>{global.currencyCode} <span>{productD.product_izPrice}</span></p>
                        </div>
                    </div>
                )
            }
        }
        
        return(
            <div className={_posCss}>
                <div className="iris_product_title"><span>{this.state.items.product_Id}</span></div>
                <div className="iris_product_title"><span>{entities.decode(productD.product_Name)}</span></div>
                {_priceSingle}
                <div className="iris_product_rating">
                    <ul>
                        <li><i className="fas fa-heart"></i></li>
                        <li><i className="fas fa-heart"></i></li>
                        <li><i className="far fa-heart"></i></li>
                        <li><i className="far fa-heart"></i></li>
                        <li><i className="far fa-heart"></i></li>
                    </ul>
                </div>
                <div className="iris_product_action row">
                    <div className="iris_proction col-lg-12">
                        <div className="fieldset">
                            {_applyPower}
                        </div>
                    </div>
                    {_cartbutton}
                </div>
                <div className="iris_product_detail_social mb-XI">
                <ul id="shareLinks_Icon">
                    <li>{_prlTxt.productviewpage.share}</li>
                    <li>
                    <FacebookShareButton
                        url={window.location.href}
                        quote={entities.decode(productD.product_Name)}
                        className="Demo__some-network__share-button"
                    ><img src={global.BASE_URL + "assets/img/facebook.png"} alt="" title="" /></FacebookShareButton>
                    </li>                    
                    <li>
                    <WhatsappShareButton
                        url={window.location.href}
                        quote={entities.decode(productD.product_Name)}
                        className="Demo__some-network__share-button"
                    ><img src={global.BASE_URL + "assets/img/whatsapp.png"} alt="" title="" /></WhatsappShareButton>
                    </li>
                </ul>
            </div>
            </div>                            
        );
    }

    sizeDetailsImg(sizeD){
        const _180Images = [];
        let _active_rotate = 'hiddenData';
        let _active_size = '';

        let _bridge = '17';
        let _temple = '140';
        let _imgSize = '52';
        _frameSizeTP = '52-17-140';
        if(sizeD.frameMeasure_id != undefined || sizeD.frameMeasure_id != null)
        {
            _frameSizeTP = sizeD.frameMeasure_id;
            let _frss = sizeD.frameMeasure_id;
            let frameSizeArry = _frss.split('-');
            _bridge = frameSizeArry[1];
            _temple = frameSizeArry[2];
            _imgSize = frameSizeArry[0];
        }
        
        if(this.state.isLoaded === true)
        {
            
            let _extraData_Imgs = this.state.items.extraData.images;
            if(_extraData_Imgs.length > 0)
            {
                for(let _k = 0; _k < _extraData_Imgs.length; _k++)
                {

                    if(_extraData_Imgs[_k].alt_tag === 'Male_headturn')
                    {
                        if(this.state._default180 === 'NAAAA')
                        {
                            this.state._default180 = _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl;
                        }                    
                    }
                    else if(_extraData_Imgs[_k].alt_tag === 'Female_headturn'){
                        if(this.state._default180 === 'NAAAA')
                        {
                            this.state._default180 = _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl;
                        }
                    }

                    if(_extraData_Imgs[_k].alt_tag === 'Female_headturn' || _extraData_Imgs[_k].alt_tag === 'Male_headturn')
                    {
                        _active_rotate = '';
                        _active_size = 'hiddenData';
                        var divStyle = {
                            backgroundImage: 'url(' + _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl + ')'
                        }
                        _180Images.push(
                        <div className="image-small" key={_extraData_Imgs[_k].alt_tag+_k} data-src={_extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl} style={divStyle} onClick={this.manage180Image.bind(this)}></div>
                        ); 
                    }
                }
            }
            
        }
        
        return (
            <div className="col-lg-8 offset-2">
                <div className="iris_size_detail">
                    <div className="iris_size_detail_1">
                        <ul>
                            <li>
                                <h6>size(<button data-toggle="modal" data-target="#iris_chart_modal" className="iris_myownh7IV">{_prlTxt.productviewpage.whythis}</button>)</h6>
                                <span>{sizeD.frameSize_Name}</span></li>
                            <li>
                                <h6>{_prlTxt.productviewpage.color}</h6>
                                <span>{sizeD.colors_Name}</span></li>
                            <li>
                                <h6>{_prlTxt.productviewpage.style}</h6>
                                <span>{sizeD.style_Name}</span></li>
                            <li>
                                <h6>{_prlTxt.productviewpage.measurments}</h6>
                                <span>{sizeD.frameMeasure_id}</span></li>
                        </ul>
                    </div>
                    <div className="iris_size_detail_2">
                        <div className="iris_size_detail_2A">
                            <div className="iris_size_detail_2Ai">
                                <h6>{_prlTxt.productviewpage.framedetails}</h6>
                                <button onClick={this.openModalHandler.bind(this, "frameSizeModal")} className="iris_myownh7IV" style={{marginLeft: '5px'}}> ({_prlTxt.productviewpage.viewcomdetail})</button></div>
                            <div className="iris_size_detail_2Aii">
                                <ul>
                                    <li>
                                        <img src={global.BASE_URL + "assets/img/iris_size_detail_img_1.jpg"} alt="" title=""/>
                                        <span>{_prlTxt.productviewpage.bridgesize}</span>
                                        <p>{_bridge} mm</p>
                                    </li>
                                    <li>
                                        <img src={global.BASE_URL + "assets/img/iris_size_detail_img_2.jpg"} alt="" title=""/>
                                        <span>{_prlTxt.productviewpage.templesize}</span>
                                        <p>{_temple} mm</p>
                                    </li>
                                    <li>
                                        <img src={global.BASE_URL + "assets/img/iris_size_detail_img_3.jpg"} alt="" title=""/>
                                        <span>{_prlTxt.productviewpage.eyesize}</span>
                                        <p>{_imgSize} mm</p>
                                    </li>
                                </ul>
                                <button onClick={this.openModalHandler.bind(this, "frameSizeModal")} className="iris_pd_info_btn" >{_prlTxt.productviewpage.viewfrsize} &gt;</button></div>
                        </div>

                        <div className="iris_size_detail_2B" id={_active_rotate}>
                            <div className="iris_size_detail_2Bi">
                                <h6 className="float-left">{_prlTxt.productviewpage.seethisaction}</h6>
                                <img src={global.BASE_URL + "assets/img/iris_180D_img.jpg"} alt="" title="" className="float-right"/>
                                <div className="clearfix"></div>
                            </div>
                            <div className="iris_size_detail_2Bii">
                                <div id="demo2" className="carousel slide iris_prouct_image_slider" data-ride="carousel">
                                    <div className="side180" id="headturn-container-side" style={{width: '26.4997vw'}} onMouseMove={this.rotate180Image}>
                                        <img id="headturn-side" src={this.state._default180} alt="" style={{width: '185.498vw',left:`${this.state._180rotation_left}`}} />
                                    </div>
                                    <div className="small-Icons">
                                    {_180Images}
                                    </div>    
                                </div>
                            </div>
                        </div>

                        <div className="iris_size_detail_2B" id={_active_size}>
                            <div className="iris_size_detail_2Bi">
                                <h6 className="center">{_prlTxt.productviewpage.howiknowfit}</h6>
                                <div className="clearfix"></div>
                                <button onClick={this.openModalHandler.bind(this, "frameSizeModal")} className="iris_myownh7IV" style={{marginLeft: '5px'}}> ({_prlTxt.productviewpage.viewcomdetail})</button>
                                <div className="clearfix"></div>
                            </div>
                            <div className="iris_size_detail_2Bii">
                                <div id="demo2" className="carousel slide iris_prouct_image_slider" data-ride="carousel">
                                    <img src={global.BASE_URL + "assets/img/iris_frame_size_details.png"} alt="" title="" className="float-right" style={{width: '100%',margin: '20px 0px'}}/>
                                </div>
                            </div>
                            <button onClick={this.openModalHandler.bind(this, "frameSizeModal")} className="iris_pd_info_btn" >{_prlTxt.productviewpage.frsizeguide} &gt;</button>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                </div>
            </div>               
        )
    }
    
    renderModalData = () =>{
        if(this.state._modalKey === 'frameSizeModal'){
            return (
                <FreamSizeMD/>
            )
        }
        else if(this.state._modalKey === 'weightGroupModal')
        {
            return (
                <WeightGroupMD/>
            )
        }
    }
    
    technicalDetails(techD)
    {
        let _hide = 'hiddenData';
        let _solutionTxt = 'mb-CenterN';
        if(techD.isSolutions == 0){
            _hide = '';
            _solutionTxt = '';
        }
        
        return (
            <div className="col-lg-8 offset-2 offsetright-2">
                <div className="iris_prod_tech_info">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="pdpInfo display-flex justify-content-between">
                                <div className={"pf-48 "+_solutionTxt}>
                                    <div className="info-heading">{_prlTxt.productviewpage.technicaldetail}</div>
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.brname}</span>
                                            <span className="info-text">{entities.decode(techD.brand_Name)}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.prtype}</span>
                                            <span className="info-text">{techD.productType_Name}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information" id={_hide}>
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.type}</span>
                                            <span className="info-text">{techD.lensType_Name}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information">
                                            <div className="display-flex justify-content-between">
                                                <span className="info-text">{_prlTxt.productviewpage.modalno}</span>
                                                <span className="info-text">{techD.code}</span>
                                            </div>
                                    </div>
                                    <div className="tech-information" id={_hide}>
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.weight}</span>
                                            <span className="info-text">{techD.weight}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pf-48" id={_hide}>
                                    <div className="info-heading">{_prlTxt.productviewpage.generaldetail}</div>                                    
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.basecurve}</span>
                                            <span className="info-text">{techD.base_curve}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.diameter}</span>
                                            <span className="info-text">{techD.diameter}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.lensmaterial}</span>
                                            <span className="info-text">{techD.lens_material}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.packaging}</span>
                                            <span className="info-text">{techD.packaging}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.usagedur}</span>
                                            <span className="info-text">{techD.disposabilityType_Name}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.watercont}</span>
                                            <span className="info-text">{techD.water_content}</span>
                                        </div>
                                    </div>
                                    <div className="tech-information">
                                        <div className="display-flex justify-content-between">
                                            <span className="info-text">{_prlTxt.productviewpage.gender}</span>
                                            <span className="info-text">{_prlTxt.productviewpage.unisex}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    mouseOver(e,i) {
        let _listing = this.state.items;
        _listing.extraData.images.forEach((items, index) => {
            index === e ? _listing.extraData.images[index].isActive = true : _listing.extraData.images[index].isActive = false
        });
        this.setState({items: _listing,_180rotationFull_left : "-186.429vw"});
    }

    mouseOut() {
        //this.setState({hover: false});
    }
    
    onChangedLensPower = (e,f,i) => {
        this.setState({
            checkedPower: f,
            checkedPowerLens: e
        });
    }
    
    getItem_RCV = (id) => {        
        let recentViewList = localStorage.getItem('recentlyView');
        recentViewList = JSON.parse(recentViewList);
        const product = recentViewList.find(item => {
            if(item.product_Id === id)
            {
                return item.product_Id;
            }
        });
        
        if(product === undefined || product === null)
        {
            return(0);
        }
        else{
            return(product.product_Id);
        }        
    };

    getItem = (id,power) => {
        let irisCartList = localStorage.getItem('irisCart');
        irisCartList = JSON.parse(irisCartList);
        const product = irisCartList.items.find(item => {
            if(item.product_Id === id && item.power_option === power)
            {
                return item.product_Id;
            }
        });

        if(product === undefined || product === null)
        {
            return(0);
        }
        else{
            return(product.product_Id);
        }        
    };

    validateCartButton(proid,lensId,inxB,powerId,inxP){
        let handleError = '0';
        
        if(this.state.isPower == true){
            if(this.state.items.cylinder_Power > 0){

                if(this.state.selectedOption == 'only'){
                    if(this.state.selectBox_AX_L == 'NA'){
                        _addErrorClass_AXL = 'notFill';handleError='1';
                    }
                    if(this.state.selectBox_CY_L == 'NA'){
                        _addErrorClass_CYL = 'notFill';handleError='1';
                    }
                }
                else{
                    if(this.state.selectBox_AX_R == 'NA'){
                        _addErrorClass_AXR = 'notFill';handleError='1';
                    }
                    if(this.state.selectBox_CY_R == 'NA'){
                        _addErrorClass_CYR = 'notFill';handleError='1';
                    }
                }
            }
            
            if(this.state.selectBox_SP_R == 'NA' && this.state.selectedOption == 'both'){
                _addErrorClass_SPR = 'notFill';handleError='1';
            }
            if(this.state.selectBox_SP_L == 'NA' && this.state.selectedOption == 'only'){
                _addErrorClass_SPL = 'notFill';handleError='1';
            }        
        }
        
        if(handleError == 0){
            this.openAddtoCartModalHandler(proid,lensId,inxB,powerId,inxP);
        }
        else{
            this.setState({isLoaded:true});
        }        
    }

    openAddtoCartModalHandler(proid,lensId,inxB,powerId,inxP)
    {       
        var lesPA = {};
        var contPW = {};
        var lastFinal = {};

        let _lesDicAmt = 0;
        let _lesAmt = 0;
        
        let _isLoop = '2';
        let _finalPrice = this.state.items.product_discountPrice;
        let _boxQuantity = '1';
        let _isSame = 'Both';
        if(this.state.selectedOption == 'only'){
            _isLoop = '1';
            _finalPrice = _finalPrice;// / 2;
        }

        for(let _z = 0;_z < _isLoop;_z++){
            
            
            if(this.state.items.spherical_Power > 0 || this.state.items.cylinder_Power > 0)
            {                
                if(_z == 0){
                    if(this.state.selectedOption == 'both'){
                        _isSame = 'Left';
                    }
                    _boxQuantity = this.state.selectBox_L;
                    contPW.spherical_Id = this.state.selectBox_SP_L;
                    contPW.cylinder_Id = this.state.selectBox_CY_L;
                    contPW.axis_Id = this.state.selectBox_AX_L;
                    
                    contPW.spherical_power = this.state.selectBox_SP_P_L;
                    contPW.cylinder_power = this.state.selectBox_CY_P_L;
                    contPW.axis_power = this.state.selectBox_AX_P_L;
                }
                if(_z == 1){
                    _isSame = 'Right';
                    _boxQuantity = this.state.selectBox_R;                
                    contPW.spherical_Id = this.state.selectBox_SP_R;                
                    contPW.cylinder_Id = this.state.selectBox_CY_R;                
                    contPW.axis_Id = this.state.selectBox_AX_R;

                    contPW.spherical_power = this.state.selectBox_SP_P_R;                
                    contPW.cylinder_power = this.state.selectBox_CY_P_R;                
                    contPW.axis_power = this.state.selectBox_AX_P_R;
                }
            }
            let DiscAmt = (this.state.items.product_izPrice - this.state.items.product_discountPrice) + _lesDicAmt;
            
            lastFinal.slug = this.state.items.type_Slug;
            lastFinal.currencyCode = global.currencyCode;
            lastFinal.discounts = [];
            lastFinal.totalDiscount = DiscAmt;
            lastFinal.totalTax = 0;
            lastFinal.shipping = 0;
            lastFinal.subTotal = _finalPrice;//this.state.items.product_discountPrice + _lesAmt;
            lastFinal.total = _finalPrice;//this.state.items.product_discountPrice + _lesAmt;

            let irisCartList = localStorage.getItem('irisCart');
            if(irisCartList === null || irisCartList === undefined){            
                irisCartList = {};            
                var obj = {};
                obj.storeId = '1';
                obj.countryId = '1';
                obj.languageId = '1';
                obj.currencyCode = global.currencyCode;
                obj.itemsQty = '0';
                obj.itemsCount = '0';
                obj.items = [{
                    'product_Id':this.state.items.product_Id,
                    'lens_Id':lensId,
                    'power_option':_isSame,
                    'product_Name':entities.decode(this.state.items.product_Name),
                    'salePrice':this.state.items.product_izPrice,
                    'discount':this.state.items.product_discount,
                    'afterDiscount':_finalPrice,//this.state.items.product_discountPrice,
                    'product_image':_firstBaseImage,
                    'product_Url':this.state.items.product_Url,
                    'count' : _boxQuantity,
                    'options' : lesPA,
                    'Power' : contPW,
                    "amount": lastFinal
                }];
                irisCartList = (obj);
                localStorage.setItem('irisCart', JSON.stringify(irisCartList));
            }
            else
            {
                irisCartList = JSON.parse(irisCartList);
                const findIds = (this.getItem(this.state.items.product_Id,_isSame));
                
                let item={};
                if(findIds !== 0)
                {                
                    for (let _i = 0; _i < irisCartList.items.length; _i++)
                    {
                        let id = irisCartList.items[_i].product_Id;
                        if (id === findIds)
                        {
                            irisCartList.items[_i].count = parseInt(irisCartList.items[_i].count) + parseInt(_boxQuantity);
                            let _newAmount = _finalPrice;
                            let _newCount = irisCartList.items[_i].count;
                            irisCartList.items[_i].amount.total = (_newAmount * _newCount);
                            irisCartList.items[_i].amount.subTotal = (_newAmount);
                            localStorage.setItem('irisCart', JSON.stringify(irisCartList));
                            break;
                        }
                    }
                }
                else
                {
                    item = {
                        'product_Id':this.state.items.product_Id,
                        'lens_Id':lensId,
                        'power_option':_isSame,
                        'product_Name':entities.decode(this.state.items.product_Name),
                        'salePrice':this.state.items.product_izPrice,
                        'discount':this.state.items.product_discount,
                        'afterDiscount':_finalPrice,//this.state.items.product_discountPrice,
                        'product_image':_firstBaseImage,
                        'product_Url':this.state.items.product_Url,
                        'count' : _boxQuantity,
                        'options' : lesPA,
                        'Power' : contPW,
                        "amount": lastFinal
                    };
                    irisCartList.items.push(item);
                    localStorage.setItem('irisCart', JSON.stringify(irisCartList)); 
                }
            }            
            userCartManage(localStorage,PostData,sessionStorage,'Import');            
            document.getElementById('counterCount').innerHTML = irisCartList.items.length;
        }                        
        this.setState({
            modalIsOpen_cart: true,
            modalIsOpen_powerLens: false,
        });
    
    }

    rotate180FullImage = (e) =>
    {
        const _start_X = e.pageX; // 686
        let _newX = [{id:0,pos: '0vw',data:43,dataTo:125},{id:1,pos:'-62.597vw',data:125,dataTo:279},{id:2,pos:'-124.597vw',data:279,dataTo:393},{id:3,pos:'-186.429vw',data:393,dataTo:507}, {id:4,pos:'-248.663vw',data:507,dataTo:631},{id:5,pos:'-310.329vw',data:631,dataTo:735},{id:6,pos:'-372.329vw',data:735,dataTo:875}];
        var data = _newX.filter(item => (item.dataTo > _start_X && item.data < _start_X));
        if(data.length > 0)
        {
            let _nePos = data[0].pos;
            this.setState({                
                _180rotationFull_left: _nePos
            })
        }
    }

    manage180Image(e)
    {
        this.setState({
            _default180: (e.target.getAttribute('data-src')),
            _180rotation_left : '-79.499vw'
        });
    }

    checkPostCode = (event) =>
    {
        event.preventDefault();
        let errors = this.state.errors;
        if(this.state.postalCode == null)
        {
            errors['postalCode'] = "*Please Enter Postal Code...";
            this.setState({errors: errors});
        }
        if(validateForm(this.state.errors))
        {
            let _urlChkPD = global.checkPostCode+'?country_Id='+global.country_Ids+'&postcode='+this.state.postalCode;
            PostData(_urlChkPD,'','GET')
            .then(res => {
                if(res.success == true){
                    this.setState({postalCodeMsg:res.message,_postalCodeMsgCss:'successDelivery'});
                }
                else{
                    this.setState({postalCodeMsg:res.message,_postalCodeMsgCss:'errorDelivery'});
                }
            });
        }
    }   
    
    closeModalHandler = () => {
        this.setState({
            modalIsOpen_FS: false,
            modalIsOpen_powerLens: false,
            modalIsOpen_cart:false
        });
    }

    Capitalize = (str) =>{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    recentViewItems(){
        let recentViewList = localStorage.getItem('recentlyView');   
        recentViewList = JSON.parse(recentViewList);
        let _selectBox = [];
        
        if(recentViewList != undefined || recentViewList != null){
            _recentListClass = 'hiddenData_Now';
            if(recentViewList.length > 4){
                _recentListClass = 'col-lg-12';
                for(let _p = 0; _p < recentViewList.length; _p++)
                {
                    _selectBox.push(
                        <div className="iris_bd_rgt recentSlide_Col">
                            <img src={recentViewList[_p].image} alt={recentViewList[_p].product_Name} title={recentViewList[_p].product_Name} />
                            <h4>{recentViewList[_p].product_Name}</h4>
                            <p className="oldPrice">SAE {recentViewList[_p].product_izPrice}</p>
                            <span className="newPrice"><span className="newPriceA">{global.currencyCode}</span> <span className="newPriceB">{recentViewList[_p].product_discountPrice}</span></span>
                        </div>
                    );
                }

                return (
                    <div className="MS-content">
                        <Slider {...settings}>{_selectBox} </Slider>
                    </div> 
                )
            }
        }
        else{
            _recentListClass = 'hiddenData_Now';
        }
    }
    
    render ()
    {
        let _encodeDescription = this.state.items.product_smallDescription;
        let _decode = Buffer.from('"'+_encodeDescription+'"', 'base64').toString('ascii');

        const {errors} = this.state;
        if(this.state.isLoaded == true){
            _loader = 'glb-ldr-prt';
        }
        const shareUrl = window.location.href;

        return (
            <React.Fragment>
                <Helmet>
                    <title>{entities.decode(this.state.items.product_seoTitle)}</title>
                    <meta name="description" content={entities.decode(this.state.items.product_seoDescription)} />
                    <meta name="keywords" content={entities.decode(this.state.items.product_seoKeywords)} />
                    <meta property="og:url" content={shareUrl}/>
                    <meta property="og:locale" content="en_US" />
                    <meta property="og:type" content="article" />
                    <meta property="og:title" content={_pageTitle} />
                    <meta property="og:description" content={_pageTitle} />
                    <meta property="og:image" content={_firstBaseImage} />
                    <meta property="og:image:secure_url" content={_firstBaseImage} />
                </Helmet>
                {/* Product Details Begins */}
                
                <section className="iris_product_detail_container">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="row">
                                    <div className="iris_bredcrumb col-lg-7">
                                        <ul>
                                            <li><a href={global.BASE_URL}>Home</a><span className="breadSpce">></span></li>
                                            <li><a href={global.BASE_URL+'contact-lenses'}>{this.Capitalize(_catsTxt.replace(/-/g, " "))}</a><span className="breadSpce">></span></li>
                                            <li>{this.state.items.code}</li>
                                        </ul>
                                    </div>                                    
                                </div>
                                <div className="iris_prouct_images">                                    
                                    {this.loadFilterData()}
                                </div>
                            </div>
                            <div className="col-lg-4">
                                
                                {this.rightTitleCpop(this.state.items)}
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="iris_product_detail_container iris_border_top_bottom">
                    <div className="container">
                        <div className="row">
                            <div className="row col-lg-12 iris_pd_sec_2">
                                
                                <div className="col-lg-5">
                                    <ul className="nav nav-tabs process-model more-icon-preocess" role="tablist">
                                        <li role="presentation" className="active">
                                                <p>{_prlTxt.productviewpage.choosefr}</p>
                                                <i className="iris"><img src={global.BASE_URL + "assets/img/detail-step-1.png"} alt="description"/></i>
                                            <div className="iris_arrow"><img src={global.BASE_URL + "assets/img/iris_arrow.png"} alt="description"/></div>
                                        </li>
                                        <li role="presentation">
                                                <p>{_prlTxt.productviewpage.chooselns}</p>
                                                <i className="iris"><img src={global.BASE_URL + "assets/img/detail-step-2.png"} alt="description"/></i>
                                            <div className="iris_arrow"><img src={global.BASE_URL + "assets/img/iris_arrow.png"} alt="description"/></div>
                                        </li>
                                        <li role="presentation">
                                                <p>{_prlTxt.productviewpage.completepur}</p>
                                                <i className="iris"><img src={global.BASE_URL + "assets/img/detail-step-3.png"} alt="description"/></i>
                                            <div className="iris_arrow"><img src={global.BASE_URL + "assets/img/iris_arrow.png"} alt="description"/></div>
                                        </li>
                                        <li role="presentation">
                                                <p>{_prlTxt.productviewpage.specifpower}</p>
                                                <i className="iris"><img src={global.BASE_URL + "assets/img/detail-step-4.png"} alt="description"/></i>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-3">
                                    <div >
                                        <p className="deliveryTxt">{_prlTxt.productviewpage.chkdelivery}</p>
                                        <form className="iris_find_pin">                                            
                                            <input type="text" name="postalCode" placeholder={_prlTxt.productviewpage.findcity} onChange={this.handleChange}/>
                                            <button onClick={this.checkPostCode}><i className="fas fa-caret-right"></i></button>
                                            <div className="clearfix"></div>
                                            <span className="iris_error_txt">{errors.postalCode.length > 0 && <span className='error'>{errors.postalCode}</span>}</span>
                                        </form>
                                        <div id={this.state._postalCodeMsgCss}>
                                            {this.state.postalCodeMsg}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3">                                    
                                    <div className="iris_imfo_img"><img src={global.BASE_URL + "assets/img/iris_info_1.png"} alt="" title="" /></div>
                                </div>
                            </div>
                        </div>
                    </div>    
                </section>

                <section className="iris_prduct_other_info">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center iris_myownh10">
                                <nav className="nav-justified ">
                                    <div className="nav nav-tabs " id="nav-tab" role="tablist">
                                        <a className="nav-item nav-link active" id="pop1-tab" data-toggle="tab" href="#pop1" role="tab" aria-controls="pop1" aria-selected="true">{_prlTxt.productviewpage.prodesc}</a>
                                        <a className="nav-item nav-link" id="pop2-tab" data-toggle="tab" href="#pop2" role="tab" aria-controls="pop2" aria-selected="false">{_prlTxt.productviewpage.techinfm}</a>
                                        <a className="nav-item nav-link" id="pop3-tab" data-toggle="tab" href="#pop3" role="tab" aria-controls="pop3" aria-selected="false">{_prlTxt.productviewpage.proreview}</a>
                                    </div>
                                </nav>
                                <div className="tab-content" id="nav-tabContent">
                                    <div className="tab-pane fade show active" id="pop1" role="tabpanel" aria-labelledby="pop1-tab"> 
                                        <div className="product-description" dangerouslySetInnerHTML={{__html: _decode}} />
                                    </div>
                                    <div className="tab-pane fade" id="pop2" role="tabpanel" aria-labelledby="pop2-tab">
                                        {this.technicalDetails(this.state.items)}
                                    </div>
                                    <div className="tab-pane fade" id="pop3" role="tabpanel" aria-labelledby="pop3-tab">
                                        <div className="col-lg-8 offset-2 offsetright-2">
                                            <div className="iris_prod_reviews row">
                                                <div className="col-lg-6" align="center">
                                                    <h6 className="iris_txt_style_1">{_prlTxt.productviewpage.avarating}</h6>
                                                    <ul className="iris_rat_rev">
                                                        <li><i className="fas fa-heart"></i></li>
                                                        <li><i className="fas fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                    </ul>
                                                    <a href="#RW" onClick={e => e.preventDefault()} className="iris_link_style_1">2 reviews &gt;&gt;</a></div>
                                                <div className="col-lg-6" align="center">
                                                    <h6 className="iris_txt_style_1">{_prlTxt.productviewpage.haverate}</h6>
                                                    <a href="#WR" onClick={e => e.preventDefault()} className="iris_link_style_1" data-toggle="modal" data-target="#iris_write_review_modal">{_prlTxt.productviewpage.writereview}</a>
                                                    <ul className="iris_rat_rev">
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                    </ul>
                                                    <a href="#RT" onClick={e => e.preventDefault()} className="iris_link_style_2" data-toggle="modal" data-target="#iris_write_review_modal">{_prlTxt.productviewpage.ratenow} &gt;&gt;</a></div>

                                            </div>
                                            <div className="iris_prod_reviews_2 row">
                                                <div className="col-lg-4" align="center">
                                                    <ul className="iris_rat_rev">
                                                        <li><i className="fas fa-heart"></i></li>
                                                        <li><i className="fas fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                    </ul>
                                                    <h6 className="iris_txt_style_1">Shruti, Dubai</h6>
                                                    <p className="iris_txt_style_2 iris_txt_style_2J" align="center">April 20, 2019</p>
                                                </div>
                                                <div className="col-lg-8">
                                                    <h6 className="iris_txt_style_1">Simply Flawless</h6>
                                                    <p className="iris_txt_style_2">All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.</p>
                                                </div>
                                            </div>
                                            <div className="iris_prod_reviews_2 row iris_ctg_br_non">
                                                <div className="col-lg-4" align="center">
                                                    <ul className="iris_rat_rev">
                                                        <li><i className="fas fa-heart"></i></li>
                                                        <li><i className="fas fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                        <li><i className="far fa-heart"></i></li>
                                                    </ul>
                                                    <h6 className="iris_txt_style_1">Shruti, Dubai</h6>
                                                    <p className="iris_txt_style_2 iris_txt_style_2J">April 20, 2019</p>
                                                </div>
                                                <div className="col-lg-8">
                                                    <h6 className="iris_txt_style_1">Simply Flawless</h6>
                                                    <p className="iris_txt_style_2">All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.</p>
                                                </div>
                                            </div>
                                        </div>                      
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <section className="iris_prduct_other_info iris_border_top">
                    <div className="container">
                        <div className="row">
                            <div className="row iris_product_similar">
                            <div className={_recentListClass} align="center">
                                <h6 className="iris_txt_style_1 iris_txt_style_1A">{_prlTxt.productviewpage.recentlyviewed}</h6>
                                {this.recentViewItems()}
                            </div>
                            <div style={{display:'none'}} className={_similarListClass} align="center">
                                <h6 className="iris_txt_style_1 iris_txt_style_1A">{_prlTxt.productviewpage.similaroption}</h6>
                                <div id="carouselExampleControlsss" className="carousel slide" data-ride="carousel">
                                    <div className="carousel-inner">
                                        <div className="carousel-item active">
                                            <div className="row">
                                                <div className="col-lg-6 iris_simliar_slide_1">
                                                    <img src={global.BASE_URL + "assets/img/iris_hover_img.png"} alt="" title="" />
                                                    <h4>Wilder 6543</h4>
                                                    <p>SAE 149</p>
                                                    <span>SAR99</span>
                                                </div>
                                                <div className="col-lg-6 iris_simliar_slide_1 iris_bd_rgt">
                                                    <img src={global.BASE_URL + "assets/img/iris_hover_img.png"} alt="" title="" />
                                                    <h4>Wilder 6543</h4>
                                                    <p>SAE 149</p>
                                                    <span>SAR99</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <div className="row">
                                                <div className="col-lg-6 iris_simliar_slide_1"><img src={global.BASE_URL + "assets/img/iris_hover_img.png"} alt="" title="" />
                                                    <h4>Wilder 6543</h4>
                                                    <p>SAE 149</p>
                                                    <span>SAR99</span></div>
                                                <div className="col-lg-6 iris_simliar_slide_1 iris_bd_rgt"><img src={global.BASE_URL + "assets/img/iris_hover_img.png"} alt="" title="" />
                                                    <h4>Wilder 6543</h4>
                                                    <h5>grey</h5>
                                                    <p>SAE 149</p>
                                                    <span>SAR99</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="carousel-item">
                                            <div className="row">
                                                <div className="col-lg-6 iris_simliar_slide_1">
                                                    <img src={global.BASE_URL + "assets/img/iris_hover_img.png"} alt="" title="" />
                                                    <h4>Wilder 6543</h4>
                                                    <p>SAE 149</p>
                                                    <span>SAR99</span></div>
                                                <div className="col-lg-6 iris_simliar_slide_1 iris_bd_rgt">
                                                    <img src={global.BASE_URL + "assets/img/iris_hover_img.png"} alt="" title="" />
                                                    <h4>Wilder 6543</h4>
                                                    <p>SAE 149</p>
                                                    <span>SAR99</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <a className="carousel-control-prev" href="#carouselExampleControlsss" role="button" data-slide="prev"><i className="fas fa-chevron-left"></i></a>
                                    <a className="carousel-control-next" href="#carouselExampleControlsss" role="button" data-slide="next"><i className="fas fa-chevron-right"></i></a>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>    
                </section>
                {/* Product Details Ends */}

                <Modal isOpen={this.state.modalIsOpen_cart} onRequestClose={this.closeModalHandler} id="iris_Add_To_Cart_Modal_1">
                    <IrisCart closeModalHandler={this.closeModalHandler}/>
                </Modal>

                <div id="global_loader" className={_loader}>
                    <ProductDetailLoader />
                </div>
                <Footer />                   
            </React.Fragment>
        )
    }
}

Modal.setAppElement('body')

export default productDataViewCL