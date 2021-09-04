import React from 'react'
import Footer from '../containers/Footer';
import { Helmet } from 'react-helmet';

class aboutUs extends React.Component {
    
    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>About Us | IRIS Boutiq</title>
                    <meta name="description" content="About Us | IRIS Boutiq"/>
                    <meta name="keywords" content="About Us | IRIS Boutiq" />
                </Helmet>
                {/* About Us Begins */}                                    
                    <section className="iris_home_best_seller">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="iris_bs-head">
                                        <span>Our Stroies</span>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam est erat, placerat sit amet urna nec, finibus condimentum nisi.</p>
                                    </div>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                    </p>
                                    <br/>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>                                    
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Us Box Ends */}
                    <Footer />                   
            </React.Fragment>
                )
            }
        }
        
export default aboutUs