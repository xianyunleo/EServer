<?php

class CreateCDataSectionTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::createCDataSection()
     */
    public function testCreateCDataSectionBasicUsage()
    {
        $original = "I am content.";
        $expected ="<![CDATA[I am content.]]>";
        $this->assertEquals($expected, XML_Util::createCDataSection($original));
    }
}
