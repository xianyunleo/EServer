<?php

/**
 * Bug #4950 "Incorrect CDATA serializing"
 *
 * Content that looks like CDATA end characters and tags
 * should still be recognized solely as content text.
 *
 * @link https://pear.php.net/bugs/bug.php?id=4950
 */
class Bug4950Tests extends AbstractUnitTests
{
    public function testCreateTagForBug4950()
    {
        $qname = "test";
        $attributes = array();
        $content = "Content ]]></test> here!";
        $namespaceUrl = null;
        $expected = "<test><![CDATA[Content ]]]]><![CDATA[></test> here!]]></test>";
        $result = XML_Util::createTag($qname, $attributes, $content, $namespaceUrl, XML_UTIL_CDATA_SECTION);
        $this->assertEquals($expected, $result, "Failed bugcheck.");
    }
}
