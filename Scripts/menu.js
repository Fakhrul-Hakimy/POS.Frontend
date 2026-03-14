
function showForms(formId) {
    $('.Mode > div').addClass('d-none');      // only direct children
    $(`.${formId}`).removeClass('d-none');
}



