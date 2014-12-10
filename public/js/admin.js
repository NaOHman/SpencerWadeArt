$(document).ready(function() {
    var url = 'localhost:8080';
    $('.remove-btn').on('click', function(event){
        var id = $(this).attr('data-id').replace(/"/g,'');
        var query = url + '/remove';
        alert(query)
        $.ajax({
            url: query,
            type: 'PUT',
            contentTyspe: 'application/json',
            dataType: 'json',
            data: JSON.stringify({id: id}),
            success: function(data){
                location.reload(true);
                alert(data);
            },
            error: function(xhr, status, errorThrown){
                alert("Problem deleting artwork");
            }
        });
    });
    $('.update-art').submit(function(event){
        event.preventDefault();
        var id = $(this).attr('data-id').replace(/"/g,'');
        var query = url + '/save/' + id;
        alert("Put to " + query);
        $.ajax({
            url: query,
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({id: id}),
            success: function(data){
                location.reload(true);
                alert(data);
            },
            error: function(xhr, status, errorThrown){
                alert("Problem updating artwork");
            }
        });
    });
});
