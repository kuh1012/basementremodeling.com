import { changeModalVisible, setModal } from "../modals";

export const weCanHelpModal = () => {
    console.log("We can help")
    const mainModalNode = setModal(`we-can-help`);
    const contactUs = setModal(`contact-us-new`);
    const getQuote = setModal(`get-online-quote`);
    const book = setModal(`book`);

    let weCanHelpTrigger = [...document.querySelectorAll(`.we-can-help-trigger`)];
    let contactButton = [...document.querySelectorAll(`.contact-us-trigger`)];
    let quoteButton = [...document.querySelectorAll(`.quote-trigger`)];
    let bookTrigger = [...document.querySelectorAll(`.book-trigger`)];

    weCanHelpTrigger.forEach(t => {
        t.addEventListener(`click`, () => {
            changeModalVisible(contactUs, 'remove')(); 
            changeModalVisible(getQuote, 'remove')(); 
            changeModalVisible(book, 'remove')(); 
            changeModalVisible(mainModalNode)();
        })
    })

    contactButton.forEach(b => {
        b.addEventListener(`click`, () => { 
            changeModalVisible(mainModalNode, 'remove')();
            changeModalVisible(contactUs)(); 
        });
    })

    quoteButton.forEach(b => {
        b.addEventListener(`click`, () => { 
            changeModalVisible(mainModalNode, 'remove')();
            changeModalVisible(getQuote)(); 
        });
    })

    bookTrigger.forEach(b => {
        b.addEventListener(`click`, () => { 
            changeModalVisible(mainModalNode, 'remove')();
            changeModalVisible(book)(); 
        });
    })

    const searchParameters = new URLSearchParams(location.search.replace('/',''));
    switch(searchParameters.get('open')){
        case 'quote':
            quoteButton[0].click();
            break;
        case 'contact':
            contactButton[0].click()
            break;
        case 'book':
            bookTrigger[0].click()
            break;     
    }
};

