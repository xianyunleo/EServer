<?php

class CreateStartElementTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagOnly()
    {
        $original = "myNs:myTag";
        $expected = "<myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createStartElement($original));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithAttributes()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $expected = "<myNs:myTag foo=\"bar\">";
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithEmptyAttributes()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = "";
        $expected = "<myNs:myTag>";
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithAttributesAndNamespace()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected = "<myNs:myTag foo=\"bar\" xmlns:myNs=\"http://www.w3c.org/myNs#\">";
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes, $originalNamespace));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithEmptyAttributesAndNonUriNamespace()
    {
        $originalTag = "myTag";
        $originalAttributes = "";
        $originalNamespace = "foo";
        $expected = "<myTag xmlns=\"foo\">";
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes, $originalNamespace));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithAttributesAndNamespaceWithMultiline()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected =
<<< EOF
<myNs:myTag foo="bar"
            xmlns:myNs="http://www.w3c.org/myNs#">
EOF;
        $multiline = true;
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes, $originalNamespace, $multiline));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithAttributesAndNamespaceWithMultilineAndIndent()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected =
<<< EOF
<myNs:myTag foo="bar"
  xmlns:myNs="http://www.w3c.org/myNs#">
EOF;
        $multiline = true;
        $indent = "  ";
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes, $originalNamespace, $multiline, $indent));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithAttributesAndNamespaceWithMultilineAndIndentAndLinebreak()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar");
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected = "<myNs:myTag foo=\"bar\"^  xmlns:myNs=\"http://www.w3c.org/myNs#\">";
        $multiline = true;
        $indent = "  ";
        $linebreak = "^";
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes, $originalNamespace, $multiline, $indent, $linebreak));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithAttributesAndNamespaceWithMultilineAndIndentAndLinebreakAndSortAttributesIsTrue()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar", "boo" => "baz");
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected = "<myNs:myTag boo=\"baz\"^  foo=\"bar\"^  xmlns:myNs=\"http://www.w3c.org/myNs#\">";
        $multiline = true;
        $indent = "  ";
        $linebreak = "^";
        $sortAttributes = true;
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes, $originalNamespace, $multiline, $indent, $linebreak, $sortAttributes));
    }

    /**
     * @covers XML_Util::createStartElement()
     */
    public function testCreateStartElementForTagWithAttributesAndNamespaceWithMultilineAndIndentAndLinebreakAndSortAttributesIsFalse()
    {
        $originalTag = "myNs:myTag";
        $originalAttributes = array("foo" => "bar", "boo" => "baz");
        $originalNamespace = "http://www.w3c.org/myNs#";
        $expected = "<myNs:myTag foo=\"bar\"^  boo=\"baz\"^  xmlns:myNs=\"http://www.w3c.org/myNs#\">";
        $multiline = true;
        $indent = "  ";
        $linebreak = "^";
        $sortAttributes = false;
        $this->assertEquals($expected, XML_Util::createStartElement($originalTag, $originalAttributes, $originalNamespace, $multiline, $indent, $linebreak, $sortAttributes));
    }
}
