import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import {PostData} from '../service/postData';
import { toast } from "react-toastify";
//import {Redirect} from 'react-router-dom';
import {userCartManage} from '../_commonFunction/userIrisCart';
import {userSessionManage} from '../_commonFunction/userIrisSession';

let irisBackUrl = localStorage.getItem('irisBackUrl');

let _nxtUrlTOGO = '';
export default class Facebook extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoggedin:false,
            userId:'',
            name:'',
            email:'',
            socialId:'',
            redirect:false,
        }
    }

    componentDidMount() {        
        document.addEventListener('FBObjectReady', this.FacebookLogin);
    }
    
    componentWillUnmount() {
        document.removeEventListener('FBObjectReady', this.FacebookLogin);
    }

    responseFacebook = response =>
    {        
        if(response.id)
        {            
            const requestData = JSON.stringify({
                socialId: response.id,
                name: response.name,
                email: response.email
            });
            
            PostData(global.userSigninViaSocail, requestData,'POST').then((result) => {
                if(result)
                {
                    if(result.success === true)
                    {
                        toast.success(result.message);                        
                        
                        userSessionManage(localStorage,result.response[0],'startSession');
                        let _result = userCartManage(localStorage,PostData,sessionStorage,'FirstTimeImport');
                        if(_result === '-->Gotoo')
                        {
                            let _resultt = userCartManage(localStorage,PostData,sessionStorage,'Export');
                            if(_result === '-->Gotoo')
                            {
                                if(this.props.nxtUrl === undefined || this.props.nxtUrl === null)
                                {
                                    _nxtUrlTOGO = irisBackUrl;
                                }
                                else
                                {
                                    _nxtUrlTOGO = this.props.baseUrl+this.props.nxtUrl+'?guestUser=0991574836'+result.response[0].user_Id
                                }
                                setTimeout(
                                    () => {
                                        this.setState({redirect: true});
                                    }, 
                                    Math.floor(Math.random() * 1000) + 1
                                )                                
                            }
                        }
                        
                    }
                    else
                    {
                        toast.error(result.message);
                    }                
                    return;                     
                }
            });
        }
        else
        {
            //toast.error('Due to some technical issue Facbook Sign-In not working. Please try another login process.');
        }
    }
    
    handleError = (error) => {
        //sconsole.log(error);
    }

    render() {
        let faceBookID = global.FACEBOOK_APPID;
        let fbContent;

        if (this.state.redirect && localStorage.getItem('irisUserSession')) {            
            window.location.href = _nxtUrlTOGO;
        }

        if(this.state.isLoggedin){
            fbContent = null;
        }
        else
        {
            fbContent = (<FacebookLogin
                autoLoad={false}
                appId={faceBookID} //APP ID NOT CREATED YET
                fields="name,email,picture"
                callback={this.responseFacebook}
                onError={this.handleError}
                cssClass="btnFacebook"
                icon={<i className="fab fa-facebook-square"></i>}
                textButton = "&nbsp;&nbsp;Sign In with Facebook" 
            />);
        }

        return (
        <div>
            {fbContent}
        </div>
        )
    }
}
