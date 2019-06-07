var windowWidth = parseInt($(window).width());
var mobile = parseInt($(window).width()) < 768;

HeaderLoad = () => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'header.html', true);
    xhr.onreadystatechange= function() {
        if (this.readyState !== 4) {
            return;
        }
    
        if (this.status !== 200) {
            return;
        }
    
        document.getElementById('to-include').innerHTML= this.responseText;
    };
    
    xhr.send();    
}

$(document).ready(() => {
    HeaderLoad();
});