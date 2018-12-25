//-----------product.html
let spisok = $('.firstNav > li');
//console.log(spisok);
//spisok.addEventListener('click', navVisible);
for (let i = 0; i < spisok.length; i++) {
    $(spisok[i]).click(function () {

        if ($(spisok[i]).attr("class") == "activeNav") {
            $(spisok[i]).removeClass("activeNav");
            $(spisok[i]).find('i').attr("class","fas fa-caret-down");
        } else {
            $(spisok[i]).addClass("activeNav");
            $(spisok[i]).find('i').attr("class","fas fa-caret-up");
        }

        
    })

}
