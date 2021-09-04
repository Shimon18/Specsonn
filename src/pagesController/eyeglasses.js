import React, { Component } from 'react'
import Footer from '../containers/Footer';
import { Helmet } from 'react-helmet';
import {PostData} from '../service/postData';
import Slider from "react-slick";
import {userCartManage} from '../_commonFunction/userIrisCart';

const settings = {
    autoplay: true,
    autoplaySpeed: 8000,
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 3,
    speed: 3000,
    horizontal: true,
};

let _catId = '';
let _loader = 'glb-ldr-prt active';

class eyeglasses extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoaded:false,
            OtherSections:{},
            items:{},
            types:'glasses'
        }
    }

    componentDidMount () {
        const handle = this.props.match.params;
        _catId = handle.catsTxt;
        const catsTxt = handle.catsTxt;

        if(catsTxt == 'contact-lenses'){
            let _urlSections = global.contactLensHome+'?country_Id='+global.country_Ids+'&language_Id='+global.language_Ids;

            PostData(_urlSections,'','GET')
            .then(res => {
                if(res.dataCount == 0){
                    //window.location.href = global.BASE_URL+'not-found';
                }
                else{
                    //let _sectionsListing = res.sectionsData;
                    let _listing = res.response[0].labels;
                    let _result = userCartManage(localStorage,PostData,sessionStorage,'Export');
                    this.setState({items: _listing,isLoaded: true});
                }
            })  
            .catch(error => 'nj');
            this.setState({isLoaded: true,types:'lenses'});
        }
        else{
            let _urlSections = global.categorySectionList+'?country_Id='+global.country_Ids+'&language_Id='+global.language_Ids+'&category_Id='+catsTxt;

            PostData(_urlSections,'','GET')
            .then(res => {
                if(res.dataCount == 0){
                    window.location.href = global.BASE_URL+'not-found';
                }
                else{
                    let _sectionsListing = res.sectionsData;
                    let _listing = res.response;
                    _listing.forEach((items, index) => {
                        items.extraData.images.forEach((extraData, subChildIndex) => {
                                subChildIndex === 0 ? _listing[index].extraData.images[subChildIndex].isActive = true : _listing[index].extraData.images[subChildIndex].isActive = false
                        })            
                    });

                    let _result = userCartManage(localStorage,PostData,sessionStorage,'Export');
                    this.setState({items: _listing,OtherSections: _sectionsListing,isLoaded: true});
                }
            })  
            .catch(error => window.location.href = global.BASE_URL+'not-found');
        }

        
    }
    
    otherSection(otherSec){
        const _sectionBox = [];
        if(this.state.isLoaded === true)
        {
            let _homeSection = this.state.OtherSections;            
            for(let _p = 0; _p < _homeSection.length; _p++)
            {
                let _homeSectionItems = this.state.items;                
                const _sectionImageBox = [];

                let _startAct = '0';
                let _section_Tag_extra = '';
                
                if(_homeSectionItems.length > 2){
                    _homeSectionItems.map((item, i) =>
                    {
                        //console.log(_homeSection[_p].section_Id+' === '+item.section_Id);
                        if(_homeSection[_p].section_Id === item.section_Id)
                        {
                            if((_homeSection[_p].section_Tag2.length) > 1){
                                _section_Tag_extra = _homeSection[_p].section_Tag2;
                            }

                            let _active = 'item iris_product_single';
                            if(_startAct == 0)
                            {
                                _active = 'item iris_product_single active';
                            }
                            let _catsTxt = item.menuUrl;
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
                                
                                //console.log(item.product_Name_Display+'--->>'+_extraData_Imgs[_k].isActive);

                                if(_extraData_Imgs[_k].isActive){
                                    _baseImage = _imgUl;
                                    _actCls = 'active';
                                    _irisPrice = _fmIr;
                                    _irisSalePrice = _fmSlIr;

                                    let _commonMenu = _baseImageURL.replace(/\s/g, "-");
                                    _commonMenu = _commonMenu.toLowerCase();
                                    
                                    if(_extraData_Imgs[_k].product_Url == undefined || _extraData_Imgs[_k].product_Url == null){
                                        _baseImageURL = global.BASE_URL+_catsTxt+'/'+item.product_Url;
                                    }
                                    else{
                                        _baseImageURL = global.BASE_URL+_catsTxt+'/'+_extraData_Imgs[_k].product_Url;
                                    }
                                    //_baseImageURL = global.BASE_URL+_catsTxt+'/'+_extraData_Imgs[_k].product_Url;
                                    //console.log(_baseImageURL);
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
                                
                                //console.log(_baseImage_LR);
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

                                        _ColorSmallBox.push(<a key={_proids+_k} href={global.BASE_URL+_catsTxt+'/'+_extraData_Colrs[_k].product_Url} onMouseOver={this.mouseOver.bind(this, i, _k)}><span className={_actCls+" colorIcons"} id={_proids}><span className="colorIcons_colorTop" style={{'background':_spnColA}}><span className="colorIcons_colorBottom" style={{'background':_spnColB}}></span></span></span></a>);
                                    }
                                    else
                                    {
                                        _ColorSmallBox.push(<a key={_proids+_k} href={global.BASE_URL+_catsTxt+'/'+_extraData_Colrs[_k].product_Url} onMouseOver={this.mouseOver.bind(this, i, _k)}><img id={_proids} className={_actCls+" colorIcons"} src={item.colorPath+_extraData_Colrs[_k].colors_Hexa} alt={_extraData_Colrs[_k].colors_Name} style={{width:'15px'}} ></img></a>)
                                    }    
                                }                
                            }
                            
                            if(_irisPrice > 0){
                                _sectionImageBox.push(<div className={_active} id="sliderScrollSet" key={item.section_Id+_startAct}>
                                        <div className="small-images iris_colors">
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
                                );
                                _startAct++;
                            }
                        }                    
                    })
                }
                
                if(_sectionImageBox.length > 0){
                    _sectionBox.push(<section className="iris_home_best_seller" key={_homeSection[_p].section_Id}>
                        <div className="container">
                            <div className="iris_bs-head">
                                <span>{_homeSection[_p].section_Name}</span>
                                <p className="shortDesc1">{_homeSection[_p].section_Tag}</p>
                                <p className="shortDesc2">{_section_Tag_extra}</p>
                            </div>
                            <div id="mixedSlider">
                                <div className="MS-content">
                                <Slider {...settings}>{_sectionImageBox} </Slider>                      
                                </div>
                                {/* <div className="MS-controls">
                                    <button className="MS-left"><i className="fas fa-chevron-left"></i></button>
                                    <button className="MS-right"><i className="fas fa-chevron-right"></i></button>
                                </div> */}
                            </div>
                            <a href={global.BASE_URL+'promotions/'+_catId+'/'+_homeSection[_p].section_slug.toLowerCase()} className="iris_bs-btn">see all styles >></a>
                        </div>
                    </section>
                    );
                }
            }    
        }
        return(
            <div>{_sectionBox}</div>
        )
    }

    Capitalize = (str) =>{
        return str.charAt(0).toUpperCase() + str.slice(1);
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

    manageTopMenus_Eye_Sun(){
        return (
            <div className="glassSection">
                {/*Home Page Slider Begins*/}
                <section className="iris_inner_pages_banner">                        
                    <img src={global.BASE_URL + "assets/img/iris_inner_page_banner.jpg"} alt="" title=""/>
                </section>

                {/*Slider List begins*/}
                    {this.otherSection(this.state.OtherSections)}
                {/*Slider List Ends*/}

                {/* Page Image Begins*/}
                <section className="iris_inner_pages_banner">
                    <img src={global.BASE_URL + "assets/img/iris-category_inner_bottom_banner.jpg"} alt="" title="" />
                </section>
            </div>
        )
    }

    CL_listngArea(){
        const _sectionBox = [];
        
        if(this.state.isLoaded === true)
        {
            let _homeSection = this.state.items;
                  
            for(let _p = 0; _p < _homeSection.length; _p++)
            {
                const _childBox = [];
                //console.log(_homeSection[_p]);
                let _title = _homeSection[_p].labelText;  
                // if(_homeSection[_p].labelText == 'Brands' || _homeSection[_p].labelText == 'BRANDS'){
                //     _title = 'Brands';
                // }
                // else if(_homeSection[_p].labelText == 'Explore By Disposability' || _homeSection[_p].labelText == 'EXPLORE BY DISPOSABILITY'){
                //     _title = 'Disposability';
                // }
                // else if(_homeSection[_p].labelText == 'Explore By Colors'){
                //     _title = 'Colors';
                // }

                let _childLinks = _homeSection[_p].sub_menu;
                for(let _m = 0; _m < _childLinks.length; _m++){
                    
                    let _commonMenu = _homeSection[_p].labelText_en.replace(/\s/g, "-").toLowerCase();
                   
                    _childBox.push(                        
                            <li key={_childLinks[_m].filterMenu_Id}>
                                <a href={global.BASE_URL+'contact-lenses/list/'+_commonMenu+'/'+_childLinks[_m].menuUrl}><span>{_childLinks[_m].subMenu}</span><span className="pull-right"><i className="fas fa-caret-right actionBt"></i></span></a>
                            </li>
                    )
                }

                if(_childLinks.length > 0){
                    _sectionBox.push(
                        <div className="col-lg-3" key={_homeSection[_p].label_Id}>
                            <div className="iris_cntl_A">
                                <h6>{_title}</h6>
                                <ul>{_childBox}</ul>                            
                            </div>
                        </div>
                    );
                }
                
            }    
        }
        return(
            <div className="row">{_sectionBox}</div>
        )
    }

    manageTopMenus_CL(){
        return (
            <div className="glassSection">
                {/*Home Page Slider Begins*/}                    
                <section className="iris_inner_pages_banner iris_cntl">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1>Contact Lens</h1>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Page Image Begins*/}
                <section className="iris_contact_lens">
                    <div className="container">                        
                        {this.CL_listngArea()}                        
                    </div>
                </section>
            </div>
        )
    }

    render () {
        
        if(this.state.isLoaded == true){
            _loader = 'glb-ldr-prt';
        }

        let _hideAll = '';
        if(this.state.types == 'lenses'){
            _hideAll = this.manageTopMenus_CL();
        }
        else{
            _hideAll = this.manageTopMenus_Eye_Sun();
        }

        return (
            <React.Fragment>
                <div>
                    <Helmet>
                        <title>{this.Capitalize(_catId)} | Iris Boutiq</title>
                        <meta name="description" content={this.Capitalize(_catId)+" | Iris Boutiq"} />
                        <meta name="keywords" content={this.Capitalize(_catId)+" | Iris Boutiq"} />
                    </Helmet>
                    {_hideAll}
                </div>
            
            {/* Page Image Ends*/}
            <Footer />
            <div id="global_loader" className={_loader}>
                <div className="gl-ldr-cld">
                    <img id="loaderIcon" src={global.BASE_URL+'assets/img/loaderx.gif'} />
                </div>
            </div>
            </React.Fragment>            
        )
    }
}

export default eyeglasses