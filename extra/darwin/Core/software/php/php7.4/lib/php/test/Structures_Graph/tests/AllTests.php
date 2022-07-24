<?php
require_once dirname(__FILE__) . '/helper.inc';

class Structures_Graph_AllTests
{
    public static function main()
    {
        PHPUnit_TextUI_TestRunner::run(self::suite());
    }

    public static function suite()
    {
        $suite = new PHPUnit_Framework_TestSuite('Structures_Graph Tests');

        $dir = new GlobIterator(dirname(__FILE__) . '/*Test.php');
        $suite->addTestFiles($dir);

        return $suite;
    }
}
