import Directory from "@/main/utils/Directory";
import Path from "@/main/utils/Path";
import GetPath from "@/shared/utils/GetPath";
import OS from "@/main/core/OS";

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

    /**
     * 获取php扩展目录
     * @param phpVersion
     * @returns {string}
     */
    static getExtensionDir(phpVersion) {
        if (OS.isWindows()) {
            let phpDir = GetPath.getPhpDir(phpVersion);
            return `${Path.Join(phpDir, 'ext')}`;
        } else {
            let phpDir = GetPath.getPhpDir(phpVersion);
            let dirs = Directory.GetDirectories(`${Path.Join(phpDir, 'lib/php/extensions')}`, 'no-debug-non-zts');
            return dirs[0];
        }
    }
}
