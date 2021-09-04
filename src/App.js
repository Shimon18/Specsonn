import React, { Component,Fragment} from 'react';

import './App.css';
import { BrowserRouter as Router, Route ,Switch} from 'react-router-dom'
//import { Switch, Route } from 'react-router'
import routes from './routes';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Notfound from './pagesController/notfound';
import Header from './containers/Header';

import Home from './pagesController/index';
import signIn from './pagesController/signIn';
import signUp from './pagesController/signUp';
import forgotPassword from './pagesController/forgotPassword';
import resetPassword from './pagesController/resetPassword';

import aboutUs from './pagesStaticController/aboutUs';
import privacyPolicy from './pagesStaticController/privacyPolicy';
import disclaimer from './pagesStaticController/disclaimer';
import returnPolicy from './pagesStaticController/returnPolicy';
import termCondition from './pagesStaticController/term&condition';
import faqS from './pagesStaticController/faqS';
import blogListing from './pagesStaticController/blogListing';
import stores from './pagesStaticController/stores';
import findStore from './pagesController/findStore';
import cancelReturnPolicy from './pagesStaticController/cancelReturnPolicy';
import warrantyPolicy from './pagesStaticController/warrantyPolicy';

import offerSection from './pagesController/offerSection';
import genderSection from './pagesController/genderSection';
import sectionCategory from './pagesController/sectionCategory';

import eyeglasses from './pagesController/eyeglasses';

import productList from './pagesController/productList';
import productListCL from './pagesController/productListCL';

import productDataView from './pagesController/productDataView';
import productDataViewCL from './pagesController/productDataViewCL';
import searchRecommend from './pagesController/searchRecommend';

import wishList from './pagesController/wishList';

import insuranceMember from './pagesController/insuranceMember';
import cart from './pagesController/cart';
import checkoutLogin from './pagesController/checkoutLogin';
import checkoutShipping from './pagesController/checkoutShipping';
import checkoutShippingGuestUser from './pagesController/checkoutShippingGuest';
import checkoutPayment from './pagesController/checkoutPayment';

import userDashboard from './pagesUserController/userDashboard';
import userDashboardProfileManage from './pagesUserController/userDashboardProfileManage';
import userDashboardOrders from './pagesUserController/userDashboardOrders';
import userDashboardOrdersPrescription from './pagesUserController/userDashboardOrderPrescription';
import userDashboardPrescription from './pagesUserController/userDashboardPrescription';
import userDashboardAddress from './pagesUserController/userDashboardAddress';
import userDashboardProfilePassword from './pagesUserController/userDashboardProfilePassword';
import userReferral from './pagesUserController/userReferral';
import userDitto from './pagesUserController/userDitto';

const _cartCount = 0;

let _directionLang = 'ltr';
let _directionLangIds = 'ltr_side';
let _chkLang = global.lang;
let irisCountrySession = localStorage.getItem('irisCountrySession');
if(irisCountrySession !== undefined || irisCountrySession !== null)
{
    irisCountrySession = JSON.parse(irisCountrySession);
    _chkLang = irisCountrySession ? irisCountrySession.lang : global.lang;    
}

if(_chkLang == 'ar'){
  _directionLang = 'rtl';
  _directionLangIds = 'rtl_side';
}



class App extends Component {  
  render () {
    return (
      <div style={{direction:_directionLang,textAlign: 'start'}} id={_directionLangIds}>

        <div id="main-container">
          <Router> 
            <div>
              <Switch>
              <Route exact path={routes.checkoutLogin} component={checkoutLogin} />
                <Fragment>
                <Header _cartCount={_cartCount}/>
                <Route exact path={routes.Notfound} component={Notfound} />
                <Route exact path={routes.home} component={Home}/>
                <Route exact path={routes.signIn} component={signIn}/>
                <Route exact path={routes.signUp} component={signUp}/>
                <Route exact path={routes.forgotPassword} component={forgotPassword}/>
                <Route exact path={routes.resetPassword} component={resetPassword}/>

                <Route exact path={routes.cancelReturnPolicy} component={cancelReturnPolicy}/>
                <Route exact path={routes.warrantyPolicy} component={warrantyPolicy}/>
                <Route exact path={routes.aboutUs} component={aboutUs}/>
                <Route exact path={routes.disclaimer} component={disclaimer}/>
                <Route exact path={routes.privacyPolicy} component={privacyPolicy}/>
                <Route exact path={routes.returnPolicy} component={returnPolicy}/>
                <Route exact path={routes.termCondition} component={termCondition}/>
                <Route exact path={routes.faqS} component={faqS}/>
                <Route exact path={routes.blogListing} component={blogListing}/>
                <Route exact path={routes.stores} component={stores}/>
                <Route exact path={routes.findStore} component={findStore}/>
                <Route exact path={routes.wishList} component={wishList} />
                
                <Route exact path={routes.insuranceMember} component={insuranceMember}/>
                <Route exact path={routes.cart} component={cart}/>
                <Route exact path={routes.checkoutShipping} component={checkoutShipping} />
                <Route exact path={routes.checkoutShippingGuestUser} component={checkoutShippingGuestUser} />
                <Route exact path={routes.checkoutPayment} component={checkoutPayment} />

                {/* <Route exact path={routes.productList} component={productList}/> */}
                {/* <Route exact path={routes.productDataView} component={productDataView} /> */}
                {/* <Route exact path={routes.eyeglasses} component={eyeglasses}/> */}

                <Route exact path={routes.userDashboard} component={userDashboard}/>
                <Route exact path={routes.userDashboardProfileManage} component={userDashboardProfileManage} />
                <Route exact path={routes.userDashboardOrders} component={userDashboardOrders} />
                <Route exact path={routes.userDashboardOrdersPrescription} component={userDashboardOrdersPrescription} />
                <Route exact path={routes.userDashboardPrescription} component={userDashboardPrescription} />
                <Route exact path={routes.userDashboardAddress} component={userDashboardAddress} />
                <Route exact path={routes.userDashboardProfilePassword} component={userDashboardProfilePassword} />
                <Route exact path={routes.userReferral} component={userReferral}/>
                <Route exact path={routes.userDitto} component={userDitto}/>                

                <Route exact path={routes.searchRecommend} component={searchRecommend}/>
                <Route exact path={routes.offers+'/:offerTxt'} component={offerSection} />
                <Route exact path={routes.gender+'/:genderTxt'} component={genderSection} />

                <Route exact path={routes.promotion+'/:cagTxt/:sectionTxt'} component={sectionCategory} />

                <Route exact path={routes.contactLens+'/:type/:productId'} component={productDataViewCL}/>
                {/* <Route exact path={routes.contactLens+'/:productId'} component={productDataViewCL}/> */}
                <Route exact path={["/:product/:productId"]} path="/:catTxts/:typTxt" component={productDataView} />
                
                <Route exact path={routes.contactLens+'/list/:typsTxt/:filterId'} component={productListCL} />
                <Route exact path={["/:list/:listId/:filterId"]} path="/:catTxt/:typsTxt/:filterId" component={productList} />

                <Route exact path={["/listIds"]} path="/:catsTxt" component={eyeglasses} />

                </Fragment>             
              </Switch>
              </div>
            </Router>
            
          <ToastContainer autoClose={5000} />
        </div>
      </div>
    );
  }
}
export default App;