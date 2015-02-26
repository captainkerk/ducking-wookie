function getRecent() {
    var users = [];
    $('#recent-urls').html('');

    request=$.get( '/recent', function( data ) {
        for(i = 0; i < 10; i++) {
            var url = new Object();
            url.key = data.urls[i].key;
            url.value = data.urls[i].value;
            $('#recent-urls').append('<li><h3>http://shorten.kerkstra.me/a/' + url.key + '</h3><br> <p>Which resolves to: ' + url.value + '</p>');
        }



    });


    request.error(function(jqXHR, textStatus, errorThrow){
    });

}
