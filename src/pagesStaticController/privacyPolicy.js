import React from 'react'
import Footer from '../containers/Footer';
import { Helmet } from 'react-helmet';

class privacyPolicy extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>Privacy Policy | IRIS Boutiq</title>
                    <meta name="description" content="Privacy Policy | IRIS Boutiq"/>
                    <meta name="description" content="Privacy Policy | IRIS Boutiq" />
                    <meta name="keywords" content="Privacy Policy | IRIS Boutiq" />
                </Helmet>
                {/* Privacy Policy Begins */}                                    
                <section className="iris_inner_pages_banner_static">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1>Privacy Policy</h1>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="iris_privacy_policy">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h3>SECTION 1 - YOUR INFORMATION AND WHAT WE DO WITH IT</h3>
                                <p>
                                    When you purchase something from our store, as part of the buying and selling process, we collect your personal information (given by you such as your name, address and email address).
                                </p>
                                <p>
                                    When you browse our store, we automatically receive your computer’s IP address that provides us with information to learn about your browser and operating system.
                                </p>
                                <p>
                                    Plus, with your permission, we may send you emails about our store, new products and other updates.
                                </p>
                                <h3 className="iris_txt_B">SECTION 2 - CONSENT</h3>
                                <p><b>How do you get my consent?</b></p>
                                <p>When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specic reason only.
                                </p>
                                <p>If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an oppounity to say no.</p>
                                <p className="iris_txt_C">
                                    <b>How do I withdraw my consent?</b>
                                </p>
                                <p>
                                    If aer you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at <a href="mailto:info@irisboutiq.com">info@irisboutiq.com</a>
                                </p>
                                <h3 className="iris_txt_B">SECTION 3 - DISCLOSURE</h3>
                                <p>
                                    We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
                                </p>
                                <p className="iris_txt_C">
                                    <b>Payment:</b>
                                </p>
                                <p>
                                    If you choose a direct payment gateway to complete your purchase, then our service provider store your credit card data. It is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS). Your purchase transaction data is stored only as long as is necessary to complete your purchase transaction. Aer that is complete, your purchase transaction information is deleted.
                                </p>
                                <p>
                                    All direct payment gateways adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint eo of brands like Visa, Mastercard, American Express and Discover.
                                </p>
                                <p>
                                    PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers.
                                </p>
                                <h3 className="iris_txt_B">
                SECTION 4 - THIRD-PARTY SERVICES
                </h3>
                                <p>
                                    In general, the third-pay providers used by us will only collect, use and disclose your information to the extent necessary to allow them to peorm the services they provide to us.
                                </p>
                                <p>
                                    However, ceain third-pay service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.
                                </p>
                                <p>
                                    For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers.
                                </p>
                                <p>
                                    In paicular, remember that ceain providers may be located in or have facilities that are located in a dierent jurisdiction than either you or us. So if you elect to proceed with a transaction that involves the services of a third-pay service provider, then your information may become subject to the laws of the jurisdiction(s) in which that service provider or its facilities are located.
                                </p>
                                <p>
                                    Once you leave our store’s website or are redirected to a third-pay website or application, you are no longer governed by this Privacy Policy or our website’s Terms of Service.
                                </p>
                                <p>
                                    Links
                                </p>
                                <p>
                                    When you click on the links on our store, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.
                                </p>
                                <h3 className="iris_txt_B">
                SECTION 5 - SECURITY
                </h3>
                                <p>
                                    To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
                                </p>
                                <p>
                                    If you provide us with your credit card information, the information is encrypted using secure socket layer technology (SSL) and stored with a AES-256 encryption. Although no method of transmission over the Internet or electronic storage is 100% secure, we follow all PCI-DSS requirements and implement additional generally accepted industry standards.
                                </p>
                                <h3 className="iris_txt_B">
                SECTION 6 - COOKIES
                </h3>
                                <p>
                                    Here is a list of cookies that we use. We’ve listed them here so you that you can choose if you want to opt-out of cookies or not.
                                </p>
                                <h3 className="iris_txt_B">
                SECTION 7 - AGE OF CONSENT
                </h3>
                                <p>
                                    By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
                                </p>
                                <h3 className="iris_txt_B">
                SECTION 8 - CHANGES TO THIS PRIVACY POLICY
                </h3>
                                <p>
                                    We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarications will take eect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
                                </p>
                                <p>
                                    If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.
                                </p>
                                <h3 className="iris_txt_B">
                QUESTIONS AND CONTACT INFORMATION
                </h3>
                                <p>
                                    If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Ocer at <a href="mailto:info@irisboutiq.com">info@irisboutiq.com</a>
                                </p>
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
        
export default privacyPolicy