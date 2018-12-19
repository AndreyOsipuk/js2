var images = [];
var feturedImg = $('.feturedImg');

for (var i = 1; i <= feturedImg.length; i++) {
    images[i - 1] = 'img/feturedItems' + i + '.jpg';
}

for (var i = 0; i < feturedImg.length; i++) {
    feturedImg[i].setAttribute('style', 'background: url(' + images[i] + ')');
}

document.querySelector('.tabs-body').addEventListener('click', fTabs);

function fTabs(event) {
    if (event.target.className == 'textBut tab-h') {
        var dataTab = event.target.getAttribute('data-tab');
        var tabBody = document.getElementsByClassName('tab-b');
        var tabH2 = document.getElementsByClassName('tab-h2');
        var tabH3 = document.getElementsByClassName('tab-h3');
        for (var i = 0; i < tabBody.length; i++) {
            if (dataTab == i) {
                var j = i;
                tabBody[i].style.display = 'block';
                tabH2[i].style.display = 'block';
                tabH3[i].style.display = 'block';
                j++;
                document.getElementById('MyImage').src = 'img/main7-' + j + '.png';
            } else {
                tabBody[i].style.display = 'none';
                tabH2[i].style.display = 'none';
                tabH3[i].style.display = 'none';
            }
        }

    }
}
