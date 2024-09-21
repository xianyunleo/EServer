export default class MainWindow {

    static _instance;
    static forceQuit = false;

    static getInstance(){
        return this._instance
    }

    /**
     *
     * @param mainWindow {BrowserWindow}
     */
    static init(mainWindow) {
        if (this._instance) return
        this._instance = mainWindow
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

        mainWindow.on('maximize', () => {
            mainWindow.webContents.send('mainWindowMaximize')
        })

        mainWindow.on('unmaximize', () => {
            mainWindow.webContents.send('mainWindowUnmaximize')
        })
    }

    static show() {
        this._instance.isMinimized() ? this._instance.restore() : this._instance.show()
    }

}
