<?php

class RaiseErrorTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::raiseError()
     */
    public function testRaiseError()
    {
        $code = 12345;
        $message = "I am an error";
        $error = XML_Util::raiseError($message, $code);
        $this->assertInstanceOf('PEAR_Error', $error);
        $this->assertEquals($message, $error->getMessage());
        $this->assertEquals($code, $error->getCode());
    }
}
