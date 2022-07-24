<?php

class ReverseEntitiesTests extends AbstractUnitTests
{
    protected function getSimpleData()
    {
        return 'This string contains &lt; &amp; &gt;.';
    }

    protected function getUtf8Data()
    {
        return 'This data contains special chars like &lt;, &gt;, &amp; and &quot; as well as &auml;, &ouml;, &szlig;, &agrave; and &ecirc;';
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForSimpleData()
    {
        $expected = "This string contains < & >.";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getSimpleData()));
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForSimpleDataWithInvalidOptionReturnsOriginalData()
    {
        $expected = "This string contains &lt; &amp; &gt;.";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getSimpleData(), 'INVALID_OPTION'));
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForSimpleDataWithEntitiesXml()
    {
        $expected = "This string contains < & >.";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getSimpleData(), XML_UTIL_ENTITIES_XML));
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForSimpleDataWithEntitiesXmlAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This string contains < & >.";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getSimpleData(), XML_UTIL_ENTITIES_XML), $encoding);
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForUtf8DataWithEntitiesXmlAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This data contains special chars like <, >, & and \" as well as &auml;, &ouml;, &szlig;, &agrave; and &ecirc;";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getUtf8Data(), XML_UTIL_ENTITIES_XML), $encoding);
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForSimpleDataWithEntitiesXmlRequired()
    {
        $expected = "This string contains < & &gt;.";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getSimpleData(), XML_UTIL_ENTITIES_XML_REQUIRED));
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForSimpleDataWithEntitiesXmlRequiredAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This string contains < & &gt;.";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getSimpleData(), XML_UTIL_ENTITIES_XML_REQUIRED, $encoding));
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForUtf8DataWithEntitiesXmlRequiredAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This data contains special chars like <, &gt;, & and \" as well as &auml;, &ouml;, &szlig;, &agrave; and &ecirc;";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getUtf8Data(), XML_UTIL_ENTITIES_XML_REQUIRED, $encoding));
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForSimpleDataWithEntitiesHtml()
    {
        $expected = "This string contains < & >.";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getSimpleData(), XML_UTIL_ENTITIES_HTML));
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForSimpleDataWithEntitiesHtmlAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This string contains < & >.";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getSimpleData(), XML_UTIL_ENTITIES_HTML, $encoding));
    }

    /**
     * @covers XML_Util::reverseEntities()
     */
    public function testReverseEntitiesForUtf8DataWithEntitiesHtmlAndEncoding()
    {
        $encoding = "UTF-8";
        $expected = "This data contains special chars like <, >, & and \" as well as ä, ö, ß, à and ê";
        $this->assertEquals($expected, XML_Util::reverseEntities($this->getUtf8Data(), XML_UTIL_ENTITIES_HTML, $encoding));
    }
}
