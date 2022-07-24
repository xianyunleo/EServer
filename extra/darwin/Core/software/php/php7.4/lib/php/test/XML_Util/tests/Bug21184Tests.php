<?php

/**
 * Bug #21184
 *
 * PREG returns NULL when it encounters an error.
 * In this case, it was encountering PREG_BACKTRACK_LIMIT_ERROR.
 *
 * @link https://pear.php.net/bugs/bug.php?id=21177
 */
class Bug21184 extends AbstractUnitTests
{
    public function testBug21184()
    {
        $xml = '<XML_Serializer_Tag>one</XML_Serializer_Tag>';
        $this->assertEquals($xml, XML_Util::collapseEmptyTags($xml, XML_UTIL_COLLAPSE_ALL));
    }
}
