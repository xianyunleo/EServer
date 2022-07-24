<?php

class ReplaceEntitiesTests extends AbstractUnitTests
{
    protected function getSimpleData()
    {
        return 'This string contains < & >.';
    }

    protected function getUtf8Data()
    {
        return 'This data contains special chars like <, >, & and " as well as ä, ö, ß, à and ê';
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForSimpleData()
    {
        $expected = "This string contains &lt; &amp; &gt;.";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getSimpleData()));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForSimpleDataWithInvalidOptionReturnsOriginalData()
    {
        $expected = "This string contains < & >.";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getSimpleData(), 'INVALID_OPTION'));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForSimpleDataWithEntitiesXml()
    {
        $expected = "This string contains &lt; &amp; &gt;.";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getSimpleData(), XML_UTIL_ENTITIES_XML));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForSimpleDataWithEntitiesXmlAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This string contains &lt; &amp; &gt;.";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getSimpleData(), XML_UTIL_ENTITIES_XML, $encoding));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForUtf8DataWithEntitiesXmlAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This data contains special chars like &lt;, &gt;, &amp; and &quot; as well as ä, ö, ß, à and ê";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getUtf8Data(), XML_UTIL_ENTITIES_XML, $encoding));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForSimpleDataWithEntitiesXmlRequired()
    {
        $expected = "This string contains &lt; &amp; >.";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getSimpleData(), XML_UTIL_ENTITIES_XML_REQUIRED));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForSimpleDataWithEntitiesXmlRequiredAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This string contains &lt; &amp; >.";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getSimpleData(), XML_UTIL_ENTITIES_XML_REQUIRED, $encoding));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForUtf8DataWithEntitiesXmlRequiredAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This data contains special chars like &lt;, >, &amp; and &quot; as well as ä, ö, ß, à and ê";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getUtf8Data(), XML_UTIL_ENTITIES_XML_REQUIRED, $encoding));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForSimpleDataWithEntitiesHtml()
    {
        $expected = "This string contains &lt; &amp; &gt;.";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getSimpleData(), XML_UTIL_ENTITIES_HTML));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForSimpleDataWithEntitiesHtmlAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This string contains &lt; &amp; &gt;.";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getSimpleData(), XML_UTIL_ENTITIES_HTML, $encoding));
    }

    /**
     * @covers XML_Util::replaceEntities()
     */
    public function testReplaceEntitiesForUtf8DataWithEntitiesHtmlAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This data contains special chars like &lt;, &gt;, &amp; and &quot; as well as &auml;, &ouml;, &szlig;, &agrave; and &ecirc;";
        $this->assertEquals($expected, XML_Util::replaceEntities($this->getUtf8Data(), XML_UTIL_ENTITIES_HTML, $encoding));
    }
}
