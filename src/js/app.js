import $ from 'jquery';

window.jQuery = $;
window.$ = $;
import browser from 'jquery.browser';
window.$.browser = browser;

import * as labelEffects from '../lib/jquery.labeleffect/jquery.labeleffect.js';
import marquee from 'jquery.marquee';

let App = function () {
    console.log(labelEffects);
    let loadSounds = function () {
        sounds.forEach(function (sound, index) {
            console.log(sound);
            console.log(index);
            buildSound(sound.replace("src", "dist"), index);
        });
    };

    let buildSound = function (sound, index) {
        $('.sound:first').clone().insertAfter('.sound:last').attr('sound-src', sound).attr('data-display', true).attr('id', index).hide().fadeIn();
        $(`#${index}`).click(function () {
            playSound($(this))
        });
    };

    let playSound = function (soundElement) {
        let soundPath = soundElement.attr('sound-src');
        new Audio(soundPath).play();
    };

    let fancyText = function(element){
        $(element).labeleffect({
            effect: 'floating',
            shadowColor: 'blue',
            hiDir: 2
        });
    };

    let fancyUpText = function(){
        $('.marquee span').each(function () {
            fancyText(this);
        })
    };

    let loadMarquee = function () {
        let marqueeWrapper = $('.marquee');
        let text = marqueeWrapper.html();
        let bodyWidth = $('body').width();

        for(let i = 0; i < (bodyWidth/424); i++){
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
        }
    }
}();

jQuery(document).ready(function () {
    App.init();
});

