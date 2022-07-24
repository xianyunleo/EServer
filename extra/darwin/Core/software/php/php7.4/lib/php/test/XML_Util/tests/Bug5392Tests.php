<?php

/**
 * Bug #5392 "encoding of ISO-8859-1 is the only supported encoding"
 *
 * Original characters of the given encoding that are "replaced"
 * should then "reverse" back to perfectly match the original.
 *
 * @link https://pear.php.net/bugs/bug.php?id=5392
 */
class Bug5392Tests extends AbstractUnitTests
{
    public function testReplaceEntitiesForBug5392()
    {
        $original = 'This data contains special chars like <, >, & and " as well as ä, ö, ß, à and ê';
        $replacedResult = XML_Util::replaceEntities($original, XML_UTIL_ENTITIES_HTML, "UTF-8");
        $reversedResult = XML_Util::reverseEntities($replacedResult, XML_UTIL_ENTITIES_HTML, "UTF-8");
        $this->assertEquals($original, $reversedResult, "Failed bugcheck.");
    }
}
