'use strict';

var landingPageUrl, utmMedium, utmSource, utmCampaign, utmContent;

var errors = [];
var valid = false;

$('.result').hide();
$('#result-placeholder').show();

$('#getTaggedURL').click(function() {
    getValues();
    checkValues();
    if (valid) {
        outputTaggedUrl();
    } else {
        outputFeedback();
    }
});

function getValues() {
    landingPageUrl = $('input[name=landingPageUrl]').val();
    utmMedium = $('input[name=utm_medium]:checked').val();

    utmSource = $('input[name=utm_source]:checked').val().toLowerCase();
    if (utmSource === 'other') {
        utmSource = $('#sourceOther').val().toLowerCase();
    }

    utmCampaign = $('input[name=utm_campaign]:checked').val().toLowerCase();
    if (utmCampaign === 'other') {
        utmCampaign = $('#campaignOther').val().toLowerCase();
    }

    utmContent = $('input[name=utm_content]').val().toLowerCase();
}

function checkValues() {
    valid = true;
    errors = [];

    if(!landingPageUrl) {
        valid=false;
        errors.push('Landing page URL is verplicht.');
    }

    if ((landingPageUrl.match(/\?/g)||[]).length > 1) {
        valid = false;
        errors.push('Er staan meerdere ? in de URL, dit is niet toegelaten.');
    }
    
    if (!utmSource) {
        valid=false;
        errors.push('De campagne source is verplicht.');
    }

    var pattern = /^[\w-\.]+$/g;
    if (!pattern.test(utmSource)) {
        valid = false;
        errors.push('Source mag enkel letters, nummers, -, _ en . bevatten. (geen spaties)');
    }    
    
    if (!utmCampaign) {
        valid = false;
        errors.push('De campaign is verplicht.');
    }

    var pattern2 = /^[\w-]+$/g;
    if (utmCampaign) {
        if (!pattern2.test(utmCampaign)) {
            valid = false;
            errors.push('Campaign mag enkel letters, nummers, - en _ bevatten. (geens spaties)');
        }
    }    

    if (utmContent) {
        var pattern3 = /^[\w-\.]+$/g;
        if (!pattern3.test(utmContent)) {
            valid = false;
            errors.push('Content mag enkel letters, nummers, - en _ bevatten. (geen spaties)');
        }
    }    
}

function outputTaggedUrl() {
    var taggedUrl = landingPageUrl;
    
    if (landingPageUrl.indexOf('?') === -1) {
        taggedUrl += '?';
    } else {
        taggedUrl += '&';
    }

    taggedUrl += 'utm_medium=' + utmMedium;
    taggedUrl += '&utm_source=' + utmSource;
    taggedUrl += '&utm_campaign=' + utmCampaign;
    taggedUrl += '&ref=' + utmCampaign;

    if (utmContent) {
        taggedUrl += '&utm_content=' + utmContent;
    }

    $('.result').hide();
    $('#result-success').show();
    $('#result-url').text(taggedUrl);
    $('#result-link').attr('href', taggedUrl);
}

function outputFeedback() {
    var feedback = '<ul>';
    for (var i = 0; i < errors.length; i++) {
        feedback += '<li>' + errors[i] + '</li>';
    }
    feedback += '</ul>';

    $('.result').hide();
    $('#result-error').show();
    $('#result-error').html(feedback);
}

$('#sourceOther').focus(function() {
    $('#sourceOtherRadio').prop('checked', true);
});

$('#campaignOther').focus(function () {
    $('#campaignOtherRadio').prop('checked', true);
});

$('#copyToClipboard').click(function() {
    Clipboard.copy($('.result-url').text());
});


window.Clipboard = (function(window, document, navigator) {
    var textArea,
        copy;

    function isOS() {
        return navigator.userAgent.match(/ipad|iphone/i);
    }

    function createTextArea(text) {
        textArea = document.createElement('textArea');
        textArea.value = text;
        document.body.appendChild(textArea);
    }

    function selectText() {
        var range,
            selection;

        if (isOS()) {
            range = document.createRange();
            range.selectNodeContents(textArea);
            selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            textArea.setSelectionRange(0, 999999);
        } else {
            textArea.select();
        }
    }

    function copyToClipboard() {        
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }

    copy = function(text) {
        createTextArea(text);
        selectText();
        copyToClipboard();
    };

    return {
        copy: copy
    };
})(window, document, navigator);