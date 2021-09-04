import React from "react";
import Footer from "../containers/Footer";
import { PostData } from "../service/postData";
import FreamSizeMD from "../_productDetailsModal/freamSizeModal";
import WeightGroupMD from "../_productDetailsModal/weightGroupModal";
import { Helmet } from "react-helmet";
import Modal from "react-modal";
import IrisCart from "../_commonFunction/IrisCart";
import ProductDetailLoader from "../_LoaderHere/ProductDetailLoader";
import ReactImageZoom from "react-image-zoom";
import { userCartManage } from "../_commonFunction/userIrisCart";

import Slider from "react-slick";

import { FacebookShareButton, WhatsappShareButton } from "react-share";

// Lang Json Start
import enLang from "../translations/en.json";
import arLang from "../translations/ar.json";

let irisCountrySession = localStorage.getItem("irisCountrySession");
if (irisCountrySession !== undefined || irisCountrySession !== null) {
  irisCountrySession = JSON.parse(irisCountrySession);
  global.country_Iso = irisCountrySession
    ? irisCountrySession.country_Iso
    : global.country_Iso;
  global.currencyCode = irisCountrySession
    ? irisCountrySession.currencyCode
    : global.currencyCode;
  global.country_Ids = irisCountrySession
    ? irisCountrySession.country_Ids
    : global.country_Ids;
  global.lang = irisCountrySession ? irisCountrySession.lang : global.lang;
  global.language_Ids = irisCountrySession
    ? irisCountrySession.language_Ids
    : global.language_Ids;
  global.icon = irisCountrySession ? irisCountrySession.icon : global.icon;
}

let _prlTxt = "";
if (global.lang == "en") {
  _prlTxt = enLang;
} else {
  _prlTxt = arLang;
}
// Lang Json End

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
};

const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

let _pageTitle = "";
let _loader = "glb-ldr-prt active";

let _typTxt = "";
let _catsTxt = "";
let _firstBaseImage = "";
let _frontTitle = "";

let _modalPower_Titles = [];
let _modalPower_tabsData = [];

let _frameSizeTP = "";

const zoomClass = {
  width: 600,
  height: 384,
  zoomWidth: 384,
  offset: { vertical: 0, horizontal: 10 },
  zoomLensStyle:
    "opacity: 0.5;background-color: white;border: 1px solid rgb(136, 136, 136);",
  zoomStyle: "border:1px solid rgb(0, 0, 0);cursor: pointer;z-index: 9;",
};

