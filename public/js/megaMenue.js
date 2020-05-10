$('.hideMenue').hover(
    function () {
        $('.megaMenue').slideDown(500);
        $('.megaMenue').css({"display":"flex"});
    },
    function () {
        $('.megaMenue').slideUp(500);

    });