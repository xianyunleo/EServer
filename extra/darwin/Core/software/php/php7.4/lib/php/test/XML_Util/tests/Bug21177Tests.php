<?php

/**
 * Bug #21177 "XML_Util::collapseEmptyTags() can return NULL"
 *
 * PREG returns NULL when it encounters an error.
 * In this case, it was encountering PREG_BACKTRACK_LIMIT_ERROR.
 *
 * @link https://pear.php.net/bugs/bug.php?id=21177
 */
class Bug21177Tests extends AbstractUnitTests
{
    public function getTestCandidate()
    {
        $expected = '<id_mytest_yesorno />';

        return array(
            array('<idmytestyesorno></idmytestyesorno>',        '<idmytestyesorno />'),
            array('<idmytestyesorno />',                        '<idmytestyesorno />'),

            array('<id_mytest_yesorno></id_mytest_yesorno>',    '<id_mytest_yesorno />'),
            array('<id_mytest_yesorno />',                      '<id_mytest_yesorno />'),
        );
    }

    /**
     * @dataProvider getTestCandidate()
     */
    public function testCollapseEmptyTagsForBug21177($original, $expected)
    {
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($original, XML_UTIL_COLLAPSE_ALL), "Failed bugcheck.");
    }
}
