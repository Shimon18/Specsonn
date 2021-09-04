export function chkExpireStorage(key, expires,todo) {

    if(todo == 'chkExpire')
    {
        var hours = 1; // Reset when storage is more than 24hours
        var now = new Date().getTime();
        var setupTime = localStorage.getItem(key + '_expiresIn');
        console.log('check local storage Every load');
        if (setupTime == null) {
            //localStorage.setItem(key + '_expiresIn', now)
            console.log('Not set expires yet');
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
}
