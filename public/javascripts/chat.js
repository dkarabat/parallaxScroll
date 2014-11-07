$(document).ready(function () {
    var socket = io.connect('http://localhost:3000');
    var name = 'Гость_' + (Math.round(Math.random() * 100));
    var messages = $("#messages");
    var message_txt = $("#message_text")
    $('.chat .nick').text(name);

    function msg(nick, message) {
        var m = '<div class="msg">' +
            '<span class="user">' + safe(nick) + ':</span> '
            + safe(message) +
            '</div>';
        messages
            .append(m)
            .scrollTop(messages[0].scrollHeight);
    }

    function msg_system(message) {
        var m = '<div class="msg system">' + safe(message) + '</div>';
        messages
            .append(m)
            .scrollTop(messages[0].scrollHeight);
    }

    socket.on('connecting', function () {
        msg_system('Соединение...');
    });

    socket.on('connect', function () {
        msg_system('Соединение установленно!');
    });

    ion.sound({
        sounds: [
            {name: "beer_can_opening"},
            {name: "bell_ring"}
        ],
        path: "sounds/",
        preload: true,
        volume: 1.0
    });
    

    socket.on('message', function (data) {

        ion.sound.play("bell_ring");
        msg(data.name, data.message);
        message_txt.focus();
    });

    $("#message_text").keypress(function (e) {
        var text = $("#message_text").val();
        if (e.which == 13) {
            if (text.length <= 0)
                return;
            message_txt.val("");
            socket.emit("message", {message: text, name: name});
            return false;    //<---- Add this line
        }
    });
    $("#message_btn").click(function () {
        var text = $("#message_text").val();
        if (text.length <= 0)
            return;
        message_txt.val("");
        socket.emit("message", {message: text, name: name});
    });

    function safe(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
});