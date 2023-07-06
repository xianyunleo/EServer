export default class Extension {

    static execInstallScript(extName, phpVersion) {
        let extVersion = this.getExtVersion();
    }

    static getExtVersion(extName, phpVersion) {
        phpVersion = Number(phpVersion);
        switch (extName) {
            case 'redis':
                return phpVersion < 7.0 ? '4.3.0' : '5.3.7'
        }

        return null;
    }


}
