$(document).ready(function() {
    var url = 'http://localhost:8080';
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
    /*
    $('.update-art').submit(function(event){
        event.preventDefault();
        var id = $(this).attr('data-id').replace(/"/g,'');
        var query = url + '/save/' + id;
        alert("Put to " + query);
        $.ajax({
            url: query,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({myId: id}),
            success: function(data){
                location.reload(true);
                alert(data);
            },
            error: function(xhr, status, errorThrown){
                alert("Problem updating artwork");
            }
        });
    });
        */
});
