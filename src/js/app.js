import $ from 'jquery';

window.jQuery = $;
window.$ = $;
import browser from 'jquery.browser';

window.$.browser = browser;

import marquee from 'jquery.marquee';

(function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    if (window.AudioContext) {
        window.audioContext = new window.AudioContext();
    }
    var fixAudioContext = function (e) {
        if (window.audioContext) {
            // Create empty buffer
            var buffer = window.audioContext.createBuffer(1, 1, 22050);
            var source = window.audioContext.createBufferSource();
            source.buffer = buffer;
            // Connect to output (speakers)
            source.connect(window.audioContext.destination);
            // Play sound
            if (source.start) {
                source.start(0);
            } else if (source.play) {
                source.play(0);
            } else if (source.noteOn) {
                source.noteOn(0);
            }
        }
        // Remove events
        document.removeEventListener('touchstart', fixAudioContext);
        document.removeEventListener('touchend', fixAudioContext);
    };
    // iOS 6-8
    document.addEventListener('touchstart', fixAudioContext);
    // iOS 9
    document.addEventListener('touchend', fixAudioContext);
})();

let App = function () {
    let audioBuffers = {};
    let isPlayingAudio = false;

    let loadSounds = function () {
        sounds.forEach(function (sound, index) {
            console.log(sound);
            console.log(index);
            buildSound(sound.replace("src", "dist"), index);
        });
    };


    let buildSound = function (sound, index) {
        let soundElement = $('.sound:first').clone().insertAfter('.sound:last');
        soundElement.attr('sound-src', sound).attr('data-display', true).attr('id', index);
        soundElement.find('.sound-name').text(sound.split("/").pop().split(".").shift().replace(/[-]|[_]/gi, " "));
        soundElement.hide().fadeIn();

        $(`#${index}`).click(function () {
            let context = window.audioContext;
            playSound(index, context, sound);
            context.resume();
        });
    };

    let playSound = function (id, audioContext, soundPath = null) {
            if (audioBuffers[id]) {
                console.log("called");
                let source = audioContext.createBufferSource();
                source.buffer = audioBuffers[id];
                source.connect(audioContext.destination);
                isPlayingAudio = true;
                source.start(0);
                source.onended = function() {
                    isPlayingAudio = false;
                    source.disconnect();
                }
            } else if(soundPath) {
                let request = new XMLHttpRequest();
                request.open('GET', soundPath, true);
                request.responseType = 'arraybuffer';
                request.onload = function () {
                    audioContext.decodeAudioData(request.response, function (buffer) {
                        audioBuffers[id] = buffer;
                        playSound(id, audioContext);
                    })
                };
                request.send();
            }
    };

    let fancyText = function (element) {
        $(element).labeleffect({
            effect: 'floating',
            shadowColor: 'blue',
        });
    };

    let fancyUpText = function () {
        $('.marquee span').each(function () {
            fancyText(this);
        })
    };

    let loadMarquee = function () {
        let marqueeWrapper = $('.marquee');
        let text = marqueeWrapper.html();
        let bodyWidth = $('body').width();

        for (let i = 0; i < (bodyWidth / 424); i++) {
            marqueeWrapper.append(text);
        }

        fancyUpText();
        marqueeWrapper.marquee({
            duration: 12000,
            gap: 10,
            delayBeforeStart: 0,
            direction: 'left',
            startVisible: true,
            duplicated: true
        });
    };

    return {
        init: function () {
            loadSounds();
            loadMarquee();
            return this;
        },
        playSound: function (soundElement) {
            playSound(soundElement);
        }
    }
}();

jQuery(document).ready(function () {
    App.init();
});

