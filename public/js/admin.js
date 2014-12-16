$(document).ready(function() {
    var url = 'https://localhost';
    $('.remove-btn').on('click', function(event){
        event.preventDefault();
        var id = $(this).attr('data-id').replace(/"/g,'');
        var query = url + '/remove';
        var imgsrc = $(this).attr('data-src')
        $.ajax({
            url: query,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({myId: id,
                                  imgPath: imgsrc}),
            success: function(data){
                location.reload(true);
            },
            error: function(xhr, status, errorThrown){
                alert("There was a problem deleting the artwork");
            }
        });
    });
    $('.save-btn').on('click', function(event){
        event.preventDefault();
        var query = url + '/save';
        var data = {};
        $(this).parents().eq(2).serializeArray().map(function(x){data[x.name] = x.value;}); 
        $.ajax({
            url : query,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
        })
    });
});
