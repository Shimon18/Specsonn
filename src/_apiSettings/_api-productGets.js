// Website Control Apis
global.webMenu = global.API_URL+'webMenuNav/'; // webMenu/ menu/

// Product Listing Apis
global.productLists = global.API_URL+'products/filter';
global.productMenuLists = global.API_URL+'products/filterIds';
global.productDetails = global.API_URL+'products/productIds';
global.productFreeDetails = global.API_URL+'products/freeProducts';

global.productLensPower = global.API_URL+'products/lensDetails';
global.homeSectionTopOffers = global.API_URL+'home/offerSection';
global.homeSectionTopOffersList = global.API_URL+'otherHomeSections/ListSec';
global.OffersList = global.API_URL+'offerSection/List';
global.categorySectionList = global.API_URL+'categorySections/ListSec';
global.categorySectionListSync = global.API_URL+'categorySections/List';
global.sortingListSync = global.API_URL+'products/productFilterList';
global.genderListSync = global.API_URL+'genderSections/List';
global.homeBannerList = global.API_URL+'home/bannerSection';

global.cityAutoCompleteText = global.API_URL+'cityAutoCompleteText/';

// Store Locator
global.storeList = global.API_URL+'storeDetails';

// Search Api
global.searchAutoText = global.API_URL+'products/autoCompleteText/';
global.searchTextDetails = global.API_URL+'products/search/'+global.country_Ids+'/'+global.language_Ids+'/0/';

// Similar Option
global.similarProductsDetails = global.API_URL+'products/similarProduct';

// Coupon Apis
global.checkPostCode = global.API_URL+'checkAvailability/postCode';
global.checkCouponVaild = global.API_URL+'checkAvailability/offer';

// Contact Lens
global.contactLensHome = global.API_URL+'contactLens/webLinks';
global.contactLensSinglePowerList = global.API_URL+'contactLens/productPowers';

// Paytabs Apis
global.onlinePayment_createRequest = global.API_URL+'paytabsCreatePage';