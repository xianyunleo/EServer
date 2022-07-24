<?php

class SplitQualifiedNameTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::splitQualifiedName()
     */
    public function testSplitQualifiedNameWithoutNamespace()
    {
        $original = "xslt:stylesheet";
        $expected = array(
            'namespace' => 'xslt',
            'localPart' => 'stylesheet',
        );
        $this->assertEquals($expected, XML_Util::splitQualifiedName($original));
    }

    /**
     * @covers XML_Util::splitQualifiedName()
     */
    public function testSplitQualifiedNameWithNamespace()
    {
        $original = "stylesheet";
        $namespace = "myNs";
        $expected = array(
            'namespace' => 'myNs',
            'localPart' => 'stylesheet',
        );
        $this->assertEquals($expected, XML_Util::splitQualifiedName($original, $namespace));
    }
}
