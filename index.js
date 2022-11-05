var redirect_uri = "http://127.0.0.1:5501/mainPage.html"; 

 

var client_id= "ac4c395f13654db9a9ca2d9035edf3cb"; 
var client_secret= "062cd903bfce4cfdbd87782b18a0d905"; 

var access_token = null;
var refresh_token = null;


const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";

//variables for playlist 
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";
const userTop = "https://api.spotify.com/v1/me/top/tracks";
const recco = "https://api.spotify.com/v1/recommendations";

//vars for playlist itself
var seeds = [];
var oneSeed;
var recommendations = [];

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
            //FUNCTIONS GO HERE
            //have access token, function calls should go here.
            userTopItems();
            getRecommendations();
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
    url += "&scope=user-read-private user-top-read playlist-modify-public";
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

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;

}
//functions 
function userTopItems(){
    // get 3 top tracks for medium_term length for seed
    let body = "limit=3"
    callApi("GET", userTop , body, handleApiResponse)
}

function getRecommendations(){
    //let body= oneSeed;
    console.log(getRecommendations);
    let body = "seedtracks="+seeds[0]+seeds[1]+seeds[2];
    console.log(body);
    callApi("GET", recco, body, handleRecommendations)
}

function createPlaylist(){
    console.log("playlist");
    //let body =
    callApi("POST", PLAYLISTS, null, handleApiResponse);
}
function handleRecommendations(){
    if ( this.status == 200){
        //this is where we should handle our data
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    

}

function handleApiResponse(){
    if ( this.status == 200){
        //this is where we should handle our data
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        console.log("User top three items")
        //parse data and add to string seeds for song seeds
        for(let i =0; i <= 3; i++){
            if(i<2){
                seeds[i] = data.items[i].id+ ",";
            }
            else{
                seeds[i]= data.items[i].id;
            }

        }
        // add the contents of the array to one variable
        oneSeed = seeds[0]+seeds[1]+seeds[2];
        console.log(oneSeed);
        //getRecommendations();
        }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }    
}
function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
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
function send(){
    requestAuthorization();
}



/*// values for seeding
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
}*/
