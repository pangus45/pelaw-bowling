function v(pVariableName, pVariable){
    l(pVariableName + ': ' + pVariable);
}

function l(pString){
    console.log(pString);
}

function a(pAssertion){

    console.assert(pAssertion);
}

// loadedAtReadyCount = 0;
// loadedLaterCount = 0;
//
// $(document).ready(function(){
//
//     $('img').each(function(pIndex, pElement){
//
//         var imageSelector = $(pElement);
//
//         if(pElement.complete){
//             loadedAtReadyCount++;
//             imageCountShow();
//             l(imageSelector.attr('data-desktop-src'));
//         }
//         else{
//
//             imageSelector.load(function(){
//                 loadedLaterCount++;
//                 imageCountShow();
//                 l(imageSelector.attr('src'));
//             });
//         }
//     });
// });
//
// function imageCountShow(){
//
//     $('#debug').empty();
//
//     var div1 = $('<div>').appendTo('#debug');
//     var div2 = $('<div>').appendTo('#debug');
//     var div3 = $('<div>').appendTo('#debug');
//
//     div1.text('Ready: ' + loadedAtReadyCount);
//     div2.text('Later: ' + loadedLaterCount);
//     div3.text('Total: ' + (loadedAtReadyCount + loadedLaterCount));
// }
//
