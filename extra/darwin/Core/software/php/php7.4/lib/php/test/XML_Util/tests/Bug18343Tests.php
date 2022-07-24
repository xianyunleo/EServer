<?php

/**
 * Bug #18343 "Entities in file names decoded during packaging"
 *
 * No matter what flags are given to createTagFromArray(),
 * an attribute must *always* be at least ENTITIES_XML encoded.
 *
 * @link https://pear.php.net/bugs/bug.php?id=18343
 */
class Bug18343Tests extends AbstractUnitTests
{
    private $tagArray = array(
        "qname"      => "install",
        "attributes" => array(
            "as"    => "Horde/Feed/fixtures/lexicon/http-p.moreover.com-cgi-local-page%2Fo=rss&s=Newsweek",
            "name"  => "test/Horde/Feed/fixtures/lexicon/http-p.moreover.com-cgi-local-page%2Fo=rss&s=Newsweek",
        )
    );

    public function getFlagsToTest()
    {
        new XML_Util(); // for constants to be declared

        return array(
            array('no flag', null),
            array('false', false),
            array('ENTITIES_NONE', XML_UTIL_ENTITIES_NONE),
            array('ENTITIES_XML', XML_UTIL_ENTITIES_XML),
            array('ENTITIES_XML_REQUIRED', XML_UTIL_ENTITIES_XML_REQUIRED),
            array('ENTITIES_HTML', XML_UTIL_ENTITIES_HTML),
            array('REPLACE_ENTITIES', XML_UTIL_REPLACE_ENTITIES),
        );
    }

    /**
     * @dataProvider getFlagsToTest()
     */
    public function testCreateTagFromArrayForBug18343($key, $flag)
    {
        // all flags for the candidate input should return the same result
        $expected =
<<< EOF
<install as="Horde/Feed/fixtures/lexicon/http-p.moreover.com-cgi-local-page%2Fo=rss&amp;s=Newsweek" name="test/Horde/Feed/fixtures/lexicon/http-p.moreover.com-cgi-local-page%2Fo=rss&amp;s=Newsweek" />
EOF;
        $this->assertEquals($expected, XML_Util::createTagFromArray($this->tagArray, $flag), "Failed bugcheck for $key.");
    }
}
