window.addEventListener("load", function () {

    const rootUrl = "./";
    getNavigationData();

    function getNavigationData() {
        let url = localStorage.getItem('current_navigation');
        if (url === 'html') {
            document.querySelector('#radio1').checked = true;
        } else if (url === 'css') {
            document.querySelector('#radio2').checked = true;
        } else if (url === 'js') {
            document.querySelector('#radio3').checked = true;
        }

    }

    function getHeaders() {
        var myHeaders = new Headers({
            "Content-Type": "application/json"
        });
        return myHeaders;
    }

    function sendData(requestData) {
        fetch(requestData.url, {
            method: requestData.method,
            headers: getHeaders(),
            body: requestData.body
        })
            .then(function (response) {
                return response.text();
            })
            .then(function (text) {
                console.log('Request successful', text);
                document.querySelector('#textareaHtml').value = text;
            })
            .catch(function (error) {
                console.log('Request failed', error)
            });
    }

    function setRequestData() {
        let toggleSlider = document.querySelector("#toggleSlider");
        let requestData = {};
        let url = '';
        if (toggleSlider.checked) {
            // Beautify
            url += 'beautify';
        } else {
            // Minify
            url += 'minify';
        }
        requestData.url = rootUrl + url + "-" + document.querySelector('input[name="file-type-radio"]:checked').value;
        let body = {
            "text_content": document.querySelector('#textareaHtml').value
        }
        requestData.body = JSON.stringify(body);
        requestData.method = 'post';
        sendData(requestData);
    }

    // Access the form element...
    var form = document.getElementById("userInputForm");

    // ...and take over its submit event.
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        setRequestData();
    });
});

/* window.addEventListener('scroll', function (e) {
    let navbar = document.querySelector(".navbar");
    let scrollOffset = window.scrollY;
    if (scrollOffset >= 500) {
        //navbar.classList.add("navbar-solid");
        navbar.style.opacity = 1;
    } else {
        //navbar.classList.remove("navbar-solid");
        if(scrollOffset >= 0 && scrollOffset < 100)
            navbar.style.opacity = 0.2;
        else if(scrollOffset >= 100 && scrollOffset < 400)
            navbar.style.opacity = 0.5;
        else
            navbar.style.opacity = 0.8;
    }
}); */

function saveNavigationData(url) {
    localStorage.setItem('current_navigation', url);
}

function copyToClipboard(id) {
    var copyText = document.getElementById(id);
    copyText.select();
    document.execCommand("copy");
    showSnackbar('Copied to Clipboard.');
}

function showSnackbar(text) {
    var x = document.getElementById("snackbar");
    x.innerHTML = text;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 2800);
}