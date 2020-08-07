$(document).ready(function () {

    accordionInit();
});


function accordionInit() {

    $('.albumPhotos').eq(0).data('open', true);

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

                albumClose(album);
            }
        });
    });
}

var ALBUM_ANIM_TIME = 0.3;

function albumOpen(pAlbum){

    if(pAlbum.data('open')){
        return;
    }

    l('opening');

    pAlbum.css('height', 'auto');

    // var height = pAlbum.height();

    TweenMax.from(pAlbum, ALBUM_ANIM_TIME, {height:0});

    pAlbum.data('open', true);
}


function albumClose(pAlbum){

    if(!pAlbum.data('open')){
        return;
    }

    TweenMax.to(pAlbum, ALBUM_ANIM_TIME, {height:0});

    l('closing');

    pAlbum.data('open', false);
}