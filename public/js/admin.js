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
    $('.save-btn').on('click', function(event){
        var id = $(this).attr('data-id').replace(/"/g,'');
        var query = url + '/save/' + id;
        alert(query);
        $.ajax({
            url: '/save',
            type: 'PUT',
            contentType: 'application/json',
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
});
