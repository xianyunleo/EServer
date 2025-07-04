import { app} from 'electron'
export default class MainWindow {

    static _instance;
    static forceQuit = false;

    static getInstance(){
        return MainWindow._instance
    }

    /**
     *
     * @param mainWindow {BrowserWindow}
     */
    static init(mainWindow) {
        if (MainWindow._instance) return
        MainWindow._instance = mainWindow
        mainWindow.on('close', (event) => {
            if (!MainWindow.forceQuit) {
                event.preventDefault();
                if (mainWindow.isFullScreen()) {
                    mainWindow.once('leave-full-screen', () => MainWindow.hide())

                    mainWindow.setFullScreen(false)
                } else {
                    MainWindow.hide()
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
        MainWindow._instance.isMinimized() ? MainWindow._instance.restore() : MainWindow._instance.show()
        app.dock?.show()
    }

    static hide(){
        MainWindow._instance.hide()
        app.dock?.hide()
    }

}
