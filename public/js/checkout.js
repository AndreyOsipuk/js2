function include(url) {
        var script = document.createElement('script');
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
    }
include('js/browse.js');
include('js/megaMenue.js');

//menu
let checkout = $('.checkout');
for (let i = 0; i < checkout.length; i++) {
    $(checkout[i]).click(function () {

        if ($(checkout[i]).attr("class") == "checkout activeCheck") {
            $(checkout[i]).next(".checkoutHide").slideUp(500);
            $(checkout[i]).removeClass("activeCheck");
            $(checkout[i]).css("border-bottom","1px solid #e8e8e8");
        } else {
            $(checkout[i]).addClass("activeCheck");
            $(checkout[i]).css("border-bottom","none");
            $(checkout[i]).next(".checkoutHide").slideDown(500);
        }
    })
}
