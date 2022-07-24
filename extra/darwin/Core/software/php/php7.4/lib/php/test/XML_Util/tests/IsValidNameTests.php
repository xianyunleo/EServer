<?php

class IsValidNameTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::isValidName()
     */
    public function testIsValidNameForTagNameThatIsValid()
    {
        $tagName = "alpha-x_y_z.123";
        $result = XML_Util::isValidName($tagName);
        $this->assertTrue($result);
    }

    /**
     * @covers XML_Util::isValidName()
     */
    public function testIsValidNameForTagNameWithInvalidCharacter()
    {
        $tagName = "invalidTag?";
        $result = XML_Util::isValidName($tagName);
        $this->assertInstanceOf('PEAR_Error', $result);
        $expectedError = "XML names may only contain alphanumeric chars, period, hyphen, colon and underscores";
        $this->assertEquals($expectedError, $result->getMessage());
    }

    /**
     * @covers XML_Util::isValidName()
     */
    public function testIsValidNameForTagNameWithInvalidStartingCharacter()
    {
        $tagName = "1234five";
        $result = XML_Util::isValidName($tagName);
        $this->assertInstanceOf('PEAR_Error', $result);
        $expectedError = "XML names may only start with letter or underscore";
        $this->assertEquals($expectedError, $result->getMessage());
    }

    /**
     * @covers XML_Util::isValidName()
     */
    public function testIsValidNameForInt()
    {
        $tagName = 1;
        $result = XML_Util::isValidName($tagName);
        $this->assertInstanceOf('PEAR_Error', $result);
        $expectedError = "XML names may only start with letter or underscore";
        $this->assertEquals($expectedError, $result->getMessage());
    }

    /**
     * @covers XML_Util::isValidName()
     */
    public function testIsValidNameForEmptyString()
    {
        $tagName = '';
        $result = XML_Util::isValidName($tagName);
        $this->assertInstanceOf('PEAR_Error', $result);
        $expectedError = "XML names may only start with letter or underscore";
        $this->assertEquals($expectedError, $result->getMessage());
    }
}
