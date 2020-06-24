// $(document).ready(function () {
//
//     waveyMorphsInit();
//
//     // findShapeIndex($('#e_yellowBackground'), $('#e_yellowBackground-2'));
// });
//
//
// function waveyMorphsInit() {
//
//     var paths = $('[data-row-name="yellow"] svg path.from');
//
//     paths.each(function () {
//
//         waveyPathMorphInit($(this));
//     });
// }
//
//
// function waveyPathMorphInit(pPath) {
//
//     var id = pPath.attr('id');
//
//     var target = '#' + id + '-2';
//
//     l(id +',' + target);
//
//     gsap.to(pPath, 10, {morphSVG: {shape: target, shapeIndex: 1, repeat:-1, yoyo: true}});
// }