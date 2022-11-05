var redirect_uri = "http://127.0.0.1:5500/mainPage.html"; // change this your value, this is mine in VScode

 

var client_id= "ac4c395f13654db9a9ca2d9035edf3cb"; 
var client_secret= "062cd903bfce4cfdbd87782b18a0d905"; 

var access_token = null;
var refresh_token = null;


const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";

//variables for playlist 
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";



function onPageLoad(){
    client_id = localStorage.getItem("client_id");
    client_secret = localStorage.getItem("client_secret");

    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
    else{
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
            refreshAccessToken(); 
        }
        else {
            top10();
        }
    }
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); // remove param from url
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

function requestAuthorization(){
    localStorage.setItem("client_id", client_id);
    localStorage.setItem("client_secret", client_secret); 

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-top-read user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private playlist-modify-public";
    window.location.href = url; // Show Spotify's authorization screen
}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}
function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);


        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}


// find songs based on seed values from quiz, we need to write it underneath the if condition

function handleApiResponse(){
    if ( this.status == 200){
        console.log(this.responseText);
        var data = JSON.parse(this.responseText)
        }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}
// values for seeding
var mode; 
var travel;
var shoe;

// Assign variables the values of what is clicked. 
function showValueM(val){
    mode = val;
    console.log(mode);
}
function showValueT(val){
    travel = val;
    console.log(travel);
}
//making sure the values get assigned right lol need this function to apply to all
function showValueS(val){
    shoe = val;
    console.log(shoe);
}
