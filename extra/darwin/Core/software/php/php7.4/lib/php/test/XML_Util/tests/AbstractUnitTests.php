<?php

/*
 * Allow for PHPUnit 4.* while XML_Util is still usable on PHP 5.4
 */
if (!class_exists('PHPUnit_Framework_TestCase')) {
    class PHPUnit_Framework_TestCase extends \PHPUnit\Framework\TestCase {}
}

abstract class AbstractUnitTests extends \PHPUnit_Framework_TestCase
{
    public function setUp()
    {
        // ensure the class is defined, and thus its constants are declared
        new XML_Util();
    }
}
