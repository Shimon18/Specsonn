import React, { Component } from 'react';

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

export default class FilterProduct extends Component {

    state = {
    }

    componentDidMount(){
        //const handle = this.props.match.params;
        //console.log(handle);
    }

    handleError = (error) => {
        //console.log(error);
    }

    render() {
        return (
            <div className="col-lg-3 iris_PL_sidebar">
                <div className="bs-example">
                    <div className="accordion" id="accordionExample">
                        <div className="card">
                            <div className="card-header" id="headingOne">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link" data-toggle="collapse" data-target="#collapseOne">
                                        Frame Type<i className="fas fa-sort-down float-right"></i>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">Ractangle
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Wayfrarer
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Cat-Eye
                                                <input type="checkbox" defaultChecked name="is_name"/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                            <li>
                                                <label className="check ">Rimless
                                                <input type="checkbox" defaultChecked name="is_name"/>
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingTwo">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo">
                                        Frame Shape<i className="fas fa-sort-down float-right"></i>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">Ractangle
                                                <input type="checkbox" defaultChecked name="is_name" /> 
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Wayfrarer
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Cat-Eye
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Rimless
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingThree">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree">
                                        Price<i className="fas fa-sort-down float-right"></i>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">SAR20-SAR50
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">SAR50-SAR80
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">SAR80-SAR150
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">SAR150-SAR200
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingFour">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFour">
                                        Frame Size<i className="fas fa-sort-down float-right"></i>
                                        </button>
                                </h2>
                            </div>
                            <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">Large
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Medium
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Small
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Other
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingFive">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFive">
                                        Brand<i className="fas fa-sort-down float-right"></i>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">RayBan
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Woodland
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Companyname
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingSix">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseSix">
                                        Gender<i className="fas fa-sort-down float-right"></i>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseSix" className="collapse" aria-labelledby="headingSix" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">Male
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Female
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingSevn">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseSevn">
                                        Frame Color<i className="fas fa-sort-down float-right"></i>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseSevn" className="collapse" aria-labelledby="headingSevn" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">Red
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Green
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Blue
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingEight">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseEight">
                                        Material<i className="fas fa-sort-down float-right"></i>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseEight" className="collapse" aria-labelledby="headingEight" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">Fiber
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                    <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Plastic
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">Steel
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header" id="headingNine">
                                <h2 className="mb-0">
                                    <button type="button" className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseNine">
                                        Prescription<i className="fas fa-sort-down float-right"></i>
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseNine" className="collapse" aria-labelledby="headingNine" data-parent="#accordionExample">
                                <div className="card-body">
                                    <ul className="iris_filter_1">
                                        <li>
                                            <label className="check ">PR 1
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">PR 2
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                        <li>
                                            <label className="check ">PR 3
                                                <input type="checkbox" defaultChecked name="is_name" />
                                                <span className="checkmark"></span>
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
        }
    }
