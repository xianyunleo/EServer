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
            if (!this.forceQuit) {
                event.preventDefault();
                if (mainWindow.isFullScreen()) {
                    mainWindow.once('leave-full-screen', () => mainWindow.hide())

                    mainWindow.setFullScreen(false)
                } else {
                    mainWindow.hide()
                }
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
