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
        //(?<=\n);?.?extension\s*=\s*bz2.*
        let regx = new RegExp(`(?<=\\n);?.?extension\\s*=\\s*${extension}.*`);

        return originText.replace(regx, (match) => {
            let replaceText = match.trim();
            if (open) {
                if (replaceText.charAt(0) === ';') {
                    replaceText = replaceText.replace(';', '');
                }
            } else {
                if (replaceText.charAt(0) !== ';') {
                    replaceText = `;${replaceText}`;
                }
            }
            return replaceText;
        });
    }
}
