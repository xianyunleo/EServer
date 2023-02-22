//import OS from "@/main/core/OS";


export default class MainWindow {

    static #instance;
    static forceQuit = false;

    /**
     *
     * @param mainWindow {BrowserWindow}
     */
    static init(mainWindow) {
        MainWindow.#instance = mainWindow;
        mainWindow.on('close', (event) => {
            if(!this.forceQuit){
                event.preventDefault();
                mainWindow.hide();
            }
        })
    }

    /**
     *
     * @returns {BrowserWindow}
     */
    static getInstance() {
        return MainWindow.#instance;
    }

}