const validateForm = (errors) => {
  let valid = true;

  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

let _searchcitytxt = "";
//let _postalCodeMsgCss = 'successDelivery';
let _recentListClass = "col-lg-6";
let _similarListClass = "col-lg-12";

let _defaultImage = global.BASE_URL + "assets/img/iris_hover_img.png";

const portalRoot = document.getElementById("page-container");

class productDataView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalFixed_Lens: "slide",
      cityFiltShow: false,
      _postalCodeMsgCss: "successDelivery",
      postalCodeMsg: null,
      postalCode: "",
      zoomProps: zoomClass,
      _finalBaseImage: "",
      _imgKeys: 0,
      _modalKey: "",
      _modalIds: "",
      _modalTitle: "",
      error: null,
      isLoaded: false,
      items: {},
      freeItems: {},
      _180rotationFull_left: "-186.429vw",
      _180rotation_left: "-79.499vw",
      _default180: "NAAAA",
      renderProducts: [],
      lensPower: {},
      similarProducts: {},
      hover: false,
      modalIsOpen_FS: false,
      modalIsOpen_powerLens: false,
      modalIsOpen_cart: false,
      checkedPower: 0,
      checkedPowerLens: 0,
      cartManage: "",
      _serachCityData: [],
      errors: {
        postalCode: "",
      },
    };
    this.zoomRef = null;
  }

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    let errors = this.state.errors;

    switch (name) {
      case "postalCode":
        errors.postalCode =
          value.length < 5 ? "*Please enter valid postal code." : "";
        this.setState({ postalCode: value, postalCodeMsg: "" });
        break;
      default:
        break;
    }
  };

  getZoomRef = (ref) => {
    this.zoomRef = ref;
  };

  async componentDidMount() {
    if (global.lang == "en") {
      document.body.classList.add("ltr_side");
    } else {
      document.body.classList.add("rtl_side");
    }

    let _df180anglefull = this.state._180rotationFull_left;
    let _df180angle = this.state._180rotation_left;
    if (global.language_Ids > "1") {
      _df180angle = "79.499vw";
      _df180anglefull = "186.429vw";
    }

    let irisCartCaount = localStorage.getItem("irisCart");
    if (irisCartCaount === null || irisCartCaount === undefined) {
      document.getElementById("counterCount").innerHTML = 0;
    } else {
      irisCartCaount = JSON.parse(irisCartCaount);
    }

    let cartManage = localStorage.getItem("cartList");
    this.setState({ cartManage: cartManage });

    const handle = this.props.match.params;
    _typTxt = handle.typTxt;
    _catsTxt = handle.catTxts;

    let _urlData =
      global.productDetails +
      "?country_Id=" +
      global.country_Ids +
      "&language_Id=" +
      global.language_Ids +
      "&token=" +
      _typTxt;
    let res = await PostData(_urlData, "", "GET");

    if (res.response == null || res.response == undefined) {
      window.location.href = global.BASE_URL + "not-found/";
      return false;
    }
    let _listing = res.response;

    if (_listing.type_Slug == "IZCT-CL") {
      _defaultImage = global.BASE_URL + "assets/img/iris_CL_hover_img.png";
    }

    let _imgBox = _listing.extraData.images[0]
      ? _listing.extraData.images[0].size_M +
        _listing.extraData.images[0].imagesUrl
      : _defaultImage;

    var obj = {
      product_URL: window.location.href,
      product_Id: _listing.product_Id,
      sku: _listing.sku,
      _token: _listing._token,
      product_Name: _listing.product_Name,
      product_izPrice: _listing.product_izPrice,
      product_discountPrice: _listing.product_discountPrice,
      image: _imgBox,
    };

    let recentViewList = localStorage.getItem("recentlyView");
    if (recentViewList === null || recentViewList === undefined) {
      recentViewList = [];
      recentViewList.push(obj);
      localStorage.setItem("recentlyView", JSON.stringify(recentViewList));
    } else {
      recentViewList = JSON.parse(recentViewList);
      const findIds = this.getItem_RCV(_listing.product_Id);
      if (findIds == "0") {
        if (recentViewList.length > 4) {
          recentViewList = recentViewList.filter(
            (rmItems, index) => index !== 0
          );
        }
        recentViewList.push(obj);
        localStorage.setItem("recentlyView", JSON.stringify(recentViewList));
      }
    }

    let _powerLenslisting = "";
    _listing.extraData.images.forEach((items, index) => {
      index === 0
        ? (_listing.extraData.images[index].isActive = true)
        : (_listing.extraData.images[index].isActive = false);
    });

    let _powerLensData =
      global.productLensPower +
      "?country_Id=" +
      global.country_Ids +
      "&language_Id=" +
      global.language_Ids +
      "&catsTxt=" +
      _catsTxt +
      "&productid=" +
      _listing.product_Id;
    let resLs = await PostData(_powerLensData, "", "GET");
    _powerLenslisting = resLs.response;

    let _similarOptionsData =
      global.similarProductsDetails +
      "?priceBetween=100,1000&frametype_Id=" +
      _listing.frametype_Id +
      "&product_Id=" +
      _listing.product_Id;
    let resu = await PostData(_similarOptionsData, "", "GET");
    let _similarProducts = resu.response;

    let _freeFramesDetails = {};
    if (_listing.buyOneGet > 0) {
      let _freeFrameData =
        global.productFreeDetails +
        "/" +
        _listing.product_Id +
        "/" +
        _listing.buyOneGet;
      let freeFrame = await PostData(_freeFrameData, "", "GET");
      _freeFramesDetails = freeFrame.response;
    }

    this.setState({
      items: _listing,
      lensPower: _powerLenslisting,
      isLoaded: true,
      similarProducts: _similarProducts,
      freeItems: _freeFramesDetails,
      _180rotation_left: _df180angle,
      _180rotationFull_left: _df180anglefull,
    });
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  loadFilterData() {
    const _productImages = [];
    const _productImages180s = [];
    // const _ColorSmallBox = [];

    if (this.state.isLoaded === true) {
      let _baseImage = _defaultImage;
      let _proids = "";

      let _extraData_Imgs = this.state.items.extraData.images;
      // let _extraData_Colrs = this.state.items.extraData.colors;
      _frontTitle =
        this.state.items.brand_Name +
        " " +
        this.state.items.shape_Name +
        " " +
        this.state.items.productType_Name;

      let _imgAngleShow = false;

      for (let _k = 0; _k < _extraData_Imgs.length; _k++) {
        let _imgUl_Base = "";
        let _imgUl_Small = "";
        let _imgUl_Medium = "";
        let _actCls = "";
        let _altTitle = "Product Image";

        if (
          typeof _extraData_Imgs[_k].imagesUrl != "undefined" &&
          _extraData_Imgs[_k].imagesUrl !== null
        ) {
          _imgUl_Base =
            _extraData_Imgs[_k].size_F + _extraData_Imgs[_k].imagesUrl;
          _imgUl_Medium =
            _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl;
          _imgUl_Small =
            _extraData_Imgs[_k].size_S + _extraData_Imgs[_k].imagesUrl;
          _altTitle = _extraData_Imgs[_k].alt_tag.replace("_", " ");
        } else {
          _imgUl_Base = _extraData_Imgs[_k].defaultImage;
          _imgUl_Small = _extraData_Imgs[_k].defaultImage;
          _imgUl_Medium = _extraData_Imgs[_k].defaultImage;
        }

        if (_extraData_Imgs[_k].isActive) {
          if (
            _extraData_Imgs[_k].alt_tag === "Female_headturn" ||
            _extraData_Imgs[_k].alt_tag === "Male_headturn"
          ) {
            _imgAngleShow = true;
            _imgUl_Base =
              _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl;
          } else {
            _imgUl_Base =
              _extraData_Imgs[_k].size_F + _extraData_Imgs[_k].imagesUrl;
          }

          _baseImage = _imgUl_Base;
          _actCls = "active";
          this.state.zoomProps.img = _baseImage;
        }

        if (_extraData_Imgs[_k].alt_tag === "Image_Front") {
          _firstBaseImage = _imgUl_Medium;
        }

        if (
          _extraData_Imgs[_k].alt_tag === "Female_headturn" ||
          _extraData_Imgs[_k].alt_tag === "Male_headturn"
        ) {
          var divStyle = {
            backgroundImage:
              "url(" +
              _extraData_Imgs[_k].size_M +
              _extraData_Imgs[_k].imagesUrl +
              ")",
            backgroundPosition: "-350px 0px",
          };
          _productImages180s.push(
            <div
              className={_actCls + " rotate-thumbnail-btn"}
              onMouseOver={this.mouseOver.bind(this, _k)}
              key={_extraData_Imgs[_k].alt_tag + _k}
              data-src={
                _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl
              }
              style={divStyle}
              onClick={this.manage180Image.bind(this)}
            ></div>
          );
        } else {
          _productImages.push(
            <li
              className={_actCls}
              key={_proids + _k}
              onMouseOver={this.mouseOver.bind(this, _k)}
            >
              <img
                src={_imgUl_Small}
                alt={_extraData_Imgs[_k].alt_tag}
                title={_altTitle}
              />
            </li>
          );
        }
      }

      // for (let _k = 0; _k < _extraData_Colrs.length; _k++) {
      //   let _actCls = "";
      //   if (_extraData_Colrs[_k].color_type === "HEXA") {
      //     let _explo = _extraData_Colrs[_k].colors_Hexa.split(",rgba");
      //     let _spnColA = _extraData_Colrs[_k].colors_Hexa;
      //     let _spnColB = _extraData_Colrs[_k].colors_Hexa;
      //     if (_explo.length > 1) {
      //       _spnColA = _explo[0];
      //       _spnColB = "rgba" + _explo[1];
      //     }

      //     _ColorSmallBox.push(
      //       <li className="color-images" key={_proids + _k}>
      //         <a
      //           href={
      //             global.BASE_URL +
      //             _catsTxt +
      //             "/" +
      //             _extraData_Colrs[_k].product_Url
      //           }
      //         >
      //           <span className={_actCls + " colorIcons"} id={_proids}>
      //             <span
      //               className="colorIcons_colorTop"
      //               alt={this.state.items.product_Name_Display}
      //               title={this.state.items.product_Name_Display}
      //               style={{ background: _spnColA }}
      //             >
      //               <span
      //                 className="colorIcons_colorBottom"
      //                 style={{ background: _spnColB }}
      //               ></span>
      //             </span>
      //           </span>
      //         </a>
      //       </li>
      //     );
      //   } else {
      //     _ColorSmallBox.push(
      //       <li className="color-images" key={_proids + _k}>
      //         <a
      //           href={
      //             global.BASE_URL +
      //             _catsTxt +
      //             "/" +
      //             _extraData_Colrs[_k].product_Url
      //           }
      //         >
      //           <img
      //             id={_proids}
      //             className={_actCls + " colorIcons"}
      //             src={
      //               this.state.items.colorPath +
      //               _extraData_Colrs[_k].colors_Hexa
      //             }
      //             alt={this.state.items.product_Name_Display}
      //             title={this.state.items.product_Name_Display}
      //             style={{ width: "15px" }}
      //           ></img>
      //         </a>
      //       </li>
      //     );
      //   }
      // }

      let _callCenter = "";

      if (_imgAngleShow === true) {
        _callCenter = (
          <div className="product-image-zoom">
            <div
              className="image-zoom"
              id="headturn-container"
              style={{ width: "70.6658vw" }}
              onMouseMove={this.rotate180FullImage}
            >
              <img
                id="headturn"
                src={_baseImage}
                alt="180 degree view"
                style={{
                  width: "433.661vw",
                  left: `${this.state._180rotationFull_left}`,
                }}
              />
            </div>
          </div>
        );
      } else {
        if (_extraData_Imgs.length > 0) {
          _callCenter = (
            <div className="block" id="imagBase">
              <ReactImageZoom ref={this.getZoomRef} {...this.state.zoomProps} />
            </div>
          );
        } else {
          _firstBaseImage = _baseImage;
          _callCenter = (
            <div className="block" id="imagBase">
              <img
                src={_baseImage}
                style={{ width: "600px", height: "384px" }}
              />
            </div>
          );
        }
      }

      return (
        <div
          id="demo1"
          className="carousel slide iris_prouct_image_slider"
          data-ride="carousel"
        >
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="wrapper">{_callCenter}</div>
            </div>
          </div>
          {/* <div className="iris_prouct_image_colors row">
            <div className="col-sm-6">
              <ul>
                <li>{_prlTxt.productviewpage.colors}</li>
                {_ColorSmallBox}
              </ul>
            </div>
          </div> */}
          <div className="thumb-container zoom-image-thumbnail display-flex">
            <div className="rotate-image-thumbnail">
              <div className="display-flex align-items-start">
                <div className="margin-r5 layout center container-180deg">
                  <img
                    src={global.BASE_URL + "assets/img/iris_180D_img.jpg"}
                    alt="rotateIcon"
                  />
                </div>
                <div className="img-block display-flex">
                  {_productImages180s}
                </div>
              </div>
            </div>

            <div className="product-image-thumbnail">
              <div className="zoom-image-thumbnail display-flex">
                <div className="custom-btn margin-r10 margin-l5">
                  {_prlTxt.productviewpage.views}
                </div>
                <ul className="carousel-indicators">{_productImages}</ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  rightTitleCpop(productD) {
    _pageTitle = entities.decode(productD.product_Name);
    const _LensPowerBox = [];
    const _cartbutton = [];
    const _ColorSmallBox = [];
    let _hideLens = "hiddenData";

    let _priceSingle = [];

    if (this.state.isLoaded === true) {
      let _proids = "";

      let _extraData_Colrs = this.state.items.extraData.colors;

      for (let _k = 0; _k < _extraData_Colrs.length; _k++) {
        let _actCls = "";
        if (_extraData_Colrs[_k].color_type === "HEXA") {
          let _explo = _extraData_Colrs[_k].colors_Hexa.split(",rgba");
          let _spnColA = _extraData_Colrs[_k].colors_Hexa;
          let _spnColB = _extraData_Colrs[_k].colors_Hexa;
          if (_explo.length > 1) {
            _spnColA = _explo[0];
            _spnColB = "rgba" + _explo[1];
          }

          _ColorSmallBox.push(
            <li className="color-images" key={_proids + _k}>
              <a
                href={
                  global.BASE_URL +
                  _catsTxt +
                  "/" +
                  _extraData_Colrs[_k].product_Url
                }
              >
                <span className={_actCls + " colorIcons"} id={_proids}>
                  <span
                    className="colorIcons_colorTop"
                    alt={this.state.items.product_Name_Display}
                    title={this.state.items.product_Name_Display}
                    style={{ background: _spnColA }}
                  >
                    <span
                      className="colorIcons_colorBottom"
                      style={{ background: _spnColB }}
                    ></span>
                  </span>
                </span>
              </a>
            </li>
          );
        } else {
          _ColorSmallBox.push(
            <li className="color-images" key={_proids + _k}>
              <a
                href={
                  global.BASE_URL +
                  _catsTxt +
                  "/" +
                  _extraData_Colrs[_k].product_Url
                }
              >
                <img
                  id={_proids}
                  className={_actCls + " colorIcons"}
                  src={
                    this.state.items.colorPath +
                    _extraData_Colrs[_k].colors_Hexa
                  }
                  alt={this.state.items.product_Name_Display}
                  title={this.state.items.product_Name_Display}
                  style={{ width: "15px" }}
                ></img>
              </a>
            </li>
          );
        }
      }

      if (this.state.items.product_avaQty == 0) {
        _cartbutton.push(
          <div className="row iris_myownh_outStock" key={898}>
            <div className="col-lg-12 iris_pd_A">
              <p>{_prlTxt.outstock}</p>
            </div>
          </div>
        );
      } else {
        let _lensPower = this.state.lensPower;
        if (this.state.items.type_Slug == "IZCT-SG") {
          if (this.state.items.isPowerLens > 0) {
            for (let _p = 0; _p < _lensPower.length; _p++) {
              //let _chkecked = '';
              if (this.state.checkedPower === 0) {
                if (_p === 0) {
                  this.state.checkedPower = _lensPower[_p].power_Id;
                  this.state.checkedPowerLens = _lensPower[_p].lensPower_Type;
                  //_chkecked = 'checked';
                }
              } else if (_lensPower[_p].power_Id === this.state.checkedPower) {
                //_chkecked = 'checked';
              }
              //_LensPowerBox.push(<li key={_p+_lensPower[_p].power_Id}><label><input type="radio" name="powertype" value={_lensPower[_p].power_Id} defaultChecked={_chkecked} onChange={this.onChangedLensPower.bind(this,_lensPower[_p].lensPower_Type,_lensPower[_p].power_Id)}/><span className="title">{_lensPower[_p].power_Name}</span></label></li>);
            }
            _cartbutton.push(
              <div className="btn-add-to-cart" key={_lensPower.length}>
                <button
                  data-txt="AddToCart"
                  className="buyBtn iris_proction_btn"
                  onClick={this.openAddtoCartModalHandler.bind(
                    this,
                    this.state.items.product_Id,
                    0,
                    0,
                    0,
                    0
                  )}
                >
                  {_prlTxt.productviewpage.addtocart}
                </button>
                <button
                  className="lnsBtn iris_proction_btn"
                  onClick={this.openCartModalHandler.bind(
                    this,
                    "modalIsOpen_powerLens"
                  )}
                >
                  {_prlTxt.productviewpage.addpower}
                </button>
              </div>
            );
          } else {
            _cartbutton.push(
              <div className="btn-add-to-cart" key={_lensPower.length}>
                <button
                  data-txt="AddToCart"
                  className="buyNPBtn iris_proction_btn"
                  onClick={this.openAddtoCartModalHandler.bind(
                    this,
                    this.state.items.product_Id,
                    0,
                    0,
                    0,
                    0
                  )}
                >
                  {_prlTxt.productviewpage.addtocart}
                </button>
              </div>
            );
          }
        } else {
          _hideLens = "";
          if (this.state.items.isPowerLens > 0) {
            let _lensPower = this.state.lensPower;
            for (let _p = 0; _p < _lensPower.length; _p++) {
              let _chkecked = "";
              if (this.state.checkedPower === 0) {
                if (_p === 0) {
                  this.state.checkedPower = _lensPower[_p].power_Id;
                  this.state.checkedPowerLens = _lensPower[_p].lensPower_Type;
                  _chkecked = "checked";
                }
              } else if (_lensPower[_p].power_Id === this.state.checkedPower) {
                _chkecked = "checked";
              }

              _LensPowerBox.push(
                <li key={_p + _lensPower[_p].power_Id}>
                  <label>
                    <input
                      type="radio"
                      name="powertype"
                      value={_lensPower[_p].power_Id}
                      defaultChecked={_chkecked}
                      onChange={this.onChangedLensPower.bind(
                        this,
                        _lensPower[_p].lensPower_Type,
                        _lensPower[_p].power_Id
                      )}
                    />
                    <span className="title">{_lensPower[_p].power_Name}</span>
                  </label>
                </li>
              );
            }
            _cartbutton.push(
              <div
                className="form-group row"
                style={{ marginTop: "-15px" }}
                key={_lensPower.length}
              >
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="iris_proction_btn"
                    onClick={this.openCartModalHandler.bind(
                      this,
                      "modalIsOpen_powerLens"
                    )}
                  >
                    {_prlTxt.productviewpage.addtocartlens} 
                  </button>
                </div>
              </div>
            );
          } else {
            _cartbutton.push(
              <div
                className="row iris_myownh7III"
                key={this.state.items.isPowerLens + 1}
              >
                <div className="col-lg-12 iris_pd_A">
                  <button
                    type="button"
                    className="iris_proction_btn"
                    onClick={this.openAddtoCartModalHandler.bind(
                      this,
                      this.state.items.product_Id,
                      0,
                      0,
                      0,
                      0
                    )}
                  >
                    {_prlTxt.productviewpage.addtocart}
                  </button>
                </div>
                <div style={{ display: "none" }} className="col-lg-6 iris_pd_B">
                  <button type="button" className="iris_proction_btn">
                    {_prlTxt.productviewpage.addpower}
                  </button>
                </div>
              </div>
            );
          }
        }
      }

      if (productD.product_discountPrice == productD.product_izPrice) {
        _priceSingle.push(
          <div key={2323}>
            <div className="iris_product_price">
              <p>
                {global.currencyCode}{" "}
                <span>{productD.product_discountPrice}</span>
              </p>
            </div>
          </div>
        );
      } else {
        _priceSingle.push(
          <div key={2323} className="d-flex align-items-center">
            <div className="iris_product_price">
              <p>
                {global.currencyCode}{" "}
                <span>{productD.product_discountPrice}</span>
              </p>
            </div>
            <div className="iris_product_discount_price">
              <p>
                {global.currencyCode} <span>{productD.product_izPrice}</span>
              </p>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="iris_product_info">
        <div className="iris_product_id">
          <span>{this.state.items.product_Id}</span>
        </div>
        <div className="iris_product_title">
          <span>{entities.decode(productD.product_Name)}</span>
        </div>
        <div className="iris_price"> {_priceSingle}</div>
        
        <div className="iris_prouct_image_colors row">
            <div className="col-sm-6">
              <ul>
              {_ColorSmallBox} 
              </ul>
            </div>
          </div>

        <div className="iris_product_action">
          <div className="iris_proction">
          <p class="deliveryTxt bg-light1 m-0 px-3 py-2">SELECT POWER TYPE</p>
            <ul className="types-list bg-light" id={_hideLens}>
              {_LensPowerBox}
            </ul>
            {_cartbutton}
          </div>
        </div>
        {/* <div className="iris_product_detail_social">
          <ul id="shareLinks_Icon">
            <li>{_prlTxt.productviewpage.share}</li>
            <li>
              <FacebookShareButton
                url={window.location.href}
                quote={entities.decode(productD.product_Name)}
                className="Demo__some-network__share-button"
              >
                <img
                  src={global.BASE_URL + "assets/img/facebook.png"}
                  alt=""
                  title=""
                />
              </FacebookShareButton>
            </li>
            <li>
              <WhatsappShareButton
                picture={_firstBaseImage}
                url={window.location.href}
                quote={entities.decode(productD.product_Name)}
                className="Demo__some-network__share-button"
              >
                <img
                  src={global.BASE_URL + "assets/img/whatsapp.png"}
                  alt=""
                  title=""
                />
              </WhatsappShareButton>
            </li>
          </ul>
        </div> */}
      </div>
    );
  }

  sizeDetailsImg(sizeD) {
    const _180Images = [];
    let _active_rotate = "hiddenData";
    let _active_size = "";

    let _bridge = "17";
    let _temple = "140";
    let _imgSize = "52";
    _frameSizeTP = "52-17-140";
    if (sizeD.frameMeasure_id != undefined || sizeD.frameMeasure_id != null) {
      _frameSizeTP = sizeD.frameMeasure_id;
      let _frss = sizeD.frameMeasure_id;
      let frameSizeArry = _frss.split("-");
      _bridge = frameSizeArry[1];
      _temple = frameSizeArry[2];
      _imgSize = frameSizeArry[0];
    }

    if (this.state.isLoaded === true) {
      let _extraData_Imgs = this.state.items.extraData.images;
      if (_extraData_Imgs.length > 0) {
        for (let _k = 0; _k < _extraData_Imgs.length; _k++) {
          if (_extraData_Imgs[_k].alt_tag === "Male_headturn") {
            if (this.state._default180 === "NAAAA") {
              this.state._default180 =
                _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl;
            }
          } else if (_extraData_Imgs[_k].alt_tag === "Female_headturn") {
            if (this.state._default180 === "NAAAA") {
              this.state._default180 =
                _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl;
            }
          }

          if (
            _extraData_Imgs[_k].alt_tag === "Female_headturn" ||
            _extraData_Imgs[_k].alt_tag === "Male_headturn"
          ) {
            _active_rotate = "";
            _active_size = "hiddenData";
            var divStyle = {
              backgroundImage:
                "url(" +
                _extraData_Imgs[_k].size_M +
                _extraData_Imgs[_k].imagesUrl +
                ")",
            };
            _180Images.push(
              <div
                className="image-small"
                key={_extraData_Imgs[_k].alt_tag + _k}
                data-src={
                  _extraData_Imgs[_k].size_M + _extraData_Imgs[_k].imagesUrl
                }
                style={divStyle}
                onClick={this.manage180Image.bind(this)}
              ></div>
            );
          }
        }
      }
    }

    return (
      <div className="Product_discription_tab">
        <div className="iris_size_detail">
          <div className="iris_size_detail_1">
            <ul>
              <li>
                <h6>
                  size(
                  <button
                    data-toggle="modal"
                    data-target="#iris_chart_modal"
                    className="iris_myownh7IV"
                  >
                    {_prlTxt.productviewpage.whythis}
                  </button>
                  )
                </h6>
                <span>{sizeD.frameSize_Name}</span>
              </li>
              <li>
                <h6>{_prlTxt.productviewpage.color}</h6>
                <span>{sizeD.colors_Name}</span>
              </li>
              <li>
                <h6>{_prlTxt.productviewpage.style}</h6>
                <span>{sizeD.style_Name}</span>
              </li>
              <li>
                <h6>{_prlTxt.productviewpage.measurments}</h6>
                <span>{sizeD.frameMeasure_id}</span>
              </li>
            </ul>
          </div>
          <div className="iris_size_detail_2">
            <div className="iris_size_detail_2A">
              <div className="iris_size_detail_2Ai">
                <h6>{_prlTxt.productviewpage.framedetails}</h6>
                <button
                  onClick={this.openModalHandler.bind(this, "frameSizeModal")}
                  className="iris_myownh7IV"
                  style={{ marginLeft: "5px" }}
                >
                  {" "}
                  ({_prlTxt.productviewpage.viewcomdetail})
                </button>
              </div>
              <div className="iris_size_detail_2Aii">
                <ul>
                  <li>
                    <img
                      src={
                        global.BASE_URL +
                        "assets/img/iris_size_detail_img_1.jpg"
                      }
                      alt=""
                      title=""
                    />
                    <span>{_prlTxt.productviewpage.bridgesize}</span>
                    <p>{_bridge} mm</p>
                  </li>
                  <li>
                    <img
                      src={
                        global.BASE_URL +
                        "assets/img/iris_size_detail_img_2.jpg"
                      }
                      alt=""
                      title=""
                    />
                    <span>{_prlTxt.productviewpage.templesize}</span>
                    <p>{_temple} mm</p>
                  </li>
                  <li>
                    <img
                      src={
                        global.BASE_URL +
                        "assets/img/iris_size_detail_img_3.jpg"
                      }
                      alt=""
                      title=""
                    />
                    <span>{_prlTxt.productviewpage.eyesize}</span>
                    <p>{_imgSize} mm</p>
                  </li>
                </ul>
                <button
                  onClick={this.openModalHandler.bind(this, "frameSizeModal")}
                  className="iris_pd_info_btn"
                >
                  {_prlTxt.productviewpage.viewfrsize} &gt;
                </button>
              </div>
            </div>

            <div className="iris_size_detail_2B" id={_active_rotate}>
              <div className="iris_size_detail_2Bi">
                <h6 className="float-left">
                  {_prlTxt.productviewpage.seethisaction}
                </h6>
                <img
                  src={global.BASE_URL + "assets/img/iris_180D_img.jpg"}
                  alt=""
                  title=""
                  className="float-right"
                />
                <div className="clearfix"></div>
              </div>
              <div className="iris_size_detail_2Bii">
                <div
                  id="demo2"
                  className="carousel slide iris_prouct_image_slider"
                  data-ride="carousel"
                >
                  <div
                    className="side180"
                    id="headturn-container-side"
                    style={{ width: "26.4997vw" }}
                    onMouseMove={this.rotate180Image}
                  >
                    <img
                      id="headturn-side"
                      src={this.state._default180}
                      alt=""
                      style={{
                        width: "185.498vw",
                        left: `${this.state._180rotation_left}`,
                      }}
                    />
                  </div>
                  <div className="small-Icons">{_180Images}</div>
                </div>
              </div>
            </div>

            <div className="iris_size_detail_2B" id={_active_size}>
              <div className="iris_size_detail_2Bi">
                <h6 className="center">
                  {_prlTxt.productviewpage.howiknowfit}
                </h6>
                <div className="clearfix"></div>
                <button
                  onClick={this.openModalHandler.bind(this, "frameSizeModal")}
                  className="iris_myownh7IV"
                  style={{ marginLeft: "5px" }}
                >
                  {" "}
                  ({_prlTxt.productviewpage.viewcomdetail})
                </button>
                <div className="clearfix"></div>
              </div>
              <div className="iris_size_detail_2Bii">
                <div
                  id="demo2"
                  className="carousel slide iris_prouct_image_slider"
                  data-ride="carousel"
                >
                  <img
                    src={
                      global.BASE_URL + "assets/img/iris_frame_size_details.png"
                    }
                    alt=""
                    title=""
                    className="float-right"
                    style={{ width: "100%", margin: "20px 0px" }}
                  />
                </div>
              </div>
              <button
                onClick={this.openModalHandler.bind(this, "frameSizeModal")}
                className="iris_pd_info_btn"
              >
                {_prlTxt.productviewpage.frsizeguide} &gt;
              </button>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    );
  }

  renderModalData = () => {
    if (this.state._modalKey === "frameSizeModal") {
      return <FreamSizeMD />;
    } else if (this.state._modalKey === "weightGroupModal") {
      return <WeightGroupMD />;
    }
  };

  technicalDetails(techD) {
    return (
      <div className="Product_discription_tab">
        <div className="iris_prod_tech_info">
          <div className="row">
            <div className="col-lg-12">
              <div className="pdpInfo display-flex justify-content-between">
                <div className="pf-48">
                  <div className="info-heading">
                    {_prlTxt.productviewpage.technicaldetail}
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.brname}
                      </span>
                      <span className="info-text">{techD.brand_Name}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.prtype}
                      </span>
                      <span className="info-text">
                        {techD.productType_Name}
                      </span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.frtype}
                      </span>
                      <span className="info-text">{techD.frametype_Name}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.frshape}
                      </span>
                      <span className="info-text">{techD.shape_Name}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.modalno}
                      </span>
                      <span className="info-text">{techD.code}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.frsize}
                      </span>
                      <span className="info-text">
                        {techD.frameSize_Name} (
                        <button
                          className="iris_myownh7V"
                          onClick={this.openModalHandler.bind(
                            this,
                            "frameSizeModal"
                          )}
                        >
                          {_prlTxt.productviewpage.viewchart}
                        </button>
                        )
                      </span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.frcolor}
                      </span>
                      <span className="info-text">{techD.colors_Name}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.size}
                      </span>
                      <span className="info-text">{_frameSizeTP}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.wtgroup}
                      </span>
                      <span className="info-text">
                        {techD.frameWeight_Name} (
                        <button
                          onClick={this.openModalHandler.bind(
                            this,
                            "weightGroupModal"
                          )}
                          className="iris_myownh7IV iris_myownh7VI"
                        >
                          {_prlTxt.productviewpage.learnmore}
                        </button>
                        )
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pf-48">
                  <div className="info-heading">
                    {_prlTxt.productviewpage.generaldetail}
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.material}
                      </span>
                      <span className="info-text">{techD.material_Name}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.frmaterial}
                      </span>
                      <span className="info-text">{techD.material_Name}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.tematerial}
                      </span>
                      <span className="info-text">{techD.material_Name}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.presctype}
                      </span>
                      <span className="info-text">
                        {techD.framePrescription_Name}
                      </span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.frstyle}
                      </span>
                      <span className="info-text">{techD.style_Name}</span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.prowarranty}
                      </span>
                      <span className="info-text">
                        {techD.product_warranty}
                      </span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.gender}
                      </span>
                      <span className="info-text">
                        {_prlTxt.productviewpage.unisex}
                      </span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.condition}
                      </span>
                      <span className="info-text">
                        {_prlTxt.productviewpage.new}
                      </span>
                    </div>
                  </div>
                  <div className="tech-information">
                    <div className="display-flex justify-content-between">
                      <span className="info-text">
                        {_prlTxt.productviewpage.temcolor}
                      </span>
                      <span className="info-text">{techD.colors_Name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  mouseOver(e, i) {
    let _listing = this.state.items;
    _listing.extraData.images.forEach((items, index) => {
      index === e
        ? (_listing.extraData.images[index].isActive = true)
        : (_listing.extraData.images[index].isActive = false);
    });
    let _df180anglefull = "-186.429vw";
    if (global.language_Ids > "1") {
      _df180anglefull = "186.429vw";
    }
    this.setState({ items: _listing, _180rotationFull_left: _df180anglefull });
  }

  mouseOut() {
    //this.setState({hover: false});
  }

  onChangedLensPower = (e, f, i) => {
    this.setState({
      checkedPower: f,
      checkedPowerLens: e,
    });
  };

  openCartModalHandler(value) {
    if (this.state.checkedPowerLens == "1") {
      this.openAddtoCartModalHandler(this.state.items.product_Id, 0, 0, 0, 0);
    } else {
      this.manageModalLensPowerData(0);
      this.setState({
        modalIsOpen_powerLens: true,
      });
    }
  }

  getItem_RCV = (id) => {
    let recentViewList = localStorage.getItem("recentlyView");
    recentViewList = JSON.parse(recentViewList);
    const product = recentViewList.find((item) => {
      if (item.product_Id === id) {
        return item.product_Id;
      }
    });

    if (product === undefined || product === null) {
      return 0;
    } else {
      return product.product_Id;
    }
  };

  getItem = (id, lensId) => {
    let irisCartList = localStorage.getItem("irisCart");
    irisCartList = JSON.parse(irisCartList);
    const product = irisCartList.items.find((item) => {
      if (item.product_Id === id && item.lens_Id === lensId) {
        return item.product_Id;
      }
    });

    if (product === undefined || product === null) {
      return 0;
    } else {
      return product.product_Id;
    }
  };

  openAddtoCartModalHandler(proid, lensId, inxB, powerId, inxP) {
    var lesPA = {};
    var lastFinal = {};
    var contPW = {};
    let _lesDicAmt = 0;
    let _lesAmt = 0;
    if (lensId > 0) {
      let _lensPower = this.state.lensPower;
      let _brndsDetails = _lensPower[inxP].brands[inxB];

      lesPA.type = _lensPower[inxP].power_Name;
      lesPA.name = _brndsDetails.lens_Name;
      lesPA.lensPower_Type = this.state.checkedPowerLens;
      lesPA.label = _brndsDetails.lens_Name;
      lesPA.currencyCode = global.currencyCode;
      lesPA.value = _brndsDetails.lens_discountPrice;
      lesPA.id = lensId;
      lesPA.pid = powerId; //inxP;
      lesPA.bid = inxB;
      lesPA.warranty = _brndsDetails.lens_Warranty;
      lesPA.salePrice = _brndsDetails.lens_izPrice;
      lesPA.discount = _brndsDetails.lens_discount;
      lesPA.afterDiscount = _brndsDetails.lens_discountPrice;

      _lesDicAmt =
        _brndsDetails.lens_izPrice - _brndsDetails.lens_discountPrice;
      _lesAmt = _brndsDetails.lens_discountPrice;
    }

    let DiscAmt =
      this.state.items.product_izPrice -
      this.state.items.product_discountPrice +
      _lesDicAmt;

    lastFinal.slug = this.state.items.type_Slug;
    lastFinal.currencyCode = global.currencyCode;
    lastFinal.discounts = [];
    lastFinal.totalDiscount = DiscAmt;
    lastFinal.totalTax = 0;
    lastFinal.shipping = 0;
    lastFinal.subTotal = this.state.items.product_discountPrice + _lesAmt;
    lastFinal.total = this.state.items.product_discountPrice + _lesAmt;

    let irisCartList = localStorage.getItem("irisCart");
    if (irisCartList === null || irisCartList === undefined) {
      irisCartList = {};
      var obj = {};
      obj.storeId = "1";
      obj.countryId = "1";
      obj.languageId = "1";
      obj.currencyCode = global.currencyCode;
      obj.itemsQty = "0";
      obj.itemsCount = "0";
      obj.items = [
        {
          product_Id: this.state.items.product_Id,
          lens_Id: lensId,
          power_option: "0",
          product_Name: entities.decode(this.state.items.product_Name),
          salePrice: this.state.items.product_izPrice,
          discount: this.state.items.product_discount,
          afterDiscount: this.state.items.product_discountPrice,
          product_image: _firstBaseImage,
          product_Url: this.state.items.product_Url,
          count: 1,
          options: lesPA,
          Power: contPW,
          amount: lastFinal,
          buyOneGet: this.state.items.buyOneGet,
        },
      ];

      irisCartList = obj;
      localStorage.setItem("irisCart", JSON.stringify(irisCartList));
    } else {
      irisCartList = JSON.parse(irisCartList);
      const findIds = this.getItem(this.state.items.product_Id, lensId);
      //console.log(findIds+'--Find Id---'+lensId);
      let item = {};
      if (findIds !== 0 && lensId == 0) {
        for (let _i = 0; _i < irisCartList.items.length; _i++) {
          let id = irisCartList.items[_i].product_Id;
          //console.log(irisCartList.items[_i].lens_Id);
          if (id === findIds && irisCartList.items[_i].lens_Id == 0) {
            irisCartList.items[_i].count = irisCartList.items[_i].count + 1;
            let _newAmount = this.state.items.product_discountPrice + _lesAmt;
            let _newCount = irisCartList.items[_i].count;
            //console.log(_newAmount+'------'+_newCount);
            irisCartList.items[_i].amount.total = _newAmount * _newCount;
            irisCartList.items[_i].amount.subTotal = _newAmount;
            //console.log(irisCartList);
            localStorage.setItem("irisCart", JSON.stringify(irisCartList));
            break;
          }
        }
      } else {
        item = {
          product_Id: this.state.items.product_Id,
          lens_Id: lensId,
          power_option: "0",
          product_Name: entities.decode(this.state.items.product_Name),
          salePrice: this.state.items.product_izPrice,
          discount: this.state.items.product_discount,
          afterDiscount: this.state.items.product_discountPrice,
          product_image: _firstBaseImage,
          product_Url: this.state.items.product_Url,
          count: 1,
          options: lesPA,
          Power: contPW,
          amount: lastFinal,
        };
        irisCartList.items.push(item);
        localStorage.setItem("irisCart", JSON.stringify(irisCartList));
      }
    }

    userCartManage(localStorage, PostData, sessionStorage, "Import");

    document.getElementById("counterCount").innerHTML =
      irisCartList.items.length;
    this.setState({
      modalIsOpen_cart: true,
      modalIsOpen_powerLens: false,
    });

    // Check Free Buy 1 Get 1
    if (this.state.items.buyOneGet > 0) {
      //this.openFreeItemAddtoCartModalHandler(this.state.items.buyOneGet,0,0,0,0);
    }
    // End Check Condition
  }

  openFreeItemAddtoCartModalHandler(proid, lensId, inxB, powerId, inxP) {
    let _freeItems = this.state.freeItems;
    let _defaultImg = _freeItems.extraData.images;
    if (_defaultImg.length > 0) {
      _defaultImg =
        _freeItems.extraData.images[0].size_S +
        _freeItems.extraData.images[0].imagesUrl;
    } else {
      _defaultImg = _firstBaseImage;
    }

    var lesPA = {};
    var lastFinal = {};
    var contPW = {};
    let _lesDicAmt = 0;
    let _lesAmt = 0;
    if (lensId > 0) {
      let _lensPower = this.state.lensPower;
      let _brndsDetails = _lensPower[inxP].brands[inxB];

      lesPA.type = _lensPower[inxP].power_Name;
      lesPA.name = _brndsDetails.lens_Name;
      lesPA.lensPower_Type = this.state.checkedPowerLens;
      lesPA.label = _brndsDetails.lens_Name;
      lesPA.currencyCode = global.currencyCode;
      lesPA.value = _brndsDetails.lens_discountPrice;
      lesPA.id = lensId;
      lesPA.pid = powerId; //inxP;
      lesPA.bid = inxB;
      lesPA.warranty = _brndsDetails.lens_Warranty;
      lesPA.salePrice = _brndsDetails.lens_izPrice;
      lesPA.discount = _brndsDetails.lens_discount;
      lesPA.afterDiscount = _brndsDetails.lens_discountPrice;

      _lesDicAmt =
        _brndsDetails.lens_izPrice - _brndsDetails.lens_discountPrice;
      _lesAmt = _brndsDetails.lens_discountPrice;
    }

    let DiscAmt = _freeItems.product_discountPrice; //(_freeItems.product_izPrice - _freeItems.product_discountPrice) + _lesDicAmt;

    lastFinal.slug = _freeItems.type_Slug;
    lastFinal.currencyCode = global.currencyCode;
    lastFinal.discounts = [];
    lastFinal.totalDiscount = DiscAmt;
    lastFinal.totalTax = 0;
    lastFinal.shipping = 0;
    lastFinal.subTotal = 0; // _freeItems.product_discountPrice + _lesAmt;
    lastFinal.total = 0; //_freeItems.product_discountPrice + _lesAmt;

    let irisCartList = localStorage.getItem("irisCart");
    if (irisCartList === null || irisCartList === undefined) {
      irisCartList = {};
      var obj = {};
      obj.storeId = "1";
      obj.countryId = "1";
      obj.languageId = "1";
      obj.currencyCode = global.currencyCode;
      obj.itemsQty = "0";
      obj.itemsCount = "0";
      obj.items = [
        {
          product_Id: _freeItems.product_Id,
          lens_Id: lensId,
          power_option: "0",
          product_Name: entities.decode(_freeItems.product_Name),
          salePrice: 0, //_freeItems.product_izPrice,
          discount: 0, //_freeItems.product_discount,
          afterDiscount: 0, //_freeItems.product_discountPrice,
          product_image: _defaultImg,
          product_Url: _freeItems.product_Url,
          count: 1,
          options: lesPA,
          Power: contPW,
          amount: lastFinal,
        },
      ];
      irisCartList = obj;
      localStorage.setItem("irisCart", JSON.stringify(irisCartList));
    } else {
      irisCartList = JSON.parse(irisCartList);
      const findIds = this.getItem(_freeItems.product_Id, lensId);

      let item = {};
      if (findIds !== 0) {
        for (let _i = 0; _i < irisCartList.items.length; _i++) {
          let id = irisCartList.items[_i].product_Id;
          if (id === findIds) {
            irisCartList.items[_i].count = irisCartList.items[_i].count + 1;
            localStorage.setItem("irisCart", JSON.stringify(irisCartList));
            break;
          }
        }
      } else {
        item = {
          product_Id: _freeItems.product_Id,
          lens_Id: lensId,
          power_option: "0",
          product_Name: entities.decode(_freeItems.product_Name),
          salePrice: 0, //_freeItems.product_izPrice,
          discount: 0, //_freeItems.product_discount,
          afterDiscount: 0, //_freeItems.product_discountPrice,
          product_image: _defaultImg,
          product_Url: _freeItems.product_Url,
          count: 1,
          options: lesPA,
          Power: contPW,
          amount: lastFinal,
        };
        irisCartList.items.push(item);
        localStorage.setItem("irisCart", JSON.stringify(irisCartList));
      }
    }

    userCartManage(localStorage, PostData, sessionStorage, "Import");

    document.getElementById("counterCount").innerHTML =
      irisCartList.items.length;
    this.setState({
      modalIsOpen_cart: true,
      modalIsOpen_powerLens: false,
    });
  }

  openModalHandler(value) {
    let _modalIdsData = "";
    let _modalIdsTitle = "";
    if (value === "frameSizeModal") {
      _modalIdsData = "iris_frame_detail_modal";
      _modalIdsTitle = _prlTxt.modal_face;
    } else if (value === "weightGroupModal") {
      _modalIdsData = "iris_techinfo_modal";
      _modalIdsTitle = _prlTxt.modal_eye;
    }
    this.setState({
      modalIsOpen_FS: true,
      _modalKey: value,
      _modalIds: _modalIdsData,
      _modalTitle: _modalIdsTitle,
      //_modalData:FreamSizeMD
    });
  }

  closeModalHandler = () => {
    this.setState({
      modalIsOpen_FS: false,
      modalIsOpen_powerLens: false,
      modalIsOpen_cart: false,
    });
  };

  rotate180FullImage = (e) => {
    const _start_X = e.pageX; // 686
    let _newX = [
      { id: 0, pos: "0vw", data: 43, dataTo: 125 },
      { id: 1, pos: "-62.597vw", data: 125, dataTo: 279 },
      { id: 2, pos: "-124.597vw", data: 279, dataTo: 393 },
      { id: 3, pos: "-186.429vw", data: 393, dataTo: 507 },
      { id: 4, pos: "-248.663vw", data: 507, dataTo: 631 },
      { id: 5, pos: "-310.329vw", data: 631, dataTo: 735 },
      { id: 6, pos: "-372.329vw", data: 735, dataTo: 875 },
    ];

    if (global.language_Ids > "1") {
      _newX = [
        { id: 0, pos: "372.329vw", data: 443, dataTo: 525 },
        { id: 1, pos: "310.329vw", data: 525, dataTo: 679 },
        { id: 2, pos: "248.663vw", data: 679, dataTo: 793 },
        { id: 3, pos: "186.429vw", data: 793, dataTo: 907 },
        { id: 4, pos: "124.597vw", data: 907, dataTo: 1031 },
        { id: 5, pos: "62.597vw", data: 1031, dataTo: 1135 },
        { id: 6, pos: "0vw", data: 1135, dataTo: 1275 },
      ];
    }

    var data = _newX.filter(
      (item) => item.dataTo > _start_X && item.data < _start_X
    );

    if (data.length > 0) {
      let _nePos = data[0].pos;
      this.setState({
        _180rotationFull_left: _nePos,
      });
    }
  };

  rotate180Image = (e) => {
    const _start_X = e.pageX; // 686
    let _newX = [
      { id: 0, pos: "0vw", data: 686, dataTo: 746 },
      { id: 1, pos: "-26.4997vw", data: 746, dataTo: 806 },
      { id: 2, pos: "-52.9993vw", data: 806, dataTo: 866 },
      { id: 3, pos: "-79.499vw", data: 866, dataTo: 926 },
      { id: 4, pos: "-105.999vw", data: 926, dataTo: 986 },
      { id: 5, pos: "-132.498vw", data: 986, dataTo: 1010 },
      { id: 6, pos: "-158.998vw", data: 1050, dataTo: 1050 },
    ];

    if (global.language_Ids > "1") {
      _newX = [
        { id: 0, pos: "158.998vw", data: 686, dataTo: 746 },
        { id: 1, pos: "132.498vw", data: 746, dataTo: 806 },
        { id: 2, pos: "105.999vw", data: 806, dataTo: 866 },
        { id: 3, pos: "79.499vw", data: 866, dataTo: 926 },
        { id: 4, pos: "52.9993vw", data: 926, dataTo: 986 },
        { id: 5, pos: "26.4997vw", data: 986, dataTo: 1010 },
        { id: 6, pos: "0vw", data: 1050, dataTo: 1050 },
      ];
    }

    var data = _newX.filter(
      (item) => item.dataTo > _start_X && item.data < _start_X
    );
    if (data.length > 0) {
      let _nePos = data[0].pos;
      this.setState({
        _180rotation_left: _nePos,
      });
    }
  };

  manage180Image(e) {
    let _df180angle = "-79.499vw";
    if (global.language_Ids > "1") {
      _df180angle = "79.499vw";
    }
    this.setState({
      _default180: e.target.getAttribute("data-src"),
      _180rotation_left: _df180angle,
    });
  }

  modalTabActivation(e) {
    this.manageModalLensPowerData(e);
  }

  manageModalLensPowerData(e) {
    let _activeTab = this.state.checkedPower;
    if (e > 0) {
      _activeTab = e;
    }

    _modalPower_Titles = [];
    _modalPower_tabsData = [];

    if (this.state.isLoaded === true) {
      let _lensPower = this.state.lensPower;
      let _nxtC = "2112";
      for (let _p = 0; _p < _lensPower.length; _p++) {
        if (_lensPower[_p].lensPower_Type != "1") {
          _nxtC++;
          let _actived = "";

          if (_activeTab == _lensPower[_p].power_Id) {
            _actived = " active";
          }

          let _pwrImg = "";
          if (_lensPower[_p].lensPower_ImageUrl != 0) {
            _pwrImg = (
              <img
                src={_lensPower[_p].lensPower_ImageUrl}
                alt="nav"
                style={{ height: "30px" }}
              />
            );
          }

          let _singleLink = "";
          if (_lensPower.length == "1") {
            _singleLink = "singleList";
          }

          _modalPower_Titles.push(
            <li key={_nxtC} className={"nav-item " + _singleLink}>
              <a
                className={"nav-link " + _actived}
                data-lensid={_lensPower[_p].power_Id}
                onClick={this.modalTabActivation.bind(
                  this,
                  _lensPower[_p].power_Id
                )}
                role="tab"
              >
                {_pwrImg} {_lensPower[_p].power_Name}
              </a>
            </li>
          );

          let _brandsData = _lensPower[_p].brands;

          let _ptsSData = _lensPower[_p].points;
          let _uqKey = "8857";

          for (let _q = 0; _q < _brandsData.length; _q++) {
            let _modalPower_ptsTabsData = [];
            let _specificationArr = JSON.parse(
              _brandsData[_q].lens_Specifications
            );

            //console.log(_brandsData[_q]);

            for (let _pt = 0; _pt < _ptsSData.length; _pt++) {
              _uqKey++;
              let _iCons = "";
              //console.log(_specificationArr[_ptsSData[_pt].lensPts_Id]);
              if (_specificationArr[_ptsSData[_pt].lensPts_Id] == 1) {
                if (_ptsSData[_pt].points_url != "0") {
                  var divStyle = {
                    backgroundImage: "url(" + _ptsSData[_pt].points_url + ")",
                  };

                  _iCons = (
                    <span className="tooltip-outer">
                      <i className="fas fa-info-circle"></i>
                      <div className="tooltip-inner">
                        <div className="image-show" style={divStyle}></div>
                      </div>
                    </span>
                  );
                }
                _modalPower_ptsTabsData.push(
                  <li key={_uqKey} className="active">
                    <i className="fas fa-check"></i>
                    {_ptsSData[_pt].points_title} {_iCons}
                  </li>
                );
              } else {
                _modalPower_ptsTabsData.push(
                  <li key={_uqKey} className="inactive">
                    <i className="fas fa-times"></i>
                    {_ptsSData[_pt].points_title} {_iCons}
                  </li>
                );
              }
            }

            _modalPower_ptsTabsData.push(
              <li key={_q + 7894} className="active Blue Light">
                <i className="fas fa-check"></i>
                {_brandsData[_q].lens_index}
              </li>
            );

            _modalPower_ptsTabsData.push(
              <li key={_q + 78943} className="active Blue Light">
                <i className="fas fa-check"></i>
                {_brandsData[_q].lens_Warranty}
              </li>
            );

            if (_activeTab == _brandsData[_q].power_Id) {
              let _priceShow = [];
              if (
                _brandsData[_q].lens_izPrice ==
                _brandsData[_q].lens_discountPrice
              ) {
                _priceShow.push(
                  <div key={_q + 7891} className="price-lens">
                    <span className="discount_price" id="price_92">
                      {global.currencyCode} {_brandsData[_q].lens_discountPrice}
                    </span>
                  </div>
                );
              } else {
                _priceShow.push(
                  <div className="price-lens" key={_q + 78591}>
                    <span className="originalPrice">
                      {global.currencyCode} {_brandsData[_q].lens_izPrice}
                    </span>
                    <span className="discount_price" id="price_92">
                      {global.currencyCode} {_brandsData[_q].lens_discountPrice}
                    </span>
                  </div>
                );
              }

              let _addStick = "slide";
              if (_q == "0") {
                _addStick = "slide stick"; //this.state.modalFixed_Lens;
              } else if (_q == "1") {
                _addStick = "slide mtStick";
              }

              _modalPower_tabsData.push(
                <li key={_brandsData[_q].lens_Id} className={_addStick}>
                  <div className="inside-lens-wrap">
                    <div className="list-inside-details">
                      <div className="lens-frst-column">
                        <div className="lens-name">
                          {_brandsData[_q].lens_Name}
                          </div>
                          {_priceShow}
                          <div
                          className="addtocart tag"
                          onClick={this.openAddtoCartModalHandler.bind(
                            this,
                            this.state.items.product_Id,
                            _brandsData[_q].lens_Id,
                            _q,
                            _lensPower[_p].power_Id,
                            _p
                          )}
                        >
                          {_prlTxt.productviewpage.addtocart}
                        </div>
                      </div>

                      <div className="lens-third-column">
                      <span className="offertxt">
                          Use Code COOL20 & Get 20% Discount
                          </span>
                        <ul className="dynamicOptions">
                          {_modalPower_ptsTabsData}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              );
            }
          }
        }
      }
    }
    this.setState({
      checkedPower: _activeTab,
    });
  }

  checkPostCode(event) {
    this.setState({ cityFiltShow: false });
    event.preventDefault();
    let errors = this.state.errors;
    if (this.state.postalCode == null) {
      errors["postalCode"] = "*Please Enter Citya...";
      this.setState({ errors: errors });
    }
    if (validateForm(this.state.errors)) {
      let _urlChkPD =
        global.checkPostCode +
        "?country_Id=" +
        global.country_Ids +
        "&postcode=" +
        this.state.postalCode;
      PostData(_urlChkPD, "", "GET").then((res) => {
        if (res.success == true) {
          this.setState({
            postalCodeMsg: res.message,
            _postalCodeMsgCss: "successDelivery",
          });
        } else {
          this.setState({
            postalCodeMsg: res.message,
            _postalCodeMsgCss: "errorDelivery",
          });
        }
      });
    }
  }

  recentViewItems() {
    let recentViewList = localStorage.getItem("recentlyView");
    recentViewList = JSON.parse(recentViewList);
    let _selectBox = [];

    if (recentViewList != undefined || recentViewList != null) {
      _recentListClass = "hiddenData_Now";
      if (recentViewList.length > 2) {
        _similarListClass = "col-lg-6";
        _recentListClass = "col-lg-6";
        for (let _p = 0; _p < recentViewList.length; _p++) {
          let _url = recentViewList[_p].product_URL
            ? recentViewList[_p].product_URL
            : window.location.href;
          _selectBox.push(
            <div className="iris_bd_rgt recentSlide_Col" key={_p}>
              <a href={_url}>
                <img
                  src={recentViewList[_p].image}
                  alt={recentViewList[_p].product_Name}
                  title={recentViewList[_p].product_Name}
                />
                <h4>{recentViewList[_p].product_Name}</h4>
                <p className="oldPrice">
                  SAE {recentViewList[_p].product_izPrice}
                </p>
                <span className="newPrice">
                  <span className="newPriceA">{global.currencyCode}</span>{" "}
                  <span className="newPriceB">
                    {recentViewList[_p].product_discountPrice}
                  </span>
                </span>
              </a>
            </div>
          );
        }

        return (
          <div className="MS-content">
            <Slider {...settings}>{_selectBox} </Slider>
          </div>
        );
      }
    } else {
      _recentListClass = "hiddenData_Now";
    }
  }

  similarOptions() {
    let _similarProducts = this.state.similarProducts;
    let _similarBox = [];

    if (_similarProducts != undefined || _similarProducts != null) {
      if (_similarProducts.length > 2) {
        for (let _p = 0; _p < _similarProducts.length; _p++) {
          var _imgDat = _similarProducts[_p].extraData.images;
          if (_imgDat.length) {
            let _url = _similarProducts[_p].extraData.images[0].product_Url;
            _url =
              global.BASE_URL +
              _similarProducts[_p].extraData.images[0].menuUrl +
              "/" +
              _url;
            _similarBox.push(
              <div className="iris_bd_rgt recentSlide_Col" key={_p}>
                <a href={_url}>
                  <img
                    src={
                      _similarProducts[_p].extraData.images[0].size_M +
                      _similarProducts[_p].extraData.images[0].imagesUrl
                    }
                    alt={_similarProducts[_p].extraData.images[0].product_Name}
                    title={_similarProducts[_p].product_Name}
                  />
                  <h4>
                    {_similarProducts[_p].extraData.images[0].product_Name}
                  </h4>
                  <p className="oldPrice">
                    SAE{" "}
                    {_similarProducts[_p].extraData.images[0].product_izPrice}
                  </p>
                  <span className="newPrice">
                    <span className="newPriceA">{global.currencyCode}</span>{" "}
                    <span className="newPriceB">
                      {
                        _similarProducts[_p].extraData.images[0]
                          .product_discountPrice
                      }
                    </span>
                  </span>
                </a>
              </div>
            );
          }
        }

        return (
          <div className="MS-content">
            <Slider {...settings}>{_similarBox} </Slider>
          </div>
        );
      }
    }
  }

  setSelectCity(e, t) {
    this.setState({ cityFiltShow: false });
    this.setState({ postalCode: e });
    this.checkPostCode.bind(this);
  }

  autoCompleteSearch(e) {
    e.preventDefault();
    let _autoTxt = e.target.value;
    if (_autoTxt.length > 1) {
      this.autoSearchApi(_autoTxt);
      this.setState({ postalCode: _autoTxt });
    } else {
      this.setState({ _serachCityData: [], postalCode: _autoTxt });
    }
  }

  autoSearchApi(e) {
    _searchcitytxt = e;
    let _urlData = global.cityAutoCompleteText + global.language_Ids + "/" + e;

    PostData(_urlData, "", "GET").then((res) => {
      let _listing = res.response;
      this.setState({ _serachCityData: _listing, cityFiltShow: true });
    });
  }

  myReff = React.createRef();
  handleClickOutside = (e) => {
    if (!this.myReff.current.contains(e.target)) {
      this.setState({ cityFiltShow: false });
    }
  };

  Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  myReff_MD = React.createRef();
  handleScroll = () => {
    const scrollY = window.scrollY; //Don't get confused by what's scrolling - It's not the window
    const scrollTop = this.myReff_MD.current.scrollTop;
    console.log(scrollTop);
    if (scrollTop > 10) {
      //this.manageModalLensPowerData(0);
      this.setState({ modalFixed_Lens: "slide stick" });
    } else if (scrollTop < 10) {
      //this.manageModalLensPowerData(0);
      this.setState({ modalFixed_Lens: "slide" });
    }
  };
  render() {
    const { errors } = this.state;
    if (this.state.isLoaded == true) {
      _loader = "glb-ldr-prt";
    }
    const shareUrl = window.location.href;

    return (
      <React.Fragment>
        <Helmet>
          <title>{entities.decode(this.state.items.product_seoTitle)}</title>
          <meta
            name="description"
            content={entities.decode(this.state.items.product_seoDescription)}
          />
          <meta
            name="keywords"
            content={entities.decode(this.state.items.product_seoKeywords)}
          />
          <meta property="og:url" content={shareUrl} />
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
                      <li>
                        <a href={global.BASE_URL}>Home</a>
                        <span className="breadSpce">></span>
                      </li>
                      <li>
                        <a href={global.BASE_URL + _catsTxt}>
                          {this.Capitalize(_catsTxt.replace(/-/g, " "))}
                        </a>
                        <span className="breadSpce">></span>
                      </li>
                      <li>{this.state.items.code}</li>
                    </ul>
                  </div>
                  <div
                    className="col-lg-5 iris_product_list_top_middle"
                    align="right"
                  >
                    <ul id="dittoView">
                      <li style={{ marginRight: "25px" }}> Normal View </li>
                      <li>
                        <label className="switch">
                          <input type="checkbox" />
                          <span className="slider round"></span>
                        </label>
                      </li>
                      <li>
                        {" "}
                        <img
                          src={global.BASE_URL + "assets/img/iris_180D_img.jpg"}
                          alt=""
                          title=""
                        />{" "}
                      </li>
                      <li> Virtual Try-On </li>
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

        <section className="iris_product_detail_container">
          <div className="container">
            <div className="row iris_pd_sec_2">
            <p className="iris_buyhead">How to buy an eyeglass</p>
              <div className="row col-lg-12 w-100 mx-0 ">
                <div className="col-lg-8 iris_find_pin left_irisbuydiv">
                  <ul
                    className="nav nav-tabs process-model more-icon-preocess"
                    role="tablist"
                  >
                    <li role="presentation" className="active">
                      <p>{_prlTxt.productviewpage.choosefr}</p>
                      <i className="iris">
                        <img
                          src={global.BASE_URL + "assets/img/detail-step-1.png"}
                          alt="description"
                        />
                      </i>
                      <div className="iris_arrow">
                        <img
                          src={global.BASE_URL + "assets/img/iris_arrow.png"}
                          alt="description"
                        />
                      </div>
                    </li>
                    <li role="presentation">
                      <p>{_prlTxt.productviewpage.chooselns}</p>
                      <i className="iris">
                        <img
                          src={global.BASE_URL + "assets/img/detail-step-2.png"}
                          alt="description"
                        />
                      </i>
                      <div className="iris_arrow">
                        <img
                          src={global.BASE_URL + "assets/img/iris_arrow.png"}
                          alt="description"
                        />
                      </div>
                    </li>
                    <li role="presentation">
                      <p>{_prlTxt.productviewpage.completepur}</p>
                      <i className="iris">
                        <img
                          src={global.BASE_URL + "assets/img/detail-step-3.png"}
                          alt="description"
                        />
                      </i>
                      <div className="iris_arrow">
                        <img
                          src={global.BASE_URL + "assets/img/iris_arrow.png"}
                          alt="description"
                        />
                      </div>
                    </li>
                    <li role="presentation">
                      <p>{_prlTxt.productviewpage.specifpower}</p>
                      <i className="iris">
                        <img
                          src={global.BASE_URL + "assets/img/detail-step-4.png"}
                          alt="description"
                        />
                      </i>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 delivery_box">
                  <div>
                    <p className="deliveryTxt">
                      {_prlTxt.productviewpage.chkdelivery}
                    </p>
                    <form
                      className="iris_find_pin"
                      ref={this.myReff}
                      autoComplete="new-password"
                    >
                      <input
                        type="text"
                        value={this.state.postalCode}
                        name="postalCode"
                        placeholder={_prlTxt.productviewpage.findcity}
                        onChange={this.handleChange}
                        onChange={this.autoCompleteSearch.bind(this)}
                        autoComplete="off"
                      />
                      <button onClick={this.checkPostCode.bind(this)}>
                        <i className="fas fa-caret-right"></i>
                      </button>
                      <div className="clearfix"></div>
                      <span className="iris_error_txt">
                        {errors.postalCode.length > 0 && (
                          <span className="error">{errors.postalCode}</span>
                        )}
                      </span>

                      <div
                        className="autotrending_city"
                        id={
                          this.state.cityFiltShow ? "shownData" : "hiddenData"
                        }
                      >
                        <div className="autotrending_block_city">
                          <ul className="autotrending_list menu-link">
                            {this.state._serachCityData.map((item, index) => {
                              return (
                                <li key={index}>
                                  <a
                                    className="title"
                                    href="#C"
                                    onClick={this.setSelectCity.bind(
                                      this,
                                      item.city_name
                                    )}
                                  >
                                    {item.city_name}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    </form>
                    <div id={this.state._postalCodeMsgCss}>
                      {this.state.postalCodeMsg}
                    </div>
                  </div>
                 
                  <div className="iris_imfo_img">
                    <img
                      src={global.BASE_URL + "assets/img/iris_info_1.png"}
                      alt=""
                      title=""
                    />
                  </div>
               
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
                    <a
                      className="nav-item nav-link active"
                      id="pop2-tab"
                      data-toggle="tab"
                      href="#pop2"
                      role="tab"
                      aria-controls="pop2"
                      aria-selected="false"
                    >
                      {_prlTxt.productviewpage.sizedetail}
                    </a>
                    <a
                      className="nav-item nav-link"
                      id="pop1-tab"
                      data-toggle="tab"
                      href="#pop1"
                      role="tab"
                      aria-controls="pop1"
                      aria-selected="true"
                    >
                      {_prlTxt.productviewpage.prodesc}
                    </a>
                    <a
                      className="nav-item nav-link"
                      id="pop3-tab"
                      data-toggle="tab"
                      href="#pop3"
                      role="tab"
                      aria-controls="pop3"
                      aria-selected="false"
                    >
                      {_prlTxt.productviewpage.techinfm}
                    </a>
                    <a
                      className="nav-item nav-link"
                      id="pop4-tab"
                      data-toggle="tab"
                      href="#pop4"
                      role="tab"
                      aria-controls="pop4"
                      aria-selected="false"
                    >
                      {_prlTxt.productviewpage.proreview}
                    </a>
                    {this.state.items.coupon_Id == undefined ? (
                      <div></div>
                    ) : (
                      <a
                        className="nav-item nav-link"
                        id="pop5-tab"
                        data-toggle="tab"
                        href="#pop5"
                        role="tab"
                        aria-controls="pop5"
                        aria-selected="false"
                      >
                        {_prlTxt.productviewpage.offer +
                          this.state.items.offer_images}
                      </a>
                    )}
                  </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane fade"
                    id="pop1"
                    role="tabpanel"
                    aria-labelledby="pop1-tab"
                  >
                    <div className="Product_discription_tab">
                      <div className="iris_prod_desc">
                        <h6>{_frontTitle}</h6>
                        <div className="iris_prod_desc_img">
                          <img
                            src={_firstBaseImage}
                            alt="{_frontTitle}"
                            title="{_frontTitle}"
                          />
                          <div className="iris_prod_desc_2">
                            <h5>{_prlTxt.productviewpage.completecare}</h5>
                            <div className="row">
                              <div className="col-lg-6">
                                <p>{_prlTxt.productviewpage.moneyback}</p>
                                <p>{_prlTxt.productviewpage.homevisit}</p>
                              </div>
                              <div className="col-lg-6">
                                <p>{_prlTxt.productviewpage.unlimit}</p>
                                <p>{_prlTxt.productviewpage.freeorder}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="tab-pane fade show active"
                    id="pop2"
                    role="tabpanel"
                    aria-labelledby="pop2-tab"
                  >
                    {this.sizeDetailsImg(this.state.items)}
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pop3"
                    role="tabpanel"
                    aria-labelledby="pop3-tab"
                  >
                    {this.technicalDetails(this.state.items)}
                  </div>
                  <div
                    className="tab-pane fade"
                    id="pop4"
                    role="tabpanel"
                    aria-labelledby="pop4-tab"
                  >
                    <div className="Product_discription_tab">
                      <div className="iris_prod_reviews row">
                        <div className="col-lg-6" align="center">
                          <h6 className="iris_txt_style_1">
                            {_prlTxt.productviewpage.avarating}
                          </h6>
                          <ul className="iris_rat_rev">
                            <li>
                              <i className="fas fa-heart"></i>
                            </li>
                            <li>
                              <i className="fas fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                          </ul>
                          <a
                            href="#RW"
                            onClick={(e) => e.preventDefault()}
                            className="iris_link_style_1"
                          >
                            2 reviews &gt;&gt;
                          </a>
                        </div>
                        <div className="col-lg-6" align="center">
                          <h6 className="iris_txt_style_1">
                            {_prlTxt.productviewpage.haverate}
                          </h6>
                          <a
                            href="#WR"
                            onClick={(e) => e.preventDefault()}
                            className="iris_link_style_1"
                            data-toggle="modal"
                            data-target="#iris_write_review_modal"
                          >
                            {_prlTxt.productviewpage.writereview}
                          </a>
                          <ul className="iris_rat_rev">
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                          </ul>
                          <a
                            href="#RT"
                            onClick={(e) => e.preventDefault()}
                            className="iris_link_style_2"
                            data-toggle="modal"
                            data-target="#iris_write_review_modal"
                          >
                            {_prlTxt.productviewpage.ratenow} &gt;&gt;
                          </a>
                        </div>
                      </div>
                      <div className="iris_prod_reviews_2 row">
                        <div className="col-lg-4" align="center">
                          <ul className="iris_rat_rev">
                            <li>
                              <i className="fas fa-heart"></i>
                            </li>
                            <li>
                              <i className="fas fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                          </ul>
                          <h6 className="iris_txt_style_1">Shruti, Dubai</h6>
                          <p
                            className="iris_txt_style_2 iris_txt_style_2J"
                            align="center"
                          >
                            April 20, 2019
                          </p>
                        </div>
                        <div className="col-lg-8">
                          <h6 className="iris_txt_style_1">Simply Flawless</h6>
                          <p className="iris_txt_style_2">
                            All the Lorem Ipsum generators on the Internet tend
                            to repeat predefined chunks as necessary, making
                            this the first true generator on the Internet. It
                            uses a dictionary of over 200 Latin words, combined
                            with a handful of model sentence structures, to
                            generate Lorem Ipsum which looks reasonable.
                          </p>
                        </div>
                      </div>
                      <div className="iris_prod_reviews_2 row iris_ctg_br_non">
                        <div className="col-lg-4" align="center">
                          <ul className="iris_rat_rev">
                            <li>
                              <i className="fas fa-heart"></i>
                            </li>
                            <li>
                              <i className="fas fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                            <li>
                              <i className="far fa-heart"></i>
                            </li>
                          </ul>
                          <h6 className="iris_txt_style_1">Shruti, Dubai</h6>
                          <p className="iris_txt_style_2 iris_txt_style_2J">
                            April 20, 2019
                          </p>
                        </div>
                        <div className="col-lg-8">
                          <h6 className="iris_txt_style_1">Simply Flawless</h6>
                          <p className="iris_txt_style_2">
                            All the Lorem Ipsum generators on the Internet tend
                            to repeat predefined chunks as necessary, making
                            this the first true generator on the Internet. It
                            uses a dictionary of over 200 Latin words, combined
                            with a handful of model sentence structures, to
                            generate Lorem Ipsum which looks reasonable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {this.state.items.offer_images == 0 ? (
                    <div></div>
                  ) : (
                    <div
                      className="tab-pane fade"
                      id="pop5"
                      role="tabpanel"
                      aria-labelledby="pop5-tab"
                    >
                      <div className="Product_discription_tab">
                        <div className="iris_prod_offers" align="center">
                          <img
                            src={this.state.items.offer_images}
                            alt=""
                            title=""
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                  <h6 className="iris_txt_style_1 iris_txt_style_1A">
                    {_prlTxt.productviewpage.recentlyviewed}
                  </h6>
                  {this.recentViewItems()}
                </div>
                <div className={_similarListClass} align="center">
                  <h6 className="iris_txt_style_1 iris_txt_style_1A">
                    {_prlTxt.productviewpage.similaroption}
                  </h6>
                  {this.similarOptions()}
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Product Details Ends */}

        {/* Modal for Fream Size Begins */}
        <Modal
          isOpen={this.state.modalIsOpen_FS}
          onRequestClose={this.closeModalHandler}
          id={this.state._modalIds}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{this.state._modalTitle}</h5>
                <button
                  type="button"
                  className="close"
                  onClick={this.closeModalHandler}
                >
                  <span aria-hidden="true">×</span>
                </button>
                <div className="clearfix"></div>
              </div>
              {this.renderModalData()}
            </div>
          </div>
        </Modal>
        {/* Modal for Fream Size Ends */}

        {/* Modal for Lens Ponits Begins */}
        <Modal
          isOpen={this.state.modalIsOpen_powerLens}
          onRequestClose={this.closeModalHandler}
          id="iris_Add_To_Cart_Modal"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header iris_lense_select_header">
                <h5 className="modal-title">
                  {_prlTxt.productviewpage.selectlenspowernow}
                </h5>
                <span
                  className="close_Modal_Pop"
                  onClick={this.closeModalHandler}
                >
                  <img
                    src={global.BASE_URL + "assets/img/cross_lens.svg"}
                    alt="close lenses"
                  />
                </span>
              </div>
              <div className="modal-body row iris_addcart_content insideFlow">
                <div className="lenstab">
                  <ul className="nav nav-tabs" role="tablist">
                    {_modalPower_Titles}
                  </ul>
                </div>
                <div
                  className="tab-des-cont"
                  onScroll={this.handleScroll}
                  ref={this.myReff_MD}
                >
                  <div className="lens-details-wrap Single-Vision Bifocal ZERO-Power active">
                    <ul className="sliderTab">{_modalPower_tabsData}</ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
        {/* Modal for Lens Ponits End */}

        <Modal
          isOpen={this.state.modalIsOpen_cart}
          onRequestClose={this.closeModalHandler}
          id="iris_Add_To_Cart_Modal_1"
        >
          <IrisCart closeModalHandler={this.closeModalHandler} />
        </Modal>

        <div id="global_loader" className={_loader}>
          <ProductDetailLoader />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

Modal.setAppElement("body");

export default productDataView;
