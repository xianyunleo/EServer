/*
   +----------------------------------------------------------------------+
   | PHP Version 7                                                        |
   +----------------------------------------------------------------------+
   | Copyright (c) The PHP Group                                          |
   +----------------------------------------------------------------------+
   | This source file is subject to version 3.01 of the PHP license,      |
   | that is bundled with this package in the file LICENSE, and is        |
   | available through the world-wide-web at the following url:           |
   | http://www.php.net/license/3_01.txt                                  |
   | If you did not receive a copy of the PHP license and are unable to   |
   | obtain it through the world-wide-web, please send a note to          |
   | license@php.net so we can mail you a copy immediately.               |
   +----------------------------------------------------------------------+
   | Author: Stig Sæther Bakken <ssb@php.net>                             |
   +----------------------------------------------------------------------+
*/

#define CONFIGURE_COMMAND " './configure'  '--with-apxs2=/Applications/MAMP/Library/bin/apxs' '--with-zlib' '--with-zlib-dir=/Applications/MAMP/Library' '--prefix=/Applications/MAMP/bin/php/php7.4.21' '--exec-prefix=/Applications/MAMP/bin/php/php7.4.21' '--sysconfdir=/Applications/MAMP/bin/php/php7.4.21/conf' '--with-config-file-path=/Applications/MAMP/bin/php/php7.4.21/conf' '--enable-ftp' '--with-bz2=/Applications/MAMP/Library' '--with-mysqli=mysqlnd' '--enable-mbstring=all' '--with-curl=/Applications/MAMP/Library' '--enable-sockets' '--enable-bcmath' '--enable-soap' '--enable-calendar' '--with-pgsql=shared,/Applications/MAMP/Library/pg' '--enable-exif' '--with-gettext=shared,/Applications/MAMP/Library' '--with-xsl=/Applications/MAMP/Library' '--with-pdo-mysql=mysqlnd' '--with-pdo-pgsql=shared,/Applications/MAMP/Library/pg' '--with-openssl=/Applications/MAMP/Library' '--with-iconv=/Applications/MAMP/Library' '--enable-opcache' '--enable-intl' '--with-tidy=shared,/Applications/MAMP/Library' '--with-readline' '--with-mhash' '--with-iconv-dir=/Applications/MAMP/Library' '--with-sodium=/Applications/MAMP/Library' '--with-password-argon2=/Applications/MAMP/Library' '--with-zip' '--with-xmlrpc' '--with-kerberos' '--with-pdo-sqlite' '--with-sqlite3' '--with-ldap=/Applications/MAMP/Library' '--with-ldap-sasl' '--with-imap=shared,/Applications/MAMP/Library/lib/imap-2007f/lib' '--with-imap-ssl=/Applications/MAMP/Library' '--disable-phpdbg' '--enable-cgi' '--enable-gd' '--with-webp' '--with-jpeg' '--with-freetype' '--enable-pcntl' 'KERBEROS_CFLAGS=-I/usr/include' 'KERBEROS_LIBS=-lkrb5' 'SQLITE_CFLAGS= ' 'SQLITE_LIBS=-lsqlite3' 'JPEG_CFLAGS= ' 'JPEG_LIBS=-ljpeg' 'SASL_CFLAGS=-I/usr/include/sasl' 'SASL_LIBS=-lsasl2'"
#define PHP_ODBC_CFLAGS	""
#define PHP_ODBC_LFLAGS		""
#define PHP_ODBC_LIBS		""
#define PHP_ODBC_TYPE		""
#define PHP_OCI8_DIR			""
#define PHP_OCI8_ORACLE_VERSION		""
#define PHP_PROG_SENDMAIL	"/usr/sbin/sendmail"
#define PEAR_INSTALLDIR         ""
#define PHP_INCLUDE_PATH	".:"
#define PHP_EXTENSION_DIR       "/Applications/MAMP/bin/php/php7.4.21/lib/php/extensions/no-debug-non-zts-20190902"
#define PHP_PREFIX              "/Applications/MAMP/bin/php/php7.4.21"
#define PHP_BINDIR              "/Applications/MAMP/bin/php/php7.4.21/bin"
#define PHP_SBINDIR             "/Applications/MAMP/bin/php/php7.4.21/sbin"
#define PHP_MANDIR              "/Applications/MAMP/bin/php/php7.4.21/php/man"
#define PHP_LIBDIR              "/Applications/MAMP/bin/php/php7.4.21/lib/php"
#define PHP_DATADIR             "/Applications/MAMP/bin/php/php7.4.21/share/php"
#define PHP_SYSCONFDIR          "/Applications/MAMP/bin/php/php7.4.21/conf"
#define PHP_LOCALSTATEDIR       "/Applications/MAMP/bin/php/php7.4.21/var"
#define PHP_CONFIG_FILE_PATH    "/Applications/MAMP/bin/php/php7.4.21/conf"
#define PHP_CONFIG_FILE_SCAN_DIR    ""
#define PHP_SHLIB_SUFFIX        "so"
#define PHP_SHLIB_EXT_PREFIX    ""
