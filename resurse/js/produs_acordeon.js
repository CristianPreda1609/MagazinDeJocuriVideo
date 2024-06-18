document.addEventListener('DOMContentLoaded', function() {
    function saveAccordionState() {
        let accordionState = {};
        document.querySelectorAll('.collapse').forEach((element, index) => {
            accordionState[index] = element.classList.contains('show');
        });
        localStorage.setItem('accordionState', JSON.stringify(accordionState));
    }

    function restoreAccordionState() {
        let accordionState = JSON.parse(localStorage.getItem('accordionState'));
        if (accordionState) {
            document.querySelectorAll('.collapse').forEach((element, index) => {
                if (accordionState[index]) {
                    element.classList.add('show');
                } else {
                    element.classList.remove('show');
                }
            });
        }
    }

    restoreAccordionState();

    document.querySelectorAll('.collapse').forEach(element => {
        element.addEventListener('shown.bs.collapse', saveAccordionState);
        element.addEventListener('hidden.bs.collapse', saveAccordionState);
    });
});