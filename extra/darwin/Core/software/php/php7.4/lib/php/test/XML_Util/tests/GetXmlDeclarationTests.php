<?php

class GetXMLDeclarationTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::getXMLDeclaration()
     */
    public function testGetXMLDeclarationUsingVersion()
    {
        $version = "1.0";
        $expected = "<?xml version=\"1.0\"?>";
        $this->assertEquals($expected, XML_Util::getXMLDeclaration($version));
    }

    /**
     * @covers XML_Util::getXMLDeclaration()
     */
    public function testGetXMLDeclarationUsingVersionAndEncodingAndStandalone()
    {
        $version = "1.0";
        $encoding = "UTF-8";
        $standalone = true;
        $expected = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";
        $this->assertEquals($expected, XML_Util::getXMLDeclaration($version, $encoding, $standalone));
    }

    /**
     * @covers XML_Util::getXMLDeclaration()
     */
    public function testGetXMLDeclarationUsingVersionAndStandalone()
    {
        $version = "1.0";
        $encoding = null;
        $standalone = true;
        $expected = "<?xml version=\"1.0\" standalone=\"yes\"?>";
        $this->assertEquals($expected, XML_Util::getXMLDeclaration($version, $encoding, $standalone));
    }
}
