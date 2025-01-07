export const changeModalVisible = (modalNode, modalClassAction) => {
    return () => {
        const isModalActive = modalNode.classList.contains(`activeModal`);
        if (!modalClassAction){
            modalClassAction = (isModalActive) ? `remove` : `add`; 
        }
        modalNode.classList[modalClassAction](`activeModal`);
        if (modalClassAction === `add` && !isModalActive) {
            var offset = window.pageYOffset;
            document.body.classList.add(`body-no-scroll`);
            document.body.style.top = `-${offset}px`;
            // Hide jivochat
            [...document.getElementsByTagName('jdiv')].forEach(el => el.style.display = 'none');
            return;
        } 
        if (modalClassAction === `remove` && isModalActive) {
            document.body.classList.remove(`body-no-scroll`);
            var offset = parseInt(document.body.style.top, 10);
            document.body.style['scroll-behavior'] = 'auto';
            document.body.style.top = '';
            window.scroll( 0, -1*offset);
            // Show jivochat back
            [...document.getElementsByTagName('jdiv')].forEach(el => el.style.display = '');
            return;
        }
    }
};

export const setModal = (modalName) => {
    const modalNode = document.querySelector(`[data-modal="${modalName}"]`);
    const closeButton = modalNode.querySelector(`.closeButton`);
    const otherCloseButton = modalNode.querySelector('.close-trigger');
    const blurWrapper = modalNode.querySelector(`.modalBlurWrapper`);
    const closeButtons = [otherCloseButton, closeButton];
    closeButtons.forEach(b => {
        if(b)
            b.addEventListener(`click`, changeModalVisible(modalNode))
    })
    blurWrapper.addEventListener(`click`, changeModalVisible(modalNode));
    return modalNode;
};

