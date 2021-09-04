// SideBar.js

import React, {Component} from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import {PostData} from '../service/postData';
import enLang from '../translations/en.json';
import arLang from '../translations/ar.json';


let _arrowTxt = 'fa fa-angle-left hide';
let _headTxt = arLang;

export default class Menus extends Component {

    constructor(props) {
        super();
        this.state = {
            allMenus: [],
            isLoaded: false,
            isHovered: false,
            focused : 0,
            active: false,
        };

    }

    componentDidMount ()
    {
        if(global.lang == 'en'){
            _headTxt = enLang;
            _arrowTxt = 'fa fa-angle-right hide';
        }

        let _menu_GetData = global.webMenu+'?country_Id='+global.country_Ids+'&language_Id='+global.language_Ids;
        PostData(_menu_GetData,'','GET')
        .then(result => {
            let _listing = this.state.allMenus;
            _listing.push(result.data);            
            if(result.status === 200)
            {                
                this.setState({allMenus: _listing[0]});
            }
        })
        .then(allMenus => {
            this.setState({isLoaded: true});
        })
        .catch(error => this.setState({ error, isLoaded: false }));   
    }

    handleHoverChild(e,f){
        this.setState(prevState => ({
            isHovered: !prevState.isHovered,
            focused: e
        }));   
    }

    
    megaMenuHere(){
        const {allMenus } = this.state;
        //let _returnMenu = '';

        let _returnMenu = [];
        if(allMenus.length > 1)
        {            
            allMenus.map((item, i) =>
            {                                
                let _menuTxt = item.menuText_en;
                _menuTxt = _menuTxt.replace(/ /g, '-');
                _menuTxt = _menuTxt.toLowerCase();
                
                
                let _isGenderActive = '0';
                let _childMenu = [];
                let _childGenderDiv = [];
                let _hideDive= 'NALinks';

                if(item.genders.length > 0){
                    
                    _isGenderActive = '0';
                    _hideDive = 'NA';
                    // Check Child Gender then Submenu
                    if(item.genders.length == 1){
                        if(item.genders[0].genderText == 'NA'){
                            _hideDive = 'NALinks';
                        }
                        else if(item.genders[0].genderText == 'NILL'){
                            _hideDive = 'NILLLinks';
                        }
                        else{
                            _hideDive = 'Links';
                        }
                    }
                    let _authKey1 = '2541';
                    for(var _g = 0; _g < item.genders.length; _g++){
                        _authKey1++;
                        let _isGender = [];
                        let _isLabel = [];
                        

                        _isGenderActive = '0';

                        let _genderData = item.genders;
                        if(_genderData[_g].labels.length > 0 && _genderData[_g].genderText != 'NA'){
                            _isGenderActive = '1';

                            _isGender.push(
                                <div className="gender_info" key={'nj'+_genderData[_g].genderM_Id}>
                                    <span className="uppercase">{_genderData[_g].genderText}</span>
                                    <div className="gender_img">
                                        <img alt={_genderData[_g].genderText} title={_genderData[_g].genderText} src={global.BASE_IMG_URL+'gender/'+_genderData[_g].gender_Image} width="48" height="48" />
                                    </div><i className="fa fa-angle-right float-right"></i>
                                </div>
                            );
                        }

                        // Create Gender Div Here                        
                        if(item.genders[_g].labels.length > 0){
                            let _labelData = item.genders[_g].labels;
                            let _authKey = '9685';
                            let _ay = '323232';
                            // Create Label Div Here
                            for(var _l = 0; _l < _labelData.length; _l++){
                                //_authKey++;
                                _ay++;
                                
                                let _isSubMenu = [];

                                let _subMenuData = _labelData[_l].sub_menu;
                                // Create Label Div Here
                                for(var _m = 0; _m < _subMenuData.length; _m++){
                                    _authKey++;

                                    if(item.menu_Id == 3){
                                        _menuTxt = 'contact-lenses/list';
                                    }

                                    let _commonMenu = _labelData[_l].labelText_en.replace(/\s/g, "-");
                                    if(_labelData[_l].labelText_en === 'Our Top Picks')
                                    {
                                        _commonMenu = 'collections';
                                    }

                                    let _stopRemain = '6';
                                    //let _addViewAll = [];
                                    if(_labelData[_l].labelText_en === 'EXPLORE BY COLORS')
                                    {
                                        if(_stopRemain == _m){
                                            _isSubMenu.push(
                                                <div className="nav-level-4" key={_authKey}>
                                                    <a className="nav-level-4-item" href={global.BASE_URL+'contact-lenses'}>
                                                    <span><b>{_headTxt.viewallcolor}</b></span><i className={_arrowTxt}></i>
                                                    </a>
                                                </div>
                                            )
                                            break;
                                        }
                                        else{
                                            _commonMenu = _commonMenu.toLowerCase();

                                            _isSubMenu.push(
                                                <div className="nav-level-4" key={_authKey}>
                                                    <a className="nav-level-4-item" href={global.BASE_URL+_menuTxt+'/'+_commonMenu+'/'+_subMenuData[_m].menuUrl}>
                                                    <span>{_subMenuData[_m].subMenu}</span><i className={_arrowTxt}></i>
                                                    </a>
                                                </div>
                                            );
                                        }
                                    }
                                    else{
                                        _commonMenu = _commonMenu.toLowerCase();

                                        _isSubMenu.push(
                                            <div className="nav-level-4" key={_authKey}>
                                                <a className="nav-level-4-item" href={global.BASE_URL+_menuTxt+'/'+_commonMenu+'/'+_subMenuData[_m].menuUrl}>
                                                <span>{_subMenuData[_m].subMenu}</span><i className={_arrowTxt}></i>
                                                </a>
                                            </div>
                                        );
                                    }                                    
                                }

                                _isLabel.push(
                                    <div className="nav-level-3" key={_ay}>
                                        <a href="" className="nav-head display-block cursor-auto">
                                            <span>{_labelData[_l].labelText}</span>
                                        </a>
                                        <div className="sub-child" key={_authKey}>
                                            {_isSubMenu}
                                        </div>
                                    </div>    
                                );
                            }
                        }

                        if(_isGenderActive == '1'){
                            _childMenu.push(
                                <div className={this.state.focused == _g ? 'gender active' : 'gender '} key={_g} onMouseOut={this.handleHoverChild.bind(this,_g)} onMouseOver={this.handleHoverChild.bind(this,_g)}>
                                    {_isGender}
                                    <div className="display-none gender_category submenu gender-kids" key={_authKey1}>
                                        <div className="nav-subcategory-level count_2">
                                                {_isLabel}                                                
                                        </div>
                                    </div>
                                </div>                                        
                            );
                        }
                        
                        else{
                            _childMenu.push(                                
                                <div className="nav-subcategory-level count_2" key={_g}>
                                        {_isLabel}                                                
                                </div>                                                                         
                            );
                        }
                    }
                }
                
                if(_hideDive == 'NALinks'){
                    _returnMenu.push (
                        <div>
                        <div className="nav-level-1 DesktopView" key={'mm'+item.menu_Id}>
                            <a className="" href={global.BASE_URL+item.menuUrl}>{item.menuText}</a>
                            <div className="nav-level-acc nav-nogender">
                                <div className="nav-level-2">
                                    <div className="nav-subcategory-level count_5">
                                        {_childMenu}                                        
                                    </div>
                                </div>
                            </div>    
                        </div>

                        <div className="nav-level-1 MobileView" key={'mm'+item.menu_Id}>

                        <Accordion allowZeroExpanded>
                                            <AccordionItem>
                                                <AccordionItemHeading>
                                                    <AccordionItemButton>
                                                            <div className="d-flex justify-content-between">
                                                                 <a className="sidemenufont" href={global.BASE_URL+item.menuUrl}>{item.menuText}</a>
                                                                <button className="transparent_btn"  onClick={this.showSubmenu} ><i className="fa fa-chevron-right"></i></button>
                                                            </div>
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                             <div>
                                                             {_childMenu} 
                                                            </div> 
                                                </AccordionItemPanel>
                                            </AccordionItem>
                                        
                                </Accordion>


                        {/* <a className="" href={global.BASE_URL+item.menuUrl}>{item.menuText}</a>
                        <div className="nav-level-acc nav-nogender">
                            <div className="nav-level-2">
                                <div className="nav-subcategory-level count_5">
                                    {_childMenu}                                        
                                </div>
                            </div>
                        </div>     */}
                        </div>

                        </div>
                    );
                }
                else if(_hideDive == 'NILLLinks'){
                    _returnMenu.push (<div className="nav-level-1" key={'mm'+item.menu_Id}>
                        <a className="" href={global.BASE_URL+item.menuUrl}>{item.menuText}</a>
                    </div>)
                }
                else{
                    _returnMenu.push (
                        <div>
                        <div className="nav-level-1 three-col-layout DesktopView" key={'mm'+item.menu_Id}>
                            <a className="" href={global.BASE_URL+item.menuUrl}>{item.menuText}</a>
                            <div className="nav-level-acc">
                                <div className="nav-level-2">
                                    <div className="gender-menu">
                                        <div className="gender-menu-section menu-line-section">
                                            {_childMenu}
                                        </div>
                                    </div>
                                </div>
                            </div>    
                        </div>

                        <div className="nav-level-1 three-col-layout MobileView" key={'mm'+item.menu_Id}>
                                <Accordion allowZeroExpanded>
                                            <AccordionItem>
                                                <AccordionItemHeading>
                                                    <AccordionItemButton>
                                                            <div className="d-flex justify-content-between">
                                                                <a className="sidemenufont" href={global.BASE_URL+item.menuUrl}>{item.menuText}</a>
                                                                <button className="transparent_btn"  onClick={this.showSubmenu} ><i className="fa fa-chevron-right"></i></button>
                                                            </div>
                                                    </AccordionItemButton>
                                                </AccordionItemHeading>
                                                <AccordionItemPanel>
                                                <div>
                                                                {_childMenu}
                                                            </div> 
                                                </AccordionItemPanel>
                                            </AccordionItem>
                                        
                                </Accordion>
                        </div>

                        </div>

                        
                    );
                }       
            });
        }
        return _returnMenu;
    }

