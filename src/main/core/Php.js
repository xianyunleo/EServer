export default class Php {

    // static switchExtension(version, extension, open) {
    //
    // }

    /**
     *
     * @param originText {string}
     * @param extension {string}
     * @param open {boolean}
     * @returns {string}
     */
    static getSwitchExtensionConfText(originText, extension, open) {
        // eslint-disable-next-line no-control-regex
        let regx = new RegExp(`(?<=\n);?\\s?extension\\s*=\\s*${extension}\\s*`);
        let replaceText = `extension=${extension}`;
        if (!open) {
            replaceText = `;${replaceText}`
        }
        return originText.replace(regx, replaceText);
    }
}
