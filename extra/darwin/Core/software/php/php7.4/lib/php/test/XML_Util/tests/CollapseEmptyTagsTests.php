<?php

class CollapseEmptyTagsTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsBasicUsage()
    {
        $emptyTag = "<foo></foo>";
        $expected = "<foo />";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsBasicUsageAlongsideNonemptyTag()
    {
        $emptyTag = "<foo></foo>";
        $otherTag = "<bar>baz</bar>";
        $expected = "<foo /><bar>baz</bar>";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag . $otherTag));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyTagWithCollapseAll()
    {
        $emptyTag = "<foo></foo>";
        $expected = "<foo />";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag, XML_UTIL_COLLAPSE_ALL));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyTagAlongsideNonemptyTagWithCollapseAll()
    {
        $emptyTag = "<foo></foo>";
        $otherTag = "<bar>baz</bar>";
        $expected = "<foo /><bar>baz</bar>";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag . $otherTag, XML_UTIL_COLLAPSE_ALL));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyTagAlongsideNonemptyTagAlongsideEmptyTagWithCollapseAll()
    {
        $emptyTag = "<foo></foo>";
        $otherTag = "<bar>baz</bar>";
        $expected = "<foo /><bar>baz</bar><foo />";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag . $otherTag . $emptyTag, XML_UTIL_COLLAPSE_ALL));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyPrefixedTagAlongsideNonemptyTagAlongsideEmptyPrefixedTagWithCollapseAll()
    {
        $emptyTag = "<foo:foo2></foo:foo2>";
        $otherTag = "<bar>baz</bar>";
        $expected = "<foo:foo2 /><bar>baz</bar><foo:foo2 />";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag . $otherTag . $emptyTag, XML_UTIL_COLLAPSE_ALL));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyNsPrefixedTagAlongsideNonemptyTagAlongsideEmptyNsPrefixedTagWithCollapseAll()
    {
        $emptyTag = "<http://foo.com:foo2></http://foo.com:foo2>";
        $otherTag = "<bar>baz</bar>";
        $expected = "<http://foo.com:foo2 /><bar>baz</bar><http://foo.com:foo2 />";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag . $otherTag . $emptyTag, XML_UTIL_COLLAPSE_ALL));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyTagWithCollapseXhtml()
    {
        $emptyTag = "<foo></foo>";
        $expected = "<foo></foo>";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag, XML_UTIL_COLLAPSE_XHTML_ONLY));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyTagAlongsideNonemptyTagWithCollapseXhtml()
    {
        $emptyTag = "<foo></foo>";
        $otherTag = "<bar>baz</bar>";
        $xhtmlTag = "<br></br>";
        $expected = "<foo></foo><br /><bar>baz</bar>";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag . $xhtmlTag . $otherTag, XML_UTIL_COLLAPSE_XHTML_ONLY));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyTagWithCollapseNone()
    {
        $emptyTag = "<foo></foo>";
        $expected = "<foo></foo>";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag, XML_UTIL_COLLAPSE_NONE));
    }

    /**
     * @covers XML_Util::collapseEmptyTags()
     */
    public function testCollapseEmptyTagsOnOneEmptyTagAlongsideNonemptyTagWithCollapseNone()
    {
        $emptyTag = "<foo></foo>";
        $otherTag = "<bar>baz</bar>";
        $expected = "<foo></foo><bar>baz</bar>";
        $this->assertEquals($expected, XML_Util::collapseEmptyTags($emptyTag . $otherTag, XML_UTIL_COLLAPSE_NONE));
    }
}