    hideSidebar = () => {

        if (
            document.getElementById("navbarSupportedContent")
          ) {
            document.getElementById("navbarSupportedContent").style.width = "0";    
          }
        };

    showSidebar = () => {

        if (
            document.getElementById("navbarSupportedContent")
            ) {
            document.getElementById("navbarSupportedContent").style.width = "100vw";    
            }
        };

 
            // showSubmenu = () => {

            //     if (
            //         document.getElementById("Submenugender")
            //       ) {
            //         document.getElementById("Submenugender").style.height = "auto";
            //       }
            //     };
    render(){
        
        function nextChar(c) {
            return String.fromCharCode(c.charCodeAt(0) + 1);
        }        
                
        if(this.state.isLoaded === true)
        {
            
        }

   
                    
        
        return (
            <div className="mm">
                <nav className="navbar navbar-expand-lg navbar-dark">
                    <button className="navbar-toggler" type="button"  onClick={ () => {this.showSidebar()} } >
                        <i className="fas fa-bars"></i>
                    </button>

                    <div className="" id="navbarSupportedContent">
                        <nav className="navigation_top layout center">
                            <div className="">
                                <div className="mobile_login_div">
                                    
                                <a href={global.BASE_URL + "sign-in"}><div className="sign_inup">
                                    <p>Welcome</p>
                                    <p>Sign in/Sign up</p></div></a>
                                </div>
                            
                                <div id="cssmenu" className="main-menu fs15">
                                    {this.megaMenuHere()}				
                                </div>
                            </div>
                        </nav>
                        <div className="mobile_overlay_sidebar"   onClick={ () => {this.hideSidebar()} } ></div>
                    </div>
                </nav>  
            </div>
        )
    }
}
