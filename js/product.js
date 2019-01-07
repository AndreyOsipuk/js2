//Анимация списка
let spisok = $('.firstNav > li');
for (let i = 0; i < spisok.length; i++) {
    $(spisok[i]).click(function () {

        if ($(spisok[i]).attr("class") == "activeNav") {
            $('.activeNav + ul').slideUp(500);
            $(spisok[i]).removeClass("activeNav");
            $(spisok[i]).find('i').attr("class", "fas fa-caret-down");
        } else {
            $(spisok[i]).addClass("activeNav");
            $('.activeNav + ul').slideDown(500);
            $(spisok[i]).find('i').attr("class", "fas fa-caret-up");
        }
    })
}
// browse стрелка при hover
$('.browse').hover(
    function () {
        $('.browse').find('i').attr("class", "fas fa-caret-up")
    },
    function () {
        $('.browse').find('i').attr("class", "fas fa-caret-down")
    });
//кнопки типа тканей
let typeTrend = $('.trendingNow div p');
for (let i = 0; i < typeTrend.length; i++) {
    $(typeTrend[i]).click(function () {
        if ($(typeTrend[i]).attr("class") == "activeTrend") {
            $(typeTrend[i]).removeClass("activeTrend");
        } else {
            $(typeTrend[i]).addClass("activeTrend");
        }
    })
}
// input с двумя ползунками
$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [75, 300],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + "                                                                                 $" + ui.values[1]);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        "                                                                                 $" + $("#slider-range").slider("values", 1));
});
//цитаты слайдер
$('.tabs-body')[0].addEventListener('click', fTabs);

function fTabs(event) {
    if (event.target.className == 'textBut tab-h') {
        var dataTab = event.target.getAttribute('data-tab');
        var tabBody = $('.tab-b');
        var tabH2 = $('.tab-h2');
        var tabH3 = $('.tab-h3');
        for (var i = 0; i < tabBody.length; i++) {
            if (dataTab == i) {
                var j = i;
                tabBody[i].style.display = 'block';
                tabH2[i].style.display = 'block';
                tabH3[i].style.display = 'block';
                j++;
                $('#MyImage').attr('src', 'img/main7-' + j + '.png');
            } else {
                tabBody[i].style.display = 'none';
                tabH2[i].style.display = 'none';
                tabH3[i].style.display = 'none';
            }
        }
    }
}
