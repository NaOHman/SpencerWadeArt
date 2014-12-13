$(document).ready(function() {
    var clickCount = 0;
    var url = 'https://localhost';
    $('#banner').on('click', function(event){
        clickCount += 1;
        if (clickCount === 5)
            location.href = url+ '/admin';
    });
});
