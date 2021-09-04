import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
//import {browserHistory} from "react-router";
import {PostData} from '../service/postData';
import { toast } from "react-toastify";
import {userCartManage} from '../_commonFunction/userIrisCart';
import {userSessionManage} from '../_commonFunction/userIrisSession';

let irisBackUrl = localStorage.getItem('irisBackUrl');
let _nxtUrlTOGO = '';

export default class GooglePlus extends Component {
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

    responseGooglePlus = response => {
        //console.log('Njjjjjjj');
        //console.log(response);
        if(!response.error)
        {
            const requestData = JSON.stringify({
                socialId: response.profileObj.googleId,
                name: response.profileObj.name,
                email: response.profileObj.email
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
                                        window.location.href = _nxtUrlTOGO;
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
            //toast.error('Due to some technical issue Google Sign-In not working. Please try another login process.');
        }
    }
    componentClick = () => console.log('Clicked Google Plus');
    render() {
        let googlePlusID = global.GOOGLE_APPID;
        let gpContent;
        
        if(this.state.isLoggedin){
          gpContent = null;
        }
        else
        {
          gpContent = (
          <GoogleLogin
            clientId={googlePlusID}
            onSuccess={this.responseGooglePlus}
            onFailure={this.responseGooglePlus}
            cookiePolicy={'single_host_origin'}
            className="btnGoogle"
          >
            <i className="fab fa-google-plus-g"></i> 
            <span>&nbsp;&nbsp;Sign In with Google</span>                                                               
            </GoogleLogin>
          );
        }

        return (
        <div>
            {gpContent}
        </div>
        )
    }
}
