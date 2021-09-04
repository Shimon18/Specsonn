import React from 'react'
import Footer from '../containers/Footer';
import { Helmet } from 'react-helmet';

class warrantyPolicy extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>Warranty Policy | IRIS Boutiq</title>
                    <meta name="description" content="Warranty Policy | IRIS Boutiq"/>
                    <meta name="description" content="Warranty Policy | IRIS Boutiq" />
                    <meta name="keywords" content="Warranty Policy | IRIS Boutiq" />
                </Helmet>
                {/* Warranty Policy Begins */}                                    
                <section className="iris_inner_pages_banner_static">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1>Warranty Policy</h1>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="iris_privacy_policy">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <ul>
                                    <li>Warranty period starts from the date of delivery.</li>
                                    <li>One Year Warranty is applicable only on Eyeglasses category.</li>
                                    <li>This warranty is not applicable on damages resulting from any sort of negligence, mishandling, accidents, corrosion or rust, and loss of components or accessories on the customer's part.</li>
                                    <li>A product will only be replaced by IRISboutiq on its sole discretion depending on the nature of defects.</li>
                                    <li>Under this warranty, only defective/damaged lens coating will be covered.</li>
                                    <li>This warranty is valid only when you buy through IRISboutiq.com & IRISboutiq Stores.</li>
                                    <li>IRISboutiq will not be accountable for payments or refund against any incidental or consequential damages.</li>

                                </ul>
                                <br/>
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
        
export default warrantyPolicy