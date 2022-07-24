#ifndef PHPEXT_IGBINARY_BASE_PHP_IGBINARY_H
#define PHPEXT_IGBINARY_BASE_PHP_IGBINARY_H
#include "php_version.h"
#if PHP_MAJOR_VERSION == 7
#include "ext/igbinary/src/php7/php_igbinary.h"
#else
#error "Unsupported php version for igbinary build"
#endif

/**
 * The below line is redundant
 * (and just mentioning phpext_ in a comment is sufficient).
 * This block is only here to make php-src/build/print_include.awk include this file,
 * when igbinary is placed in php-src/ext/igbinary/ (instead of compiled separately with `phpize; ...`)
 */
#ifndef phpext_igbinary_ptr
extern zend_module_entry igbinary_module_entry;
#define phpext_igbinary_ptr &igbinary_module_entry
#endif
/** End line needed for putting igbinary in php-src/ext/igbinary to work */

#endif
