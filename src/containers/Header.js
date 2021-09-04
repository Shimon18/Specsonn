// Header.js
import React, {Component} from 'react';
import Menus from './Menus';
import {chkExpireStorage} from '../service/localStorage';
import AutoSuggetion from '../containers/AutoSuggetion';
import {PostData} from '../service/postData';
import {userCartManage} from '../_commonFunction/userIrisCart';

import enLang from '../translations/en.json';
import arLang from '../translations/ar.json';

var Modal = require('react-bootstrap-modal');

userCartManage(localStorage,PostData,sessionStorage,'setGlobalCountry');
let _localCountriesIds = global.country_Ids;
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

let _headTxt = '';
if(global.lang == 'en'){
    _headTxt = enLang;
}
else{
    _headTxt = arLang;
}

//localStorage.clear();
chkExpireStorage('Local', '5','chkExpire');

if(window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up' || window.location.pathname === '/sign-in/' || window.location.pathname === '/sign-up/' || window.location.pathname === '/insurance-member'  || window.location.pathname === '/insurance-member/')
{
    
}
else{
    localStorage.setItem('irisBackUrl',window.location.href);
    localStorage.setItem('countryId',1);
    localStorage.setItem('languageId',1);
}


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

let _searchtxt = '';

export default class Header extends Component {
    constructor(props) {
        super(props);
            //this.handleClick = this.handleClick.bind(this);
            //this.handleOutsideClick = this.handleOutsideClick.bind(this);
            this.state = {
                _countryLang:'ar',
                _countryReg:'iti__hide',
                _countrySelected: {},                
                cartEmptyModalIsOpen : false,
                autoSuggestModalIsOpen: false,
                trendingShow : false,
                listingShow : false,
                _serachData : [],
                _countryList : {},
                _languageList : {},
                isLoaded : false
            }
    }
    
    async componentDidMount ()
    {
        let irisCart = localStorage.getItem('irisCart');
        let cartCount = 0;
        if(irisCart == undefined || irisCart == null)
        {
            //irisCart = JSON.parse(irisCart);
            //cartCount = irisCart.items.length;
        }
        else{
            irisCart = JSON.parse(irisCart);
            cartCount = irisCart.items ? irisCart.items.length : 0;
        }
        document.getElementById('counterCount').innerHTML = cartCount;
        
        let _countryData = global.userAllCountry;
        let conList = await PostData(_countryData,'','GET');

        let _dfId = this.state._countrySelected.country_Id ? this.state._countrySelected.country_Id : 0;
        let _selectCountry = [];
        let _selectedLangs = [];
        conList.response.map((items, index) => {            
            if(_localCountriesIds == items.country_Id && _dfId == 0){
                _selectCountry.push(items);
                _selectedLangs.push(items.language);
            }
        });
        this.setState({_countryList:conList.response,isLoaded:true,_countrySelected:_selectCountry,_languageList:_selectedLangs});
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    myReff = React.createRef();

    handleClickOutside = e => {
        if (!this.myReff.current.contains(e.target)) {
          this.setState({ trendingShow: false });
        }
    };
    
    handleClickInside = () => this.setState({ trendingShow: true });

    handleLoad() {  
        //console.log('Initiate sync custom ... Js');      
        const script = document.createElement("script");
        script.src = global.BASE_URL+'assets/js/custom.js';
        script.async = true;
        document.body.appendChild(script);        
    }

    logout() {
        localStorage.removeItem('irisUserSession');
        localStorage.removeItem('irisCart');
        global._sessiontoken = 0;
        global._sessionUser = 0;
        global._sessionOuth = 0;
        window.location.href = ("/");
    }
    
    getUserLoggedMenu(){
        let _loggedMenu = [];
        // const searchbarshow = () =>{
        //     documentGetE
        // }
        if(_userId > 0){
            _loggedMenu.push(
                <ul className="col-lg-12" key='mt90'>
                    <li className="iris_1"><a href="#section" onClick={this.openModalHandler.bind(this)}>&nbsp;</a></li>
                    <li className=""><a className="mobile_view" href={global.BASE_URL+'wish-list'}>&nbsp;</a></li>
                    <li style={{display: 'none'}}><a href={global.BASE_URL}>&nbsp;</a></li>
                    <li><a href={global.BASE_URL+'viewcart'}>&nbsp;</a><span ref="counterCount" id="counterCount">{this.props._cartCount}</span></li>

                                    
                    <li>
                        <a href={global.BASE_URL + "customer-dashboard"} className="activeLog">&nbsp;</a>
                        <span className="iris_logedin_txt">{irisUserSession.smallName}</span>
                    </li>

                    <li  className="iris_logedin mobile_view" id="hiddenData">
                        <a href={global.BASE_URL + "customer-dashboard"}>
                            <div className="iris_logedin_img">
                                <img src={global.BASE_URL + "assets/img/login-signup-icon-hover.png"} alt={irisUserSession.smallName} title={irisUserSession.smallName} />
                            </div>
                            <div className="iris_logedin_txt">
                                <span>{irisUserSession.smallName}</span>
                            </div>
                            <div className="clearfix"></div>
                        </a>
                    </li>              
                </ul>
            );
        }
        else{
            _loggedMenu.push(
                <ul className="col-lg-12 header_ul" key='mt90'>
                    <li className="iris_1"><a href="#section" onClick={this.openModalHandler.bind(this)}>&nbsp;</a></li>
                    <li className="mobile_view"><a href={global.BASE_URL+'wish-list'}>&nbsp;</a></li>
                    <li style={{display: 'none'}}><a href={global.BASE_URL}>&nbsp;</a></li>
                    <li><a href={global.BASE_URL+'viewcart'}>&nbsp;</a><span ref="counterCount" id="counterCount">{this.props._cartCount}</span></li>                            
                    <li className="mobile_view"><a href={global.BASE_URL + "sign-in"}>&nbsp;</a></li>
                    <li className="desktop_view" onClick={ () => {this.showSearch()} }><img src={global.BASE_URL + "assets/img/search-button.png"} alt="description" width="24" /></li>



                </ul>
            );
        }

        return _loggedMenu;
    }

    openModalHandler(value){
        this.setState({
            autoSuggestModalIsOpen: true
        })
    }

    clickSearchHandle(){
        if(_searchtxt.length > 2){
            window.location.href = global.BASE_URL+'catalogsearch/result/?search='+_searchtxt
        }        
    }

    autoSearchApi(e){
        _searchtxt = e;
        let _urlData = global.searchAutoText+global.country_Ids+'/'+global.language_Ids+'/'+e;        

        PostData(_urlData,'','GET')
        .then(res => {
            let _listing = res.response;
            this.setState({_serachData:_listing});
        });
    }

    autoCompleteSearch(e){
        let _autoTxt = e.target.value;
        if(_autoTxt.length > 2){
            this.autoSearchApi(_autoTxt);
        }
        else{
            this.setState({_serachData:[]});
        }
    }

    closeModalHandler = () => {
        this.setState(prevState => ({
            autoSuggestModalIsOpen: !prevState.autoSuggestModalIsOpen,
        }));
    }

    countryListing(){
        let data = '';
        if(this.state.isLoaded == true)
        {
            data = this.state._countryList.map((item, i) =>
            {
                let _langArr = item.language;
                return(
                    <li key={i} className="iti__country iti__standard" id="iti-item-in" onClick={this.selectCounties.bind(this,item,_langArr[0].lang)}>                        
                        <div className="iti__flag-box">
                            <div className="iti__flag"><img alt="usd" src={item.image}/></div>
                        </div>
                        <span className="iti__country-name">{item.country_Iso}</span>
                    </li>
                )
            })
        }
        return data;
    }

    selectCounties(data,lang,e){
        irisCountrySession = {}; 
        var obj = {};
        if(data.language.length > 0){
            for(let _i = 0; _i < data.language.length; _i++){
                if(data.language[_i].lang == 'en'){
                    obj.lang = data.language[_i].lang;
                    obj.language_Ids = data.language[_i].id;
                }
            }
        }
        
        obj.country_Iso = data.country_Iso;
        obj.currencyCode = data.country_Currency;
        obj.country_Ids = data.country_Id;
        obj.icon = data.image;
        irisCountrySession = (obj);
        localStorage.setItem('irisCountrySession', JSON.stringify(irisCountrySession));

        window.location.reload();
    }

    manageMultiCounties(){
        this.setState({
            _countryReg:'',
        })
    }

    onMouseLeaveHandler() {
        this.setState({
            _countryReg:'iti__hide',
        })
    }

    changeLanguage(e,i){
        let irisCountrySession = {}; 
        var obj = {};

        obj.lang = e.item.lang;
        obj.language_Ids = e.item.id;
        obj.country_Iso = global.country_Iso;
        obj.currencyCode = global.currencyCode;
        obj.country_Ids = global.country_Ids;
        obj.icon = global.icon;
        irisCountrySession = (obj);
        localStorage.setItem('irisCountrySession', JSON.stringify(irisCountrySession));
        window.location.reload();
    }

    langsListing(){
        let data = '';
        if(this.state.isLoaded == true)
        {
            //console.log(this.state._countrySelected[0].language);
            data = this.state._countrySelected[0].language.map((item, i) =>
            {
                //console.log(item.lang+'--------'+item.id+' !== '+global.language_Ids);
                let langNxt = '';
                let langNxt_Id = '';
                if(parseInt(item.id) !== parseInt(global.language_Ids)){
                    if(item.lang == 'ar'){
                        langNxt = 'العربية';
                    }
                    else{
                        langNxt = 'English';
                    }
                    langNxt_Id = item.id;
                    return(
                        <div key={item.id} id="langClick" onClick={this.changeLanguage.bind(this,{item})}>{langNxt}</div>
                    )
                }                
            })
        }
        return data;
    }

    showSearch = () => {

        if (
            document.getElementById("Searchbar")
          ) {
            document.getElementById("Searchbar").style.height = "44px";
          }
        };

    render(){
        return (
            <React.Fragment>
            <header className="header fixed-top" id="headerContainer">
                <section className="iris_top_header">
                    <div className="container">
                        <div className="row">
                        <div className="col-lg-3 iris_logo_div"> 
                            <div className="iris_logo_top">
                                <a href={global.BASE_URL}>
                                    <img src={global.BASE_URL + "assets/img/main_logo_iris_new.png"} alt="Logo" title="Iris Boutiq" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 iris_top_middle_search_box">
                            <div className="input-group" ref={this.myReff} id="Searchbar">
                                <input className="typeahead form-control" type="text" placeholder={_headTxt.place_search} aria-label={_headTxt.place_search} onClick={this.handleClickInside} onChange={this.autoCompleteSearch.bind(this)} autoComplete="false"/>
                                <div className="input-group-addon" style={{marginLeft: '-30px', zIndex: 3,marginRight: '6px'}}>
                                    <button className="iris_top_middle_search_btn" onClick={this.clickSearchHandle.bind()} type="submit" style={{background:'none', border:'none'}}>
                                    <img src={global.BASE_URL + "assets/img/search-button.png"} alt="description" width="24" /></button>
                                </div>
                                <div className="autotrending" id={this.state.trendingShow ? 'shownData' : 'hiddenData'}>
                                {
                                    this.state._serachData.length > 0 ?
                                    
                                        <div className="autotrending_block">
                                            <h3> Product Search </h3>
                                            <ul className="autotrending_list menu-link">
                                            {
                                                this.state._serachData.map((item,index) => {
                                                    let _urlClick = global.BASE_URL+item.type+'/'+item.url;
                                                    let _priceSh = 'SAR '+item.amount;
                                                    if(item.name.length < 15 && item.count > 1){
                                                        _priceSh = 'Products : '+item.count;
                                                        _urlClick = global.BASE_URL+'catalogsearch/result/?search='+item.name;
                                                    }

                                                    return(                                        
                                                    <li key={index}>
                                                        <img src={item.image} />
                                                        <a className="title" href={_urlClick}>{item.name}</a>
                                                        {/* onClick={this.clickSearchLink.bind(this,item.name,item.count)} <div className="description">Effortlessly cool</div> */}
                                                        <div className="price">{_priceSh}</div>
                                                    </li>
                                                    )
                                                })
                                            }                            
                                            </ul>
                                        </div>                        
                                    :                    
                                        <div className="autotrending_block">
                                            <h3> {_headTxt.searchpage.title} </h3>
                                            <ul className="autotrending_list menu-link">
                                                <li><a href={global.BASE_URL+"eyeglasses/collection/iris-collection"}>{_headTxt.searchpage.iris}</a></li>
                                                <li><a href={global.BASE_URL+"eyeglasses"}>{_headTxt.searchpage.eyeglass}</a></li>
                                                <li><a href={global.BASE_URL+"sunglasses"}>{_headTxt.searchpage.sunglass}</a></li>
                                                <li><a href={global.BASE_URL+"contact-lenses"}>{_headTxt.searchpage.contact}</a></li>
                                                <li><a href={global.BASE_URL+"gender/men"}>{_headTxt.searchpage.menglass}</a></li>
                                                <li><a href={global.BASE_URL+"gender/women"}>{_headTxt.searchpage.womenglass}</a></li>
                                            </ul>
                                        </div>                
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 iris_div_A">
                            <div className="iris_top_right_1" style={{display: 'none'}}>
                                <ul> 
                                    <li><a href={global.BASE_URL}>>Refer & Earn</a></li>
                                    <li><a href="tel:9876543210"><img src={global.BASE_URL + "assets/img/call-icon.png"} alt="description"/>9876543210</a></li>
                                </ul>
                            </div>
                            <div className="iris_top_right_2 row">
                                {this.getUserLoggedMenu()}
                            </div>
                        </div>
                        </div>
                    </div>
                </section>
                <section className="iris_main_menu">
                    <Menus />
                    <div className="iris_top_currency_country">                        
                        <ul> 
                            <li className="countryFlag-container" onMouseEnter={this.manageMultiCounties.bind(this)} onMouseLeave={this.onMouseLeaveHandler.bind(this)}>
                                <div className="button">
                                    <span>
                                        <img alt="usd" src={global.icon}/> {global.country_Iso} <i className="fa fa-angle-down" aria-hidden="true"></i>
                                    </span>
                                </div>
                                <ul className={this.state._countryReg +" iti__country-list iti__country-list--dropup"} id="country-listbox" aria-expanded="false" role="listbox" aria-activedescendant="iti-item-ad"> 
                                    {this.countryListing()}
                                </ul>
                            </li>
                            <li>
                                {this.langsListing()}                                
                            </li>
                        </ul>
                    </div>
                    <div className="clearfix"></div>
                    </section>
            </header>

            {/* Auto Suggetion Modal Begins */} 
            
            {/* <Modal isOpen={this.state.autoSuggestModalIsOpen} onClick = {() => { console.log("Modal has been closed.") } } id="exampleModal_1">
                <AutoSuggetion closeModalHandler={this.closeModalHandler} closeButton/>
            </Modal> */}
            
            <Modal show={this.state.autoSuggestModalIsOpen} onHide={this.closeModalHandler} id="exampleModal_1">            
                <Modal.Body>
                <AutoSuggetion closeModalHandler={this.closeModalHandler}/>
                </Modal.Body>
            </Modal>
      
            {/* Auto Suggetion modal Ends */}
            </React.Fragment>
        )       
    }
}