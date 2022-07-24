<?php

class CreateCommentTests extends AbstractUnitTests
{
    /**
     * @covers XML_Util::createComment()
     */
    public function testCreateCommentBasicUsage()
    {
        $original = "I am comment.";
        $expected = "<!-- I am comment. -->";
        $this->assertEquals($expected, XML_Util::createComment($original));
    }
}
