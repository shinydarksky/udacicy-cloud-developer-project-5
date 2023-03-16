function setToken(token){
    return window.localStorage.setItem("accessToken",JSON.stringify(token))
}

function getToken(){
    return JSON.parse(window?.localStorage.getItem("accessToken"))
}

function removeToken(){
    return window?.localStorage.removeItem("accessToken")
}

export {
    setToken,
    getToken,
    removeToken
}