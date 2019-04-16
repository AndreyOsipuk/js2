// browse стрелка при hover и выпадающий список
$('.browse').hover(
    function () {
        $('.dropDown').slideDown(500);
        $('.browse').find('i').attr("class", "fas fa-caret-up")
    },
    function () {
        $('.dropDown').slideUp(500);
        $('.browse').find('i').attr("class", "fas fa-caret-down")
    });


$('.headerCart').hover(
    function () {
        $('.cartHide').slideDown(500);
        $('.cartHide').css("display","flex");
    },
    function () {
        $('.cartHide').slideUp(500);
    });