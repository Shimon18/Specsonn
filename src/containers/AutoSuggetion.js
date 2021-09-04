import React from 'react';
import {PostData} from '../service/postData';

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

let _asTxt = '';
if(global.lang == 'en'){
    _asTxt = enLang;
}
else{
    _asTxt = arLang;
}
// Lang Json End

let _searchtxt = '';
export default class AutoSuggetion extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            autoSuggestModalIsOpen:false,
            trendingShow : false,
            listingShow : false,
            _serachData : [],
        }
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }
    
    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    myRef = React.createRef();

    handleClickOutside = e => {
        if (!this.myRef.current.contains(e.target)) {
          this.setState({ trendingShow: false });
        }
    };
    
    handleClickInside = () => this.setState({ trendingShow: true });

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

    clickSearchLink(name,count,e){
        if(count == 1){
            
        }
        else{
            // Goto Search Page
        }
    }

    render(){
        return(
                                              
            <div className="col-lg-6 offset-3 iris_top_middle_search_box">
                <div className="input-group iris_2 iris_5"  ref={this.myRef}>
                    <input onClick={this.handleClickInside} onChange={this.autoCompleteSearch.bind(this)} className="typeahead form-control"  type="text" autoComplete="false" placeholder={_asTxt.place_search} aria-label={_asTxt.place_search}/>
                    <div className="input-group-addon">
                        <button className="iris_top_middle_search_btn" onClick={this.clickSearchHandle.bind()} type="submit" style={{background:'none', border:'none'}}>
                            <img src={global.BASE_URL + "assets/img/search-button.png"} width="24" />
                        </button>
                    </div>
                    <div className="clearfix"></div>
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
                                <h3> Trending Search </h3>
                                <ul className="autotrending_list menu-link">
                                    <li><a href={global.BASE_URL+"eyeglasses/collection/iris-collection"}>IRIS Collection</a></li>
                                    <li><a href={global.BASE_URL+"eyeglasses"}>Eyeglasses</a></li>
                                    <li><a href={global.BASE_URL+"sunglasses"}>Sunglasses</a></li>
                                    <li><a href={global.BASE_URL+"contact-lenses"}>Contact Lenses</a></li>
                                    <li><a href={global.BASE_URL+"gender/men"}>Mens Eyeglasses</a></li>
                                    <li><a href={global.BASE_URL+"gender/women"}>Womens Eyeglasses</a></li>
                                </ul>
                            </div>                
                        }
                   </div>

                    

                </div>
            </div>      
        )
    }
}