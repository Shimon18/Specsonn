import React, { Component } from 'react'
import {PostData} from '../service/postData';
import Footer from '../containers/Footer';
import { Helmet } from 'react-helmet';
import Slider from "react-slick";
import {userCartManage} from '../_commonFunction/userIrisCart';

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

let _homeTxt = '';
if(global.lang == 'en'){
    _homeTxt = enLang;
}
else{
    _homeTxt = arLang;
}

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

class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoaded:false,
            topOffers:{},
            topOtherSections:{},
            items:{},
            homeBannner_Img: global.BASE_URL+'assets/img/iris_new_banner.jpg',
            homeBannner_Title:'spring 19',
            homeBannner_Desc:'The leader in premium eyewear market. Discover the latest collection of eyeglasses at the nearest store. Styles starting SAR 50.',
        }
    }

    componentDidMount(){
        const handle = this.props.match.params;
        let _bannerImg = this.state.homeBannner_Img;
        let _bannerDesc = this.state.homeBannner_Desc;
        let _bannerTitle = this.state.homeBannner_Title;

        let _result = userCartManage(localStorage,PostData,sessionStorage,'Export');

        let _urlHomeBanner = global.homeBannerList+'?country_Id='+global.country_Ids+'&language_Id='+global.language_Ids;
        PostData(_urlHomeBanner,'','GET')
        .then(result => {
            //console.log(result.response);
            if(result.response.length > 0){
                let _homeBanner = result.response[0];
                _bannerImg = _homeBanner.banner_Image;
                _bannerDesc = _homeBanner.banner_Desc;
                _bannerTitle = _homeBanner.banner_Name;
            }

            let _urlData = global.homeSectionTopOffers+'?country_Id='+global.country_Ids+'&language_Id='+global.language_Ids;
            PostData(_urlData,'','GET')
            .then(res => {
                let _topOfferslisting = res.response;

                let _urlSections = global.homeSectionTopOffersList+'?country_Id='+global.country_Ids+'&language_Id='+global.language_Ids;

                PostData(_urlSections,'','GET')
                .then(res => {
                    
                    let _sectionsListing = res.sectionsData;
                    let _listing = res.response;
                    if(Array.isArray(_listing) && _listing.length)
                    {
                        _listing.forEach((items, index) => {
                            items.extraData.images.forEach((extraData, subChildIndex) => {
                                    subChildIndex === 0 ? _listing[index].extraData.images[subChildIndex].isActive = true : _listing[index].extraData.images[subChildIndex].isActive = false
                            })            
                        });
                    }
                    
                    this.setState({items: _listing,topOtherSections: _sectionsListing,topOffers:_topOfferslisting, isLoaded: true,homeBannner_Img:_bannerImg,homeBannner_Desc:_bannerDesc,homeBannner_Title:_bannerTitle});
                });           
            }) 
            .catch(error => this.setState({ error, isLoaded: false }));
        })    
    }

    topOffersSection(topOffer){
        const _topBox = [];
        if(this.state.isLoaded === true)
        {
            let _topOffers = this.state.topOffers;
                for(let _p = 0; _p < _topOffers.length; _p++)
                {
                    let _urlSlug = _topOffers[_p].section_slug.toLowerCase();
                    _topBox.push(<div className="col-lg-3 iris_ctg_block" key={_topOffers[_p].section_Id}><a href={global.BASE_URL+'offers/'+_urlSlug} className="iris_ctg_title">{_topOffers[_p].section_Name}</a><div className="iris_ctg_img"><a href={global.BASE_URL+'offers/'+_urlSlug}><img src={_topOffers[_p].section_Image} alt={_topOffers[_p].section_Name} title={_topOffers[_p].section_Name} /></a></div><p className="iris_ctg_dsc">{_topOffers[_p].section_Tag}</p></div>
                    );
                }    
        }
        return(
            <div className="row">{_topBox}</div>
        )
    }

    otherHomeSection(otherSec){
        const _sectionBox = [];
        if(this.state.isLoaded === true)
        {
            let _homeSection = this.state.topOtherSections;
            for(let _p = 0; _p < _homeSection.length; _p++)
            {
                
                let _homeSectionItems = this.state.items;
                const _sectionImageBox = [];

                let _startAct = '0';
                let _section_Tag_extra = '';
                let data = '';
                if(_homeSectionItems.length > 2){
                    data = _homeSectionItems.map((item, i) =>
                    {
                        if((_homeSection[_p].section_Tag2.length) > 1){
                            _section_Tag_extra = _homeSection[_p].section_Tag2;
                        }
                        if(_homeSection[_p].section_Id === item.section_Id)
                        {
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
                                
                                if(_extraData_Imgs[_k].isActive){
                                    _baseImage = _imgUl;
                                    _actCls = 'active';
                                    _irisPrice = _fmIr;
                                    _irisSalePrice = _fmSlIr;

                                    let _commonMenu = _baseImageURL.replace(/\s/g, "-");
                                    _commonMenu = _commonMenu.toLowerCase();
                                    
                                    _baseImageURL = global.BASE_URL+_catsTxt+'/'+_extraData_Imgs[_k].product_Url;
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
                                
                                if(_extraData_Colrs.length > 0)
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
                            <a href={global.BASE_URL+'offers/'+_homeSection[_p].section_slug} className="iris_bs-btn">see all styles >></a>
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

    render () {
        
        return (
            <React.Fragment>
                <Helmet>
                    <title>Iris Boutiq</title>
                    <meta name="description" content="Iris Boutiq" />
                    <meta name="keywords" content="Iris Boutiq" />
                </Helmet>
            {/*Home Page Slider Begins*/}
            <section className="iris_home_slider">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12">
                    <div id="demo" className="carousel slide" data-ride="carousel">                                             
                      <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="row">
                              <div className="col-lg-5">                              
                                <h2>{this.state.homeBannner_Title}</h2>
                                <p>{this.state.homeBannner_Desc}</p>
                                <a href={global.BASE_URL+'gender/men'}>{_homeTxt.shopmen} ></a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <a href={global.BASE_URL+'gender/women'}>{_homeTxt.shopwomen} ></a>
                              </div>
                              <div className="col-lg-7">
                                <img src={this.state.homeBannner_Img} alt="" title="" />
                              </div>
                            </div>
                        </div>                            
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/*Home Page Slider Ends*/}
            
            {/*Home Page First Category Block Begins*/}
            <section className="iris_home_category">            
                {this.topOffersSection(this.state.topOffers)}                
            </section>
            {/*Home Page First Category Block Ends*/}

            {/*Home Page best Seller begins*/}
            {this.otherHomeSection(this.state.topOtherSections)}
            {/*Home Page Steel Rimmed Ends*/}
            <Footer />
            </React.Fragment>            
        )
    }
}

export default Home