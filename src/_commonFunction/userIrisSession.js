export function userSessionManage(localStorage,result,_key)
{    
    if(_key == 'startSession')
    {
        localStorage.removeItem('irisUserSession');
        var obj = {};
        obj.smallName = capitalizeFirstLetter(result.user_FirstName);
        obj.user_Id = result.user_Id;
        obj.user_Id = result.user_Id;
        obj.country_Id = result.country_Id;
        obj.isActive = result.isActive;
        obj.social_Id = result.social_Id;
        obj.email = result.user_Email;
        obj.firstName = result.user_FirstName;
        obj.lastName = result.user_LastName;
        obj.image = result.user_Image;
        obj.phone = result.user_Phone;
        obj.userVia = result.user_via;
        obj.userISD = result.user_ISDCode;
        obj.referal_discount = result.referal_discount;
        localStorage.setItem('irisUserSession', JSON.stringify(obj));
        setLocalSessionExpire('Local', '5');
    }    
}

function capitalizeFirstLetter(string)
{
    var str = string;
    var arr = str.split(' ');
    var _caps = '';
    for(var _i = 0;_i< arr.length;_i++)
    {
        var keyys = arr[_i].charAt(0).toUpperCase();
        _caps += keyys;
    }
    return _caps;
}

function setLocalSessionExpire(key,expires)
{
    var hours = 1; // Reset when storage is more than 24hours
    var now = new Date().getTime();
    var setupTime = localStorage.getItem(key + '_expiresIn');
    if (setupTime == null) {
        localStorage.setItem(key + '_expiresIn', now)
    }
    else
    {
        if(now-setupTime > hours*60*60*1000)
        { 
            console.log('Expire LOcal Storage');          
            //localStorage.setItem(key + '_expiresIn', now);
        }
    }
}