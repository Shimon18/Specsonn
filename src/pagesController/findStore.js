import React from 'react';
import {PostData} from '../service/postData';
import { Helmet } from 'react-helmet';
import { compose } from "recompose";
import Footer from '../containers/Footer';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
  } from "react-google-maps"

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

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const MapWithAMarker = compose(withScriptjs, withGoogleMap)(props => {
    let iconMarker = new window.google.maps.MarkerImage(
        global.BASE_URL + "assets/img/markerIcon.png",
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new window.google.maps.Size(32, 32)
    );
    return (
      <GoogleMap defaultZoom={8} defaultCenter={{ lat: 26.2896167, lng: 50.21494 }}>
        {props.markers.map(marker => {
            const onClick = props.onClick.bind(this, marker)
            let _lat = parseFloat(marker.latitude);
            let _lng = parseFloat(marker.longitude);
            
            return (
                <Marker
                icon={iconMarker}
                key={marker.address_Id}
                onClick={onClick}
                position={{ lat: _lat, lng: _lng }}
                >
                {props.selectedMarker === marker &&
                    <InfoWindow>
                    <div>
                        {marker.store_name}
                    </div>
                    </InfoWindow>}
                </Marker>
            )
        })}
      </GoogleMap>
    )
})

export default class findStore extends React.Component{

    constructor(props){
        super(props);
        this.state = {           
            isLoaded: false,
            allStores: [],
            selectedStore: false,
            search: ''
        }
    }

    componentDidMount(){        
        let _url_GetData = global.storeList+'?country_Id='+global.country_Ids;
        
        PostData(_url_GetData,'','GET')
        .then(result => {
            if(result.success === false)
            {
                this.setState({redirect: true});
                return;
            }            
            else
            {
                let responseJson = result.response; 
                             
                this.setState({allStores: responseJson,redirect: true});
                return;
            }
        })
        .catch(error => this.setState({ error, isLoaded: false }));        
    }

    storesList(){
        
        let _allStores = this.state.allStores;
        let _showStores = [];
        _allStores.map((stor) => { 
            let _address = entities.decode(stor.store_name).split(' ').join('+');
            let _likTarg = "http://maps.google.com/maps?q="+_address+"&loc:"+stor.latitude+","+stor.longitude+"&z=15";
            _showStores.push(
                <div className="iris_store_block" key={stor.address_Id}>
                    <div className="iris_store_1">
                        <div className="iris_store_icon">
                            <img src={global.BASE_URL + "assets/img/sign-board-icon.png"} alt="" title="" />
                        </div>
                        <div className="iris_store_txt">
                            <p>Iriseyewear.com at <span>{entities.decode(stor.store_name)}</span></p>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <div className="iris_store_1 iris_store_1A">
                        <div className="iris_store_icon">
                            <img src={global.BASE_URL + "assets/img/location-icon.png"} alt="" title="" />
                        </div>
                        <div className="iris_store_txt">
                            <p>
                                <span>{stor.address}<br/>                                
                                {stor.city_name} - {stor.city_pincode}</span>
                            </p>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <div className="iris_store_1 iris_store_1A">
                        <div className="iris_store_icon">
                            <img src={global.BASE_URL + "assets/img/clock.png"} alt="" title="" />
                        </div>
                        <div className="iris_store_txt">
                            <p>Open until <span>{stor.end_time}</span></p>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <div className="iris_store_1 iris_store_1A">
                        <div className="iris_store_icon">
                            <img src={global.BASE_URL + "assets/img/call-icon.png"} alt="" title="" />
                        </div>
                        <div className="iris_store_txt">
                            <p>
                                <a href={"tel:+"+stor.contact_no}>+{stor.contact_no}</a>
                            </p>
                        </div>
                        <div className="clearfix"></div>
                    </div>
                    <div className="iris_store_1 iris_store_1B">
                        <a href={_likTarg} className="iris_SL_btn1" target="_blank">direction</a>
                        <button className="iris_SL_btn2" type="button" onClick={this.handleClick.bind(this,stor)}>view details</button>
                        <div className="clearfix"></div>
                    </div>
                </div>
            ) 
        })

        return _showStores;
    }

    handleClick = (marker, event) => {
        this.setState({ selectedStore: marker })
    }

    render(){  
              
        return(
            <React.Fragment>
            <section className="iris_store_locator">
                <Helmet>
                    <title>Iris Eyewear | Near Store</title>
                    <meta name="description" content="Iris Eyewear | Sign In - Login" />
                </Helmet>

                <div className="row">
                    <div className="col-sm-12 iris_store_banner">
                        <img src={global.BASE_URL + "assets/img/store-banner.jpg"} alt="" title="" />
                    </div>
                </div>
                <div className="row iris_sl_head">
                    <div className="col-md-2">
                        <span className="iris_txt_style_1">{_prlTxt.storelocator}</span>
                    </div>
                    <div className="col-md-10" id="hiddenData">
                    <form className="row iris_store_locator_form">
                        <div className="col-md-3 iris_SL_radio">
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item"><a className="nav-link active" data-toggle="tab" href="#home">Nearet Store</a></li>
                            <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#src">Advance Search</a></li>
                        </ul>
                        </div>
                        <div className="col-md-9 iris_SL_box row">
                        <div className="tab-content">
                            <div id="home" className="tab-pane active row">
                            <input type="text" name="txtname" className="col-md-10 iris_input_box_SL" placeholder="Enter Locality Here" />
                            <button type="submit" className="col-md-2 iris_SL_btn">submit</button>
                            </div>
                            <div id="src" className="tab-pane fade row">
                            <select className="col-md-4">
                                <option>Select State</option>
                            </select>
                            <select className="col-md-4">
                                <option>Select City</option>
                            </select>
                            <select className="col-md-4">
                                <option>Select Locality</option>
                            </select>
                            <button type="submit" className="col-md-2 iris_SL_btn">submit</button>
                            </div>
                        </div>
                        </div>
                    </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 iris_map_item_list">
                        {this.storesList()}
                    </div>
                    {/* map section begins */}
                    <div className="col-md-8">
                    <MapWithAMarker
                        selectedMarker={this.state.selectedStore}
                        markers={this.state.allStores}
                        onClick={this.handleClick}
                        googleMapURL={"https://maps.googleapis.com/maps/api/js?key="+global.mapKey}
                        loadingElement={<div style={{ height: '100%' }} />}
                        containerElement={<div style={{ height: '650px' }} />}
                        mapElement={<div style={{ height: '100%' }} />}
                    />
                    </div>
                    {/* map section ends */}
                </div>
                </section>
                <Footer />  
            </React.Fragment>    
        )
    }
}
