import React from 'react'
import Footer from '../containers/Footer';
import { Helmet } from 'react-helmet';

class returnPolicy extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>Refund Policy | IRIS Boutiq</title>
                    <meta name="description" content="Refund Policy | IRIS Boutiq"/>
                    <meta name="description" content="Refund Policy | IRIS Boutiq" />
                    <meta name="keywords" content="Refund Policy | IRIS Boutiq" />
                </Helmet>
                {/* Refund Policy Begins */}                                    
                <section className="iris_inner_pages_banner_static">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1>Refund Policy</h1>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="iris_privacy_policy">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">

                                <p>At IRISboutiq, recommend you to carefully read our policies, conditions as well as terms of use. This will give you all the important information regarding our obligations and your rights as our customers for any purchase that you make on our website.
                                </p>
                                <p>
                                    We strive to make efforts to ensure all orders placed are delivered as per your specifications and stick to the timelines for shipping and delivery.
                                </p>
                                <ul>
                                    <li>If due to any reason the order isn't shipped out by IRISboutiq, then the order can be cancelled, and your money will be refunded to you. If your shipping address is not serviced by our logistics division, we will automatically cancel your order and the money will be refunded to you.
                                    </li>
                                    <li>
                                        If the product delivered is faulty, damaged in transit, or wrong, we will quickly initiate a refund.
                                    </li>
                                    <li>
                                        It is the customer's responsibility to not accept the damaged or unsealed shipment. However, if the product is found to be damaged after opening the package, the customer should write to us or call us to log-in the issue on the same day. If the customer fails to do that in the given time period mentioned above, then he/she will not be eligible for free returns.
                                    </li>
                                </ul>
                                <br/>
                                <h3>Refund Process</h3>
                                <p>
                                    To initiate a refund kindly write to us at support@IRISboutiq.com or call us at 05X-XXXXXXX to speak to our customer support agents.
                                </p>
                                <br/>
                                <h3>Refund Cycle</h3>
                                <p>
                                    The complete refund process normally takes about 10-15 working days. This includes time for product pickup, quality inspection, confirmation & refund initiation.
                                </p>
                                <p>
                                    Check all refund modes available & timelines below:
                                </p>
                                <table width="100%" cellPadding="0" cellSpacing="0" border="1">
                                <tbody>
                                    <tr>
                                        <th width="25%">PAYMENT MODE</th>
                                        <th width="25%">REFUND MODE</th>
                                        <th width="50%">REFUND PROCESSING TIMELINE
                                            <br/>(FROM THE DATE OF ORDER CANCELLATION)</th>
                                    </tr>
                                    <tr>
                                        <td>Credit Card</td>
                                        <td>Credit Card</td>
                                        <td>10-15 Working Days</td>
                                    </tr>
                                    <tr>
                                        <td>SADAD</td>
                                        <td>Bank Account Online Transfer</td>
                                        <td>10-15 Working Days</td>
                                    </tr>
                                    <tr>
                                        <td>Debit Card</td>
                                        <td>Bank Account Online Transfer</td>
                                        <td>10-15 Working Days</td>
                                    </tr>
                                    <tr>
                                        <td>COD</td>
                                        <td>Cash On Delivery: Bank Account Online Transfer</td>
                                        <td>10-15 Working Days</td>
                                    </tr>
                                    <tr>
                                        <td>Wallet</td>
                                        <td>Wallet</td>
                                        <td>10-15 Working Days</td>
                                    </tr>
                                </tbody>
                                </table>
                                <br/>
                                <h3>Offer Specific Refunds</h3>
                                <p>
                                    Kindly refer to the offer’s detailed T&Cs page to know the specific refund rules of that particular offer.
                                </p>
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
        
export default returnPolicy