import React, { Component } from 'react'
import {PostData} from '../service/postData';
import FilterProduct from './filterProduct';
import FooterInner from '../containers/FooterInner';
import Footer from '../containers/Footer';
import { Helmet } from 'react-helmet';
import { throwStatement } from '@babel/types';
import ProductListLoader from '../_LoaderHere/ProductListLoader';
import queryString from 'query-string';
const WishList = require('../_commonFunction/wishListFunction'); 

let _filterId = '';
let _typTxt = '';
let _catsTxt = '';
let handle = '';

let _loader = 'glb-ldr-prt active';

let _hiddenDataList = 'hiddenData';
let _hiddenDataNot = 'hiddenData';

class searchRecommend extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            _finalBaseImage : '',
            _imgKeys : 0,
            error: null,
            isLoaded: false,
            items: [],
            page: 1,
            sizePerPage: 0,
            totalSize: 0,
            totalPage: 0,
            renderProducts:[],
            isFilter:[],
            nonFilter:[],
            filters :{},
            hover: false,
            onSort: '',
            
            price: {
                lowHigh: false,
                highLow: false
            },
            genders: [],
            frameType: [],
            frameShape: [],
            frameSize: [],
            frameColors: [],
            brands: [],
            frameMaterial: [],
            filterHeader: []
        };
    }

    componentDidMount ()
    {
        handle = queryString.parse(this.props.location.search);
        this.renderView(handle,'');        
    }   
    
    renderView(handle,filterParam){
        _filterId = handle.search;
        //alert(_filterId)
        let _urlData = global.searchTextDetails+_filterId; 
        PostData(_urlData,'','GET')
        .then(res => {

            if(res.dataCount == 0){
                window.location.href = global.BASE_URL+'not-found';
            }
            else{
                if(res.response.length > 0){
                    _hiddenDataList = '';
                    _hiddenDataNot = 'hiddenData';
                }
                else{
                    _hiddenDataList = 'hiddenData';
                    _hiddenDataNot = '';
                    this.setState({ isLoaded: true })
                }

                let _listing = res.response;
                let _filterArrys = res.filter;
                let _categoryId = _listing[0].productType_Id;
                //+'&master='+_filterArrys.master+filterParam
                let _urlSorting = global.sortingListSync+'?category_Id='+_categoryId+'&country_Id='+global.country_Ids+'&language_Id='+global.language_Ids+'&typTxt='+_typTxt+'&catsTxt='+_filterId;
                //console.log(_urlSorting);
                PostData(_urlSorting,'','GET').then(results => {
                    let _filterArry = results.response;

                if(Array.isArray(_listing) && _listing.length)
                { 
                    _listing.forEach((items, index) => {
                        items.extraData.images.forEach((extraData, subChildIndex) => {
                                subChildIndex === 0 ? _listing[index].extraData.images[subChildIndex].isActive = true : _listing[index].extraData.images[subChildIndex].isActive = false
                        })            
                    });
                }
                this.setState({filters:_filterArry,nonFilter:_listing, items: _listing, isLoaded: true,frameShape: _filterArry.frameShape,brands: _filterArry.brands,genders: _filterArry.genders,frameSize: _filterArry.frameSize,frameType: _filterArry.frameType,glassColors: _filterArry.frameColors,frameColors: _filterArry.frameColors,frameMaterial: _filterArry.frameMaterial});

                }).catch(error => this.setState({ error, isLoaded: false })); 
            } 
        })
        .catch(error => console.log(error));
    }
        
    handleLoad() {        
        const script = document.createElement("script");
        script.src = global.BASE_URL+'assets/js/custom.js';
        script.async = true;
        document.body.appendChild(script);        
    }

    mouseOver(i,e) {
        let _listing = this.state.items;
        _listing.forEach((items, index) => {
            items.extraData.images.forEach((extraData, subChildIndex) => {
                if(index ===  i){
                    subChildIndex === e ? _listing[index].extraData.images[subChildIndex].isActive = true : _listing[index].extraData.images[subChildIndex].isActive = false              
                }
            })        
        });
        this.setState({items: _listing});
    }

    mouseOut() {
        //this.setState({hover: false});
    }   
    
    setWishList(i,e){
        WishList.addWishList(i,e,PostData,localStorage);        
    }

    loadFilterData(id){        
        if(this.state.isLoaded === true)
        {
           // alert(id);
            let data = '';            
            data = this.state.items.map((item, i) =>
            {
                const findIds = (WishList.chkWishListItems(item.product_Id));
                let _wishAct = '';
                if(findIds !== 0){
                    _wishAct = 'active';
                }

                let _baseImage = '';
                let _baseImage_LR = '';
                let _baseImageURL = '';
                
                let _ColorSmallBox = [];
                let _irisPrice = item.product_izPrice;
                let _irisSalePrice = item.product_discountPrice;

                let _extraData_Imgs = item.extraData.images;
                let _extraData_Colrs = item.extraData.colors;
                
                for(let _k = 0; _k < _extraData_Imgs.length; _k++)
                {
                    let _fmIr = '';
                    let _fmSlIr = '';
                    let _imgUl = '';
                    let _proids = '';
                    if(typeof(_extraData_Imgs[_k].imagesUrl) != "undefined" && _extraData_Imgs[_k].imagesUrl !== null)
                    {
                        _imgUl = _extraData_Imgs[_k].size_M+_extraData_Imgs[_k].imagesUrl;
                        _proids = _extraData_Imgs[_k].product_Id;
                        _fmIr = _extraData_Imgs[_k].product_marketPrice;
                        _fmSlIr = _extraData_Imgs[_k].product_discountPrice;
                    }
                    else
                    {
                        _imgUl = _extraData_Imgs[_k].defaultImage;
                        _proids = item.product_Id;
                        _fmIr = item.product_izPrice;
                        _fmSlIr = item.product_discountPrice;
                    }

                    let _actCls = '';
                                       
                    if(_extraData_Imgs[_k].isActive){
                        _baseImage = _imgUl;
                        _actCls = 'active';
                        _irisPrice = _fmIr;
                        _irisSalePrice = _fmSlIr;

                        let _commonMenu = _baseImageURL.replace(/\s/g, "-");
                        _commonMenu = _commonMenu.toLowerCase();
                        
                        let _findType = _extraData_Imgs[_k].brand_Name;
                        if(_extraData_Imgs[_k].type_Slug == 'IZCT-CL'){
                            _findType = _findType.replace(/ /g, '-');
                            _findType = _findType.toLowerCase();
                            _findType = _findType+'/';
                        }
                        else{
                            _findType = '';
                        }
                        
                        if(_extraData_Imgs[_k].product_Url == undefined || _extraData_Imgs[_k].product_Url == null){
                            _baseImageURL = global.BASE_URL+_extraData_Imgs[_k].menuUrl+'/'+_findType+item.product_Url;
                        }
                        else{
                            _baseImageURL = global.BASE_URL+_extraData_Imgs[_k].menuUrl+'/'+_findType+_extraData_Imgs[_k].product_Url;
                        }

                        //_baseImageURL = global.BASE_URL+_extraData_Imgs[_k].menuUrl+'/'+_extraData_Imgs[_k].product_Url;
                        if(typeof(_extraData_Imgs[_k].image_urls) != "undefined" && _extraData_Imgs[_k].image_urls !== null)
                        {
                            var _njDataR = _extraData_Imgs[_k].image_urls.filter(altImgs => (altImgs.alt_tag === 'Image_Right'));
                            var _njDataL = _extraData_Imgs[_k].image_urls.filter(altImgs => (altImgs.alt_tag === 'Image_Left'));
                            if(_njDataL.length > 0)
                            {
                                _baseImage_LR = _extraData_Imgs[_k].size_M+_njDataL[0].imagesUrl;
                            }
                            else if(_njDataR.length > 0)
                            {
                                _baseImage_LR = _extraData_Imgs[_k].size_M+_njDataR[0].imagesUrl;
                            }
                            else
                            {
                                _baseImage_LR = _baseImage;
                            }                            
                        }
                        if(_baseImage_LR.length === 0)
                        {
                            _baseImage_LR = _baseImage;
                        }
                    }
                    
                    if(_k < _extraData_Colrs.length)
                    {                    
                        if(_extraData_Colrs[_k].color_type === 'HEXA')
                        {
                            let _explo = _extraData_Colrs[_k].colors_Hexa.split(',rgba');
                            let _spnColA = _extraData_Colrs[_k].colors_Hexa;
                            let _spnColB = _extraData_Colrs[_k].colors_Hexa;
                            if(_explo.length > 1)
                            {
                                _spnColA = _explo[0];_spnColB = "rgba"+_explo[1];
                            }

                            _ColorSmallBox.push(<a key={_proids+_k} href={global.BASE_URL+_extraData_Imgs[_k].menuUrl+'/'+_extraData_Colrs[_k].product_Url} onMouseOver={this.mouseOver.bind(this, i, _k)}><span className={_actCls+" colorIcons"} id={_proids}><span className="colorIcons_colorTop" style={{'background':_spnColA}}><span className="colorIcons_colorBottom" style={{'background':_spnColB}}></span></span></span></a>);
                        }
                        else
                        {
                            _ColorSmallBox.push(<a key={_proids+_k} href={global.BASE_URL+_extraData_Imgs[_k].menuUrl+'/'+_extraData_Colrs[_k].product_Url} onMouseOver={this.mouseOver.bind(this, i, _k)}><img id={_proids} className={_actCls+" colorIcons"} src={item.colorPath+_extraData_Colrs[_k].colors_Hexa} alt={_extraData_Colrs[_k].colors_Name} style={{width:'15px'}} ></img></a>)
                        } 
                    }                   
                }                
                //console.log(_irisPrice+'-----'+_irisSalePrice);
                
                if(_irisPrice > 0){
                    return (
                        <div className="col-lg-4" key={item.product_Id}>
                            <div className="iris_product_single">
                                <div className="iris_wish_1">
                                    <a className={_wishAct} onClick={this.setWishList.bind(this,item)}>&nbsp;</a>
                                </div>
                                <div className="small-images">
                                    {_ColorSmallBox}
                                </div>
                                <div className="clearfix"></div>
                                <div className="iris_img_PD">
                                <a href={_baseImageURL}><img src={_baseImage} alt={item.product_Name} /></a>
                                </div>
                                <div className="iris_img_A" id="big-image8">
                                    <a href={_baseImageURL}>
                                    <img src={_baseImage_LR} alt={item.product_Name} />
                                    </a>
                                </div>
                                <div className="iris_single_product_detail">                                
                                    <div className="iris_prodet_1">
                                        <p>{global.currencyCode} {_irisPrice}</p>
                                        <span>{global.currencyCode} {_irisSalePrice}</span>
                                    </div>
                                    <div className="iris_prodet_2">
                                        <p><a href={_baseImageURL}>{item.product_Name_Display}</a></p>
                                    </div>
                                    <div className="iris_prodet_3">
                                        <a href="#" onClick={e => e.preventDefault()}>
                                            <img src={global.BASE_URL + "assets/img//180.png"} alt="180 view" style={{height:'18px', width:'24px'}} /><b>Virtual <br/>try-on</b>
                                            <div className="clearfix"></div>
                                        </a>
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>            
                    );   
                }                      
            })            
            return data;
        }
    }

    Capitalize = (str) =>{
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    handleFilterboxChange(e,i,t,event){

        let filterHeader = this.state.filterHeader;  
        let _obj = {};
        _obj.id = e;
        _obj.active = event.target.checked;
        _obj.name = t;
        _obj.type = i;

        if(event.target.checked === false)
        {
            filterHeader =  this.state.filterHeader.filter((data) => {                
                return data.id !== e;
            })
        }
        else{
            filterHeader.push(_obj);
        }
        
        let _frameShape = '';
        let _frameType = '';
        let _frameSize  = '';
        let _frameBrand  = '';
        let _frameColor = '';
        let _frameGender = '';
        let _frameMaterial = '';
                
        let filterParam = filterHeader.map((parms,index) => {
            if(parms.type === 'material' && parms.active === true){
                _frameMaterial += parms.id + ',';                
            }
            else if(parms.type === 'genders' && parms.active === true){
                _frameGender += parms.id + ',';                
            }
            else if(parms.type === 'frameSize' && parms.active === true){
                _frameSize += parms.id + ',';                
            }
            else if(parms.type === 'brands' && parms.active === true){
                _frameBrand += parms.id + ',';                
            }
            else if(parms.type === 'colors' && parms.active === true){
                _frameColor += parms.id + ',';                
            }
            else if(parms.type === 'sp' && parms.active === true){
                _frameShape += parms.id + ',';                
            }
            else if(parms.type === 'frametype' && parms.active === true){
                _frameType += parms.id + ',';                
            }
        });

        _frameMaterial = _frameMaterial.substring(0, _frameMaterial.length - 1);
        _frameGender = _frameGender.substring(0, _frameGender.length - 1);
        _frameSize = _frameSize.substring(0, _frameSize.length - 1);
        _frameBrand = _frameBrand.substring(0, _frameBrand.length - 1);
        _frameColor = _frameColor.substring(0, _frameColor.length - 1);
        _frameShape = _frameShape.substring(0, _frameShape.length - 1);
        _frameType = _frameType.substring(0, _frameType.length - 1);

        filterParam = '&gender='+_frameGender+'&frameSize_id='+_frameSize+'&frameShape_Id='+_frameShape+'&frametype_Id='+_frameType+'&colors_Id='+_frameColor+'&brand_Id='+_frameBrand+'&material_id='+_frameMaterial+'&priceBetween='+this.state.onSort;

        this.renderView(handle,filterParam);
        this.setState({filterHeader:filterHeader});
        return;      
    }

    handleSortboxChange(event){                
        let filterHeader = this.state.filterHeader;  
        
        let _frameShape = '';
        let _frameType = '';
        let _frameSize  = '';
        let _frameBrand  = '';
        let _frameColor = '';
        let _frameGender = '';
        let _frameMaterial = '';
                
        let filterParam = filterHeader.map((parms,index) => {
            if(parms.type === 'material' && parms.active === true){
                _frameMaterial += parms.id + ',';                
            }
            else if(parms.type === 'genders' && parms.active === true){
                _frameGender += parms.id + ',';                
            }
            else if(parms.type === 'frameSize' && parms.active === true){
                _frameSize += parms.id + ',';                
            }
            else if(parms.type === 'brands' && parms.active === true){
                _frameBrand += parms.id + ',';                
            }
            else if(parms.type === 'colors' && parms.active === true){
                _frameColor += parms.id + ',';                
            }
            else if(parms.type === 'sp' && parms.active === true){
                _frameShape += parms.id + ',';                
            }
            else if(parms.type === 'frametype' && parms.active === true){
                _frameType += parms.id + ',';                
            }
        });

        _frameMaterial = _frameMaterial.substring(0, _frameMaterial.length - 1);
        _frameGender = _frameGender.substring(0, _frameGender.length - 1);
        _frameSize = _frameSize.substring(0, _frameSize.length - 1);
        _frameBrand = _frameBrand.substring(0, _frameBrand.length - 1);
        _frameColor = _frameColor.substring(0, _frameColor.length - 1);
        _frameShape = _frameShape.substring(0, _frameShape.length - 1);
        _frameType = _frameType.substring(0, _frameType.length - 1);

        filterParam = '&gender='+_frameGender+'&frameSize_id='+_frameSize+'&frameShape_Id='+_frameShape+'&frametype_Id='+_frameType+'&colors_Id='+_frameColor+'&brand_Id='+_frameBrand+'&material_id='+_frameMaterial+'&priceBetween='+event.target.value;

        this.renderView(handle,filterParam);
        this.setState({filterHeader:filterHeader,onSort:event.target.value});
        return;      
    }

    removeFilterHeader(item){
        let filterHeader =  this.state.filterHeader.filter((data) => {
            return data !== item;
        })

        let _frameShape = '';
        let _frameType = '';
        let _frameSize  = '';
        let _frameBrand  = '';
        let _frameColor = '';
        let _frameGender = '';
        let _frameMaterial = '';

        let filterParam = filterHeader.map((parms,index) => {
            if(parms.type === 'material' && parms.active === true){
                _frameMaterial += parms.id + ',';                
            }
            else if(parms.type === 'genders' && parms.active === true){
                _frameGender += parms.id + ',';                
            }
            else if(parms.type === 'frameSize' && parms.active === true){
                _frameSize += parms.id + ',';                
            }
            else if(parms.type === 'brands' && parms.active === true){
                _frameBrand += parms.id + ',';                
            }
            else if(parms.type === 'colors' && parms.active === true){
                _frameColor += parms.id + ',';                
            }
            else if(parms.type === 'sp' && parms.active === true){
                _frameShape += parms.id + ',';                
            }
            else if(parms.type === 'frametype' && parms.active === true){
                _frameType += parms.id + ',';                
            }
        });

        _frameMaterial = _frameMaterial.substring(0, _frameMaterial.length - 1);
        _frameGender = _frameGender.substring(0, _frameGender.length - 1);
        _frameSize = _frameSize.substring(0, _frameSize.length - 1);
        _frameBrand = _frameBrand.substring(0, _frameBrand.length - 1);
        _frameColor = _frameColor.substring(0, _frameColor.length - 1);
        _frameShape = _frameShape.substring(0, _frameShape.length - 1);
        _frameType = _frameType.substring(0, _frameType.length - 1);

        filterParam = '&gender='+_frameGender+'&frameSize_id='+_frameSize+'&frameShape_Id='+_frameShape+'&frametype_Id='+_frameType+'&colors_Id='+_frameColor+'&brand_Id='+_frameBrand+'&material_id='+_frameMaterial+'&priceBetween='+this.state.onSort;

        this.renderView(handle,filterParam);
        this.setState({filterHeader:filterHeader});        
        return;
    }

    sortingArea(){
        if(this.state.isLoaded === true)
        {
            let _sortData = [];
            let typeData = '';
            let shapeData = '';
            let colorData = '';
            let brandData = '';
            let sizeData = '';            
            let priceData = '';
            let genderData = '';
            let materialData = '';

            const _frameType = this.state.frameType;
            if(_frameType.length > 0)
            {                
                let frShp = _frameType.map((item, i) =>{
                    let _checked = '';
                    let _chk =  this.state.filterHeader.filter((data) => {                        
                        if(data.id == item.frametype_Id  && data.type == 'frametype')
                        {
                            _checked = 'checkedLi';
                        }
                    });                
                    return (                        
                        <li key={item.frametype_Id} className="list-filters"><div className="listItem" onChange={this.handleFilterboxChange.bind(this,item.frametype_Id,'frametype',item.frametype_Name)}>
                            <label>
                                <input type="checkbox" disabled="" readOnly="" value={item.frametype_Id}/>
                                <span className={"list-icon "+_checked} title={item.frametype_Name}>
                                    <img src={item.imageUrl+item.frametype_img} alt={item.frametype_Name} data-title={item.frametype_Name} className="innerImg" />
                                    <span className="list-icon-title">{item.frametype_Name}</span>
                                </span>
                            </label>
                        </div></li>
                    )
                })
                typeData = <div key={1+1} className="card"><div className="card-header" id="headingOne"><h2 className="filterHeading mb-0">Frame Type</h2></div><div id="collapseOne"><div className="card-body"><ul className="iris_filter_1">{frShp}</ul></div></div></div>;
            }

            const _frameShape = this.state.frameShape;
            if(_frameShape.length > 0)
            {                
                let frShp = _frameShape.map((item, i) =>{                    
                    let _checked = '';
                    let _chk =  this.state.filterHeader.filter((data) => {
                        if(data.id == item.shape_Id && data.type == 'sp')
                        {
                            _checked = 'checkedLi';
                        }
                    })

                    return (
                        <li key={item.shape_Id} className="list-filters"><div className="listItem" onChange={this.handleFilterboxChange.bind(this,item.shape_Id,'sp',item.shape_Name)}>
                            <label>
                                <input type="checkbox" disabled="" readOnly="" value={item.shape_Id}/>
                                <span className={"list-icon "+_checked} title={item.shape_Name}>
                                    <img src={item.imageUrl+item.shape_img} alt={item.shape_Name} data-title={item.shape_Name} className="innerImg" />
                                    <span className="list-icon-title">{item.shape_Name}</span>
                                </span>
                            </label>
                        </div></li>
                    )
                })
                shapeData = <div key={1+2} className="card"><div className="card-header" id="headingOne"><h2 className="filterHeading mb-0">Frame Shape</h2></div><div id="collapseTwo" className="collapse show" ><div className="card-body"><ul className="iris_filter_1">{frShp}</ul></div></div></div>;
            }

            const _frameColors = this.state.frameColors;
            if(_frameColors.length > 0)
            {                
                let frShp = _frameColors.map((items, i) =>{
                    let _checked = '';
                    let _chk =  this.state.filterHeader.filter((data) => {
                        if(data.id == items.colors_Id)
                        {
                            _checked = true;
                        }
                    })

                    return (                 
                        <li key={items.colors_Id}><label className="check ">{items.colors_Name}<input type="checkbox" value={items.colors_Id} checked={_checked} readOnly="" onChange={this.handleFilterboxChange.bind(this,items.colors_Id,'colors',items.colors_Name)}/><span className="checkmark"></span></label></li>                                    
                    )
                })
                colorData = <div key={1+3} className="card"><div className="card-header" id="headingOne"><h2 className="irisoptical mb-0"><button type="button" className="btn btn-link" data-toggle="collapse" data-target="#collapseThree">Frame Color<i className="fas fa-sort-down float-right"></i></button></h2></div><div id="collapseThree" className="collapse hide" aria-labelledby="headingOne" data-parent="#accordionExample"><div className="card-body"><ul className="iris_filter_1">{frShp}</ul></div></div></div>;
            }

            const _frameBrands = this.state.brands;
            if(_frameBrands.length > 0)
            {                
                let frShp = _frameBrands.map((item, i) =>{
                    let _checked = '';
                    let _chk =  this.state.filterHeader.filter((data) => {
                        if(data.id == item.brand_Id)
                        {
                            _checked = true;
                        }
                    })
                    return (                 
                        <li key={item.brand_Id}><label className="check ">{item.brand_Name}<input type="checkbox" value={item.brand_Id} readOnly="" checked={_checked} onChange={this.handleFilterboxChange.bind(this,item.brand_Id,'brands',item.brand_Name)}/><span className="checkmark"></span></label></li>
                    )
                })
                brandData = <div key={1+4} className="card"><div className="card-header" id="headingOne"><h2 className="irisoptical mb-0"><button type="button" className="btn btn-link" data-toggle="collapse" data-target="#collapseFour">Brands<i className="fas fa-sort-down float-right"></i></button></h2></div><div id="collapseFour" className="collapse hide" aria-labelledby="headingOne" data-parent="#accordionExample"><div className="card-body"><ul className="iris_filter_1">{frShp}</ul></div></div></div>;
            }

            const _frameSize = this.state.frameSize;
            if(_frameSize.length > 0)
            {                
                let frShp = _frameSize.map((item, i) =>{
                    let _checked = '';
                    let _chk =  this.state.filterHeader.filter((data) => {
                        if(data.id == item.frameSize_id)
                        {
                            _checked = true;
                        }
                    })
                    return (                 
                        <li key={item.frameSize_id}><label className="check ">{item.frameSize_Name}<input type="checkbox" readOnly="" value={item.frameSize_id} checked={_checked} onChange={this.handleFilterboxChange.bind(this,item.frameSize_id,'frameSize',item.frameSize_Name)}/><span className="checkmark"></span></label></li>                                    
                    )
                })
                sizeData = <div key={1+5} className="card"><div className="card-header" id="headingOne"><h2 className="irisoptical mb-0"><button type="button" className="btn btn-link" data-toggle="collapse" data-target="#collapseFive">Frame Size<i className="fas fa-sort-down float-right"></i></button></h2></div><div id="collapseFive" className="collapse hide" aria-labelledby="headingOne" data-parent="#accordionExample"><div className="card-body"><ul className="iris_filter_1">{frShp}</ul></div></div></div>;
            }

            const _Genders = this.state.genders;
            if(_Genders.length > 0)
            {                
                let frShp = _Genders.map((item, i) =>{
                    let _checked = '';
                    let _chk =  this.state.filterHeader.filter((data) => {
                        if(data.id == item.gender_Id)
                        {
                            _checked = true;
                        }
                    })
                    return (                 
                        <li key={item.gender_Id}><label className="check ">{item.gender_Name}<input type="checkbox" value={item.gender_Id} readOnly="" checked={_checked} onChange={this.handleFilterboxChange.bind(this,item.gender_Id,'genders',item.gender_Name)}/><span className="checkmark"></span></label></li>                                    
                    )
                })
                genderData = <div key={1+6} className="card"><div className="card-header" id="headingOne"><h2 className="irisoptical mb-0"><button type="button" className="btn btn-link" data-toggle="collapse" data-target="#collapseSix">Gender<i className="fas fa-sort-down float-right"></i></button></h2></div><div id="collapseSix" className="collapse hide" aria-labelledby="headingOne" data-parent="#accordionExample"><div className="card-body"><ul className="iris_filter_1">{frShp}</ul></div></div></div>;
            }

            const _frameMaterial = this.state.frameMaterial;
            if(_frameMaterial.length > 0)
            {                
                let frShp = _frameMaterial.map((item, i) =>{
                    let _checked = '';
                    let _chk =  this.state.filterHeader.filter((data) => {
                        if(data.id == item.material_id)
                        {
                            _checked = true;
                        }
                    })
                    return (                 
                        <li key={item.material_id}><label className="check ">{item.material_Name}<input type="checkbox" readOnly="" value={item.material_id} checked={_checked} onChange={this.handleFilterboxChange.bind(this,item.material_id,'material',item.material_Name)}/><span className="checkmark"></span></label></li>                                    
                    )
                })
                materialData = <div key={1+7} className="card mb-LX"><div className="card-header" id="headingOne"><h2 className="irisoptical mb-0"><button type="button" className="btn btn-link" data-toggle="collapse" data-target="#collapseSeven">Material<i className="fas fa-sort-down float-right"></i></button></h2></div><div id="collapseSeven" className="collapse hide" aria-labelledby="headingOne" data-parent="#accordionExample"><div className="card-body"><ul className="iris_filter_1">{frShp}</ul></div></div></div>;
            }
            _sortData.push(typeData,shapeData,colorData,brandData,sizeData,priceData,genderData,materialData);
            return _sortData;
        }
    }

    render ()
    {
        if(this.state.isLoaded == true){
            _loader = 'glb-ldr-prt';
        }
        return (                
            <React.Fragment>
                <Helmet>
                    <title>IRIS Search Products / Collections</title>
                    <meta name="description" content="Search Products / Collections" />
                    <meta name="keywords" content="Search Products / Collections" />
                </Helmet>
                {/*Product List Page Filter Begins*/}
                <div className="iris_prolist">
                    {/*Product List Page Filter End*/}
                    {/*Product List Page Filter*/}
                    <section className="iris_product_listing" id={_hiddenDataList}>
                        <div className="row">
                            {/* Filter Product Option*/}
                            {/* <div className="col-lg-4 iris_PL_sidebar">
                                <div className="bs-example">
                                    <div className="accordion" id="accordionExample">
                                        {this.sortingArea()}
                                    </div>
                                </div>
                            </div> */}
                            {/* Filter Product Option End*/}

                            {/* Product List*/}
                            <div key="" className="col-lg-12 iris_PL_right_sidebar">
                                <div className="container iris_bredcrumb fullSizeBred">
                                    <div className="row">
                                        <div className="col-lg-4">
                                            <ul>
                                                <li><a href={global.BASE_URL}>Home </a><span className="breadSpce">&gt; </span></li>                                                
                                                <li>{this.Capitalize(_filterId.replace(/-/g, " "))}</li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-5 iris_product_list_top_middle" style={{display:'none'}}>
                                            <ul id="dittoView">
                                                <li style={{paddingRight: '20px !important'}}> Normal View </li>
                                                <li>
                                                    <label className="switch">
                                                        <input type="checkbox" />
                                                        <span className="slider round"></span>
                                                    </label>
                                                </li>
                                                <li> <img src={global.BASE_URL + "assets/img/iris_180D_img.jpg"} alt="" title="" /> </li>
                                                <li> Virtual Try-On </li>
                                            </ul>
                                        </div>
                                        <div className="col-lg-3" style={{display:'none'}}>
                                            <select className="iris_sort iris_sorts" onChange={this.handleSortboxChange.bind(this)}>
                                                <option value="none">Sort By</option>
                                                <option value="low">Price : Low to High</option>
                                                <option value="high">Price : High to Low</option>
                                            </select>
                                        </div>                                        
                                        <div className="clearfix"></div>
                                        <div className="activeFilters">
                                            <div className="show_filters">
                                                <span>
                                                    {
                                                        this.state.filterHeader.map((item) => {
                                                            return(
                                                            <li key={item.id}>{item.name}<button onClick={() => this.removeFilterHeader(item)}>x</button></li>
                                                            )
                                                        })                                                    
                                                    }
                                                </span>
                                            </div>                                        
                                        </div>
                                    </div>                                    
                                </div>

                                <div className="row" style={{marginTop: '-25px'}}>
                                    {/* {this.state.renderProducts}                                     */}
                                    {this.loadFilterData()}
                                </div>
                                <div className="iris_SM" style={{display:'none'}}>
                                    <ul>
                                        <li>Showing Results of 30 from 320</li>
                                        <li><a href="JavaScript:Void(0);">Show More</a> </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Product List End*/}        
                        </div>
                        
                    </section>
                    {/*Product List Page Filter*/} 

                    <section className="notFoundData" id={_hiddenDataNot}>
                        <div className="container">
                            <div className="row">                                
                                <div className="std col-lg-12">
                                    <div className="no-route">
                                        <div className="row damn">
                                            <div className="col-xs-6 damn-title">
                                                <p className="no-result-found">SORRY! NO PRODUCTS FOUND!!!</p>
                                            </div>                                            
                                        </div>
                                        <div className="row text-center">
                                            <div className="damn-text">Seems like the page you were looking for cannot be found. Don't worry.</div>
                                            <div className="damn-text">Click <a href={global.BASE_URL}>HERE</a> to go back to the home page.</div>
                                        </div>                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>                
                            
                    <Footer />   
                </div> 
                <div id="global_loader" className={_loader}>
                    <ProductListLoader />
                </div>       
            </React.Fragment>
        );
    }  
}

export default searchRecommend