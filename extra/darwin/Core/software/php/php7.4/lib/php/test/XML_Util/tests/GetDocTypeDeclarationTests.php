<?php

class GetDocTypeDeclarationTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::getDocTypeDeclaration()
     */
    public function testGetDocTypeDeclarationUsingRoot()
    {
        $expected = "<!DOCTYPE rootTag>";
        $this->assertEquals($expected, XML_Util::getDocTypeDeclaration("rootTag"));
    }

    /**
     * @covers XML_Util::getDocTypeDeclaration()
     */
    public function testGetDocTypeDeclarationUsingRootAndStringUri()
    {
        $expected = "<!DOCTYPE rootTag SYSTEM \"myDocType.dtd\">";
        $this->assertEquals($expected, XML_Util::getDocTypeDeclaration("rootTag", "myDocType.dtd"));
    }

    /**
     * @covers XML_Util::getDocTypeDeclaration()
     */
    public function testGetDocTypeDeclarationUsingRootAndArrayUri()
    {
        $uri = array(
            'uri' => 'http://pear.php.net/dtd/package-1.0',
            'id' => '-//PHP//PEAR/DTD PACKAGE 0.1'
        );
        $expected = "<!DOCTYPE rootTag PUBLIC \"-//PHP//PEAR/DTD PACKAGE 0.1\" \"http://pear.php.net/dtd/package-1.0\">";
        $this->assertEquals($expected, XML_Util::getDocTypeDeclaration("rootTag", $uri));
    }

    /**
     * @covers XML_Util::getDocTypeDeclaration()
     */
    public function testGetDocTypeDeclarationUsingRootAndArrayUriAndInternalDtd()
    {
        $uri = array(
            'uri' => 'http://pear.php.net/dtd/package-1.0',
            'id' => '-//PHP//PEAR/DTD PACKAGE 0.1'
        );
        $dtdEntry = '<!ELEMENT additionalInfo (#PCDATA)>';
        $expected =
<<< EOF
<!DOCTYPE rootTag PUBLIC "-//PHP//PEAR/DTD PACKAGE 0.1" "http://pear.php.net/dtd/package-1.0" [
<!ELEMENT additionalInfo (#PCDATA)>
]>
EOF;
        $this->assertEquals($expected, XML_Util::getDocTypeDeclaration("rootTag", $uri, $dtdEntry));
    }
}
