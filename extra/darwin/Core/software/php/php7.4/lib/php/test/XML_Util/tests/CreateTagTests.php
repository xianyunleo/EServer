<?php

class CreateTagTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributes()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $expected = "<myNs:myTag foo=\"bar\" />";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContent()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalContent = "This is inside the tag";
        $expected = "<myNs:myTag foo=\"bar\">This is inside the tag</myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespace()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalContent = "This is inside the tag";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected = "<myNs:myTag foo=\"bar\" xmlns:myNs=\"http://www.w3c.org/myNs#\">This is inside the tag</myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace));
    }


    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespaceWithCDataSection()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalContent = "This is inside the tag and has < & @ > in it";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected = "<myNs:myTag foo=\"bar\" xmlns:myNs=\"http://www.w3c.org/myNs#\"><![CDATA[This is inside the tag and has < & @ > in it]]></myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace, XML_UTIL_CDATA_SECTION));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespaceWithReplaceEntities()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalContent = "This is inside the tag and has < & @ > in it";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected = "<myNs:myTag foo=\"bar\" xmlns:myNs=\"http://www.w3c.org/myNs#\">This is inside the tag and has &lt; &amp; @ &gt; in it</myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace, XML_UTIL_REPLACE_ENTITIES));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespaceWithReplaceEntitiesAndMultilineFalse()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalContent = "This is inside the tag and has < & @ > in it";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $multiline = false;
        $expected = "<myNs:myTag foo=\"bar\" xmlns:myNs=\"http://www.w3c.org/myNs#\">This is inside the tag and has &lt; &amp; @ &gt; in it</myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace, XML_UTIL_REPLACE_ENTITIES, $multiline));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespaceWithReplaceEntitiesAndMultilineTrue()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalContent = "This is inside the tag and has < & @ > in it";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $multiline = true;
        $expected =
<<< EOF
<myNs:myTag foo="bar"
            xmlns:myNs="http://www.w3c.org/myNs#">This is inside the tag and has &lt; &amp; @ &gt; in it</myNs:myTag>
EOF;
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace, XML_UTIL_REPLACE_ENTITIES, $multiline));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespaceWithReplaceEntitiesAndMultilineTrueAndIndent()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalContent = "This is inside the tag and has < & @ > in it";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $multiline = true;
        $indent = "  ";
        $expected =
<<< EOF
<myNs:myTag foo="bar"
  xmlns:myNs="http://www.w3c.org/myNs#">This is inside the tag and has &lt; &amp; @ &gt; in it</myNs:myTag>
EOF;

        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace, XML_UTIL_REPLACE_ENTITIES, $multiline, $indent));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespaceWithReplaceEntitiesAndMultilineTrueAndIndentAndLinebreak()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalContent = "This is inside the tag and has < & @ > in it";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $multiline = true;
        $indent = "  ";
        $linebreak = "^";
        $expected = "<myNs:myTag foo=\"bar\"^  xmlns:myNs=\"http://www.w3c.org/myNs#\">This is inside the tag and has &lt; &amp; @ &gt; in it</myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace, XML_UTIL_REPLACE_ENTITIES, $multiline, $indent, $linebreak));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespaceWithReplaceEntitiesAndMultilineTrueAndIndentAndLinebreakAndSortAttributesTrue()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar", "boo" => "baz");
        $originalContent = "This is inside the tag and has < & @ > in it";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $multiline = true;
        $indent = "  ";
        $linebreak = "^";
        $sortAttributes = true;
        $expected = "<myNs:myTag boo=\"baz\"^  foo=\"bar\"^  xmlns:myNs=\"http://www.w3c.org/myNs#\">This is inside the tag and has &lt; &amp; @ &gt; in it</myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace, XML_UTIL_REPLACE_ENTITIES, $multiline, $indent, $linebreak, $sortAttributes));
    }

    /**
     * @covers XML_Util::createTag()
     */
    public function testCreateTagForTagWithAttributesAndContentAndNamespaceWithReplaceEntitiesAndMultilineTrueAndIndentAndLinebreakAndSortAttributesFalse()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar", "boo" => "baz");
        $originalContent = "This is inside the tag and has < & @ > in it";
        $originalNamespace = "http://www.w3c.org/myNs#";
        $multiline = true;
        $indent = "  ";
        $linebreak = "^";
        $sortAttributes = false;
        $expected = "<myNs:myTag foo=\"bar\"^  boo=\"baz\"^  xmlns:myNs=\"http://www.w3c.org/myNs#\">This is inside the tag and has &lt; &amp; @ &gt; in it</myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createTag($originalTag, $originalAttributes, $originalContent, $originalNamespace, XML_UTIL_REPLACE_ENTITIES, $multiline, $indent, $linebreak, $sortAttributes));
    }
}
