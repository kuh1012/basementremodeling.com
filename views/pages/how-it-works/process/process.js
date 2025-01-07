export const processSteps = () => {

    const processList = [...document.querySelectorAll(`.processList .processItem`)];
    processList.forEach((process, index) => {
        const nextProcess = process.nextElementSibling;
        if(nextProcess != null){
            const timeout = 500 * (index+1);
            setTimeout(() => {
                nextProcess.classList.remove(`processHidden`);
                nextProcess.classList.remove(`hidden`);
                nextProcess.classList.add(`animate__animated`);
                nextProcess.classList.add(`animate__fadeInDown`);
            },timeout)
        }
        // const processButton = process.querySelector(`.activeProcessButton`);
        // if (!processButton) return false;
        // processButton.forEach(b => {
            
        // })
        // processButton.addEventListener(`click`, () => {
        //     const nextProcess = process.nextElementSibling;
        //     nextProcess.classList.remove(`processHidden`);
        //     processButton.classList.replace(`activeProcessButton`, `processButton`);
        // });
    });

};