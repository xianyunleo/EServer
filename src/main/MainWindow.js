export default class MainWindow {

    static #instance;

    /**
     *
     * @param mainWindow {BrowserWindow}
     */
    static init(mainWindow) {
        MainWindow.#instance = mainWindow;
        mainWindow.on('close', (event) => {
            event.preventDefault();
            mainWindow.minimize();
            mainWindow.setSkipTaskbar(true);
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
