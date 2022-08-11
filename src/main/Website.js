import {getNginxVhostsPath} from "@/main/path";
import {dirGetFiles} from "@/main/utils";


export default class Website {
    static async add(webServerInfo) {
        let confText =
`server
{
    listen ${webServerInfo.port};
    server_name ${webServerInfo.serverName};
    index index.html index.htm index.php;
    root  ${webServerInfo.rootPath};

    autoindex on;
    
    #PHP_START
    #PHP_END

    #301_START
    #301_END

    #HTTP_TO_HTTPS_START
    #HTTP_TO_HTTPS_END

    #SSL_START
    #SSL_END

    #REWRITE_START
    #REWRITE_END

    #DENY_FILES_START
    location ~ ^/(\\.user.ini|\\.htaccess|\\.git|\\.svn|\\.project|LICENSE|README.md)
    {
        return 403;
    }
    #DENY_FILES_END

    location ~ .+\\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      1d;
        error_log off;
        access_log off;
    }

    location ~ .+\\.(js|css)$
    {
        expires      1h;
        error_log off;
        access_log off;
    }

    location = /favicon.ico {
        log_not_found off;
        access_log off;
    }

    access_log  logs/localhost.access.log;
    error_log  logs/localhost.error.log;
}`
        console.log(confText)
    }

    static isExist(serverName){
        let vhosts = dirGetFiles(getNginxVhostsPath(),'.conf');
        return vhosts.includes(`${serverName}.confg`)
    }
}