var ALBUM_ANIM_TIME = 0.5;

$(document).ready(function () {

    accordionInit();
});


function accordionInit() {

    albumOpen($('.mobileLayout .albumPhotos').eq(0));
    albumOpen($('.desktopLayout .albumPhotos').eq(0));

    $('.albumTitle').click(function(){

        var clickedTitle = this;

        $('.albumTitle').each(function(){

            var title = $(this);
            var album = title.next();

            if(clickedTitle == this){

                if(album.data('open')){
                    albumClose(album);
                }
                else{
                    albumOpen(album);
                }
            }
            else{

                // albumClose(album);
            }
        });
    });
}

function albumOpen(pAlbum){

    if(pAlbum.data('open')){
        return;
    }

    var title = pAlbum.prev();

    var plusMinus = title.find('.plusMinus');

    plusMinus.removeClass('fa-plus');
    plusMinus.addClass('fa-minus');

    l('opening');

    pAlbum.css('height', 'auto');

    // var height = pAlbum.height();

    TweenMax.from(pAlbum, ALBUM_ANIM_TIME, {height:0 });

    pAlbum.data('open', true);
}


function albumClose(pAlbum){

    if(!pAlbum.data('open')){
        return;
    }

    var title = pAlbum.prev();

    var plusMinus = title.find('.plusMinus');

    plusMinus.removeClass('fa-minus');
    plusMinus.addClass('fa-plus');

    TweenMax.to(pAlbum, ALBUM_ANIM_TIME, {height:0});

    l('closing');

    pAlbum.data('open', false);
}