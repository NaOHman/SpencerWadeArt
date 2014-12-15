function newSection(n){
   var html = '<div id="' + n + '" class="section"><div class="input-group"><input name="heading' + n + '" class="form-control" required><div class="input-group-btn"><button type="button" title="Remove section" class="remove-btn btn btn-default"><span class="glyphicon glyphicon-remove"></span></button></div></div><textarea rows="7" name="text' +n+ '" class="form-control" required></textarea></div>';
   return html;
}

function removeListener(event){
    event.preventDefault();
    if (sections == 0) {
        alert("Can't remove all of the sections");
    } else {
        var par = $(this).parents().eq(2);
        var removed = +par.attr("id");
        var i;
        par.remove();
        for(i = removed; i<sections; i++){
            old = i + 1
            $('[name="heading'+old+'"]').attr('name', 'heading'+i);
            $('[name="text'+old+'"]').attr('name', 'text'+i);
            $('#'+old).attr('id', i);
        }
        sections -= 1;
    }
}

$(document).ready(function() {
    sections = +sections
    var url = 'https://localhost';
    $('.remove-btn').on('click', removeListener);
    $('#add-btn').on('click', function(event){
        event.preventDefault();
        sections += 1;
        $("#sections").append(newSection(sections));
        $("#" + sections + " .remove-btn").on('click', removeListener);
    })
});
