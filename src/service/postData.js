export function PostData(BaseURL, userData,type)
{
    if(type === 'GET')
    {
        return new Promise((resolve, reject) =>{
            fetch(BaseURL, {
                method: type,
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},            
            })
        .then((response) => response.json())
        .then((res) => {
                resolve(res);
            })
        .catch((error) => {
                reject(error);
            });
        });        
    }
    else if(type === 'POST')
    {
        return new Promise((resolve, reject) =>{
            fetch(BaseURL, {
                method: type,
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: (userData)
            })
        .then((response) => response.json())
        .then((res) => {
                resolve(res);
            })
        .catch((error) => {
                reject(error);
            });
        });
    }
    else
    {
        return new Promise((resolve, reject) =>{
            fetch(BaseURL, {
                method: type,
                headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
                body: (userData)
            })
        .then((response) => response.json())
        .then((res) => {
                resolve(res);
            })
        .catch((error) => {
                reject(error);
            });
        });
    }
}