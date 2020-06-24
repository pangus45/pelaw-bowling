// after appending, you probs have to reparse html with $('svg').html($('svg').html());

function polyAppend(pParent, pPoints) {

    var d = 'M';

    d += pPoints[0][0] + ' ';

    d += pPoints[0][1] + ' ';

    $.each(pPoints, function (pIndex, pPoint) {

        d += 'L' + pPoint[0] + ' ' + pPoint[1];
    });

    var path = $('<path>').appendTo(pParent)
        .attr('d', d);

    return path;
}

function lineAppend(pParent, pPointA, pPointB) {

    var line = $('<line>').appendTo(pParent)
        .attr('x1', pPointA[0])
        .attr('y1', pPointA[1])
        .attr('x2', pPointB[0])
        .attr('y2', pPointB[1]);

    return line;
}

function tagAppend(pParent, pX, pY, pWidth, pPointWidth, pHeight) {

    var rectRightX = pX + pWidth;
    var pointRightX = pX + pWidth + pPointWidth;
    var bottomY = pY + pHeight;
    var pointY = pY + (pHeight / 2);

    return polyAppend(pParent, [[pX, pY], [rectRightX, pY], [pointRightX, pointY], [rectRightX, bottomY], [pX, bottomY], [pX, pY]]);
}